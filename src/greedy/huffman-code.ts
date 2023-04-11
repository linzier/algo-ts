/**
 * 哈夫曼编码
 */

import os from 'node:os'
import { MinPriorityQueue } from '../data-structure/priority-queue'

// 哈夫曼树节点
interface Node {
    // 字符
    char: number;
    // 频率
    freq: number;
    // 左节点
    left: Node | null;
    // 右节点
    right: Node | null;
    // 是否叶节点
    isLeaf: boolean;
}

// 哈夫曼编码
interface HCode {
    // 编码，用字节数组存放
    // 对于 256 个字符（单字节最大数），编码最大长度为 255（频率取斐波那契数的情况）
    // 所以创建一个 32 字节大小的 Buffer 存储（存储顺序：从左到右）
    buff: Buffer;
    // 编码的确切长度（比特数）
    length: number;
    // 频率
    freq: number;
}

/**
 * 哈夫曼编码
 */
class HuffmanEncoder {
    /**
     * 哈夫曼压缩
     */
    public encode(text: string | Buffer): Buffer {
        const buf = typeof text === 'string' ? Buffer.from(text) : text

        // 如果只有一个字节，不走压缩了，直接返回原串
        if (buf.byteLength <= 1) {
            return buf
        }

        // 计算每个字符的编码值
        const hcodes = this.huffmanCode(buf)
        console.log('hcodes:', hcodes)

        // 计算编码后字节数
        let len = 0
        for (const code of hcodes.values()) {
            len += code.length * code.freq
        }
        len = Math.ceil(len / 8)
        console.log(len)

        // 元数据
        const metaBuff = this.metaData(hcodes, len)
        // 测试
        console.log('meta: ', metaBuff)

        // zipBuff 中由元数据+压缩字符串两部分构成
        const metaLen = metaBuff.length
        const zipBuff = Buffer.alloc(metaLen + len)

        // 将元数据拷贝到缓冲区
        zipBuff.set(metaBuff, 0)

        // 当前处理到的 bit 位数，初始化为元数据的比特数
        let bitcnt = metaLen << 3

        // 逐字节处理
        for (let i = 0; i < buf.length; i++) {
            // 字符对应的哈夫曼编码
            const hcode = hcodes.get(buf[i])
            const codeBuff = hcode.buff

            // 逐比特转换
            for (let j = 0; j < hcode.length; j++) {
                // 含义：取哈夫曼编码缓冲中对应比特的值
                // codeBuff[j >> 3] 定位到缓冲数组对应的字节
                // j & 7 是字节内比特偏移值。对字节右移该偏移量将需要的字节移到最右边
                // & 128 将该字节除了最右边以外的比特位全部变成 0
                const bit = (codeBuff[j >> 3] << (j & 7)) & 128

                if (bit === 0) {
                    // 因为 Buffer.alloc 函数会用 0 初始化 bit 位，所以这里无需处理了
                    bitcnt++
                    continue
                }

                // 计算压缩缓冲区的字节下标和字节内部偏移量
                const index = bitcnt >> 3 
                const offset = bitcnt & 7 

                // 将相应比特位设置为 1
                zipBuff[index] = zipBuff[index] | (1 << (7 - offset))
                bitcnt++
            }
        }

        // 最后一个字节可能没放满，需要额外记录一下
        // 对 7 取模即可
        // 注意 bitcnt 要减去元数据的比特数
        const surplus = (bitcnt - (metaLen << 3)) & 7

        // 将剩余比特数存入元数据中
        if (surplus) {
            zipBuff[8] = surplus
        }

        return zipBuff
    }

    /**
     * 生成元数据
     * 格式：压缩字符串字节数(8 字节) + 最后一字节有效比特数(1 字节) + 编码表字节数(即哈夫曼编码占用字节数，4 字节) + 编码表
     * 编码表格式：字符(1 字节) + 编码比特数(1 字节) + 编码（至少 1 字节）
     * @param hcodes - 哈夫曼编码
     * @param bitcnt - 编码后字符串字节数
     */
    private metaData(hcodes: Map<number, HCode>, bitcnt: number): Buffer {
        let size = 13
        for (const hcode of hcodes.values()) {
            size += 2 + Math.ceil(hcode.length / 8)
        }

        const buf = Buffer.alloc(size)
        let pos = 0

        // 压缩字符串字节数(8 字节)
        os.endianness() === 'LE' ? buf.writeDoubleLE(bitcnt, pos) : buf.writeDoubleBE(bitcnt, pos)
        pos += 8

        // 有效比特数位置暂时空着（供后面填入）
        pos++

        // 编码表字节数（4 字节）
        os.endianness() === 'LE' ? buf.writeUInt32LE(size - 13, pos) : buf.writeUInt32BE(size - 13, pos)
        pos += 4
        // 测试
        console.log('encode.编码表字节数：', size - 13)

        // 编码表
        for (const [char, hcode] of hcodes) {
            // 字符（1 字节）
            buf.writeUint8(char, pos++)

            // 编码比特数（1 字节）
            buf.writeUint8(hcode.length, pos++)

            // 编码比特
            const byteLen = Math.ceil(hcode.length / 8)
            buf.set(Uint8Array.prototype.slice.call(hcode.buff, 0, byteLen), pos)
            pos += byteLen
        }

        return buf
    }

    /**
     * 根据字符频率计算哈夫曼编码
     * 基于最小优先队列生成
     * @param freqs - 每个字符出现的频率，数组下标表示字符的码值
     * @returns 字符 -> 编码
     */
    private huffmanCode(buf: Buffer): Map<number, HCode> {
        // 计算字符频率
        const freqs = this.calcFreqs(buf)
        // 最小优先队列
        const queue = new MinPriorityQueue()

        for (let i = 0; i < freqs.length; i++) {
            if (!freqs[i]) {
                continue
            }

            // 测试
            console.log('', 'char', i, ' freq:', freqs[i])

            // 加入到优先队列中，以频率作为 key，Node 作为 val
            queue.insert({
                key: freqs[i],
                val: { char: i, freq: freqs[i], left: null, right: null, isLeaf: true }
            })
        }

        // 构建哈夫曼树
        const htRoot = this.huffmanTree(queue)

        // 生成哈夫曼编码，格式：字符 -> 编码
        const hcodes: Map<number, HCode> = new Map()
        this.tree2code(htRoot, '', hcodes)

        return hcodes
    }

    /**
     * 根据哈夫曼树构建哈夫曼编码
     * @param root - 哈夫曼树
     * @param tmpCode - 保存哈夫曼编码中间值
     * @param map - 保存最终的哈夫曼编码
     */
    private tree2code(root: Node, tmpCode: string, map: Map<number, HCode>) {
        if (root.isLeaf) {
            tmpCode = tmpCode || '0'
            map.set(root.char, { buff: this.str2bits(tmpCode), length: tmpCode.length, freq: root.freq })

            // 测试
            console.log(root.char, ' ', tmpCode)
            return
        }

        // 非叶节点，继续处理左右子节点
        this.tree2code(root.left, tmpCode + '0', map)
        this.tree2code(root.right, tmpCode + '1', map)
    }

    /**
     * 二进制字符串转成 bit 为，返回 Buffer
     * @param bitStr - 二进制字符串，如 "10010101010"
     */
    private str2bits(bitStr: string): Buffer {
        const buff = Buffer.alloc(32)
        // 将字符串转成比特
        for (let i = 0; i < bitStr.length; i++) {
            // 0 位不用处理（ Buffer 初始化就是 0）
            if (bitStr[i] === '0') {
                continue
            }

            // 整除 8（i >> 3）得到数组下标；模 8（i & 7）得到字节内偏移量
            // 由于是从左到右的，所以 1 要左移的位移量等于 7 - (i % 8)
            buff[i >> 3] |=  1 << (7 - (i & 7))
        }

        return buff
    }

    /**
     * 基于最小优先队列构建哈夫曼树
     * @param queue - 最小优先队列
     */
    private huffmanTree(queue: MinPriorityQueue): Node {
        // 自叶子节点向上处理，直到队列中只有一个节点，该节点就是根节点
        // 共执行 queue.size - 1 次
        const qlen = queue.size()
        for (let i = 0; i < qlen - 1; i++) {
            // 取频率最小的两个元素
            const left = queue.extract().val as Node
            const right = queue.extract().val as Node

            // 创建新节点（父节点），其 char 随便填
            const parent = { char: 0, freq: left.freq + right.freq, left, right, isLeaf: false }

            // 将父节点放入队列中
            queue.insert({ key: parent.freq, val: parent })
        }

        return queue.extract().val as Node
    }

    /**
     * 计算文本中每个字符出现的频率
     * @param buf - 字符串的字节缓冲
     */
    private calcFreqs(buf: Buffer): number[] {
        // 用于记录每个字节出现的频率。单字节范围：0 ~ 255。初始化为 0
        const freqs: number[] = new Array(256).fill(0)
        
        for (let i = 0; i < buf.length; i++) {
            freqs[buf[i]]++
        }

        return freqs
    }
}

/**
 * 哈夫曼解码
 * 我们将编码转成哈夫曼树，根据哈夫曼树来解码字符串
 */
class HuffmanDecoder {
    public decode(text: string | Buffer): Buffer {
        const buf = typeof text === 'string' ? Buffer.from(text) : text

        // 如果只有一个字节，直接返回原串
        if (buf.byteLength <= 1) {
            return buf
        }

        // 提取编码表（哈夫曼树）
        const htree = this.buildHuffmanTree(buf)

        // 解码
        
    }

    /**
     * 从压缩字节中提取编码表并根据编码表生成哈夫曼树
     * 元数据格式：压缩字符串字节数(8 字节) + 最后一字节有效比特数(1 字节) + 编码表字节数(即哈夫曼编码占用字节数，4 字节) + 编码表
     * 编码表格式：字符(1 字节) + 编码比特数(1 字节) + 编码（至少 1 字节）
     * @param buf - 压缩后字节数组
     * @returns 哈夫曼树根节点
     */
    private buildHuffmanTree(buf: Buffer): Node {
        // 跳过 9 个字节
        let pos = 9
        const isLE = os.endianness() === 'LE'

        // 编码表字节数
        const tableSize = isLE ? buf.readUInt32LE(pos) : buf.readUInt32BE(pos)
        pos += 4

        // 读取并生成哈夫曼树（不用管频率）
        // 初始化根节点
        const root: Node = { char: 0, freq: 0, left: null, right: null, isLeaf: false }
        // 编码字节右边界
        const last = pos + tableSize
        while (pos < last) {
            // 字符（1 字节）
            const char = buf.readUInt8(pos++)
            // 编码比特数（1 字节）
            let bitcnt = buf.readUInt8(pos++)
            // 节点指针，初始化指向 root
            let currNode = root

            // 根据编码比特生成树
            // 逐字节处理
            while (bitcnt > 0) {
                // 本次要处理的比特数
                let n = bitcnt > 8 ? 8 : bitcnt
                const byte = buf[pos]
                // 将从左到右第 n 为设置为 1 ，方便下面运算
                const mask = 128 >> (n - 1)
                // 逐比特处理
                while (n-- > 0) {
                    // 逐比特判断并生成树节点
                    // 自左向右处理
                    const bit = (mask << n) & byte

                    let node = bit && currNode.right || !bit && currNode.left
                    if (node) {
                        // 对应的节点已经存在了，则无需创建
                        currNode = node
                        continue
                    }

                    // 创建新节点
                    node = { char: 0, freq: 0, left: null, right: null, isLeaf: false }
                    // 叶节点特殊处理
                    // 叶节点判断条件：当前是最后一个字节，且处理到最后一个比特
                    if (n == 0 && bitcnt <= 8) {
                        node.char = char
                        node.isLeaf = true
                    }

                    bit ? currNode.right = node : currNode.left = node

                    // 将 curr 指针指向当前节点
                    currNode = node
                }

                // 剩余待处理比特数减 8
                bitcnt -= 8
                // buf 向后移动 1 字节
                pos++
            }
        }

        return root
    }
}

export { HuffmanEncoder, HuffmanDecoder }