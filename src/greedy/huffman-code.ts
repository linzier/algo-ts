/**
 * 哈夫曼编码以及利用哈夫曼编码压缩和解压数据。
 * 哈夫曼编码基于哈夫曼树。
 * 给定 N 个权值作为 N 个叶子结点，构造一棵二叉树，若该树的带权路径长度达到最小，称这样的二叉树为最优二叉树，也称为哈夫曼树(Huffman Tree)。
 * 哈夫曼树是带权路径长度最短的树，权值较大的结点离根较近。
 * 
 * 哈夫曼树的构建：
 * 基于贪心算法实现，可以借助最小优先队列。
 * 例：
 * 有文本字符串 T，其构成字符以及频率如下：
 * E:1, M:2, C:3, A:3, D:4。
 * 构造哈夫曼树的思路：
 * 1. 将所有字符各自作为独立的节点（相当于只有根的数），构成一个集合 S（或说森林）；
 * 2. 从 S 中取出频率最小的两个节点（本例是 E 和 M，取出的意味着同时从 S 中删除这两个节点），创建一个新节点 N，这两个节点分别作为 N 的左右子节点，
 *    N 的频率等于两个子节点频率之和（本例是 1 + 2 = 3);
 * 3. 将新节点 N 放入集合 S 中；
 * 4. 重复步骤 2、3，直到集合 S 中只有一个节点（即构成的整棵树的根）；
 *（贪心算法：每次总是从集合中取频率最小的两个元素，这种取法使得频率越大的越晚构建，也就离树根越近。）
 * 
 * 对于文本 T，构成哈夫曼树过程如下：
 * 1. 初始态，集合中元素：E(1), M(2), C(3), A(3), D(4)；
 * 2. 取 E(1)、M(2)，生成新节点 (3) 并放入集合中，集合中元素变为：(3), C(3), A(3), D(4)；
 * 3. 取 (3)、C(3)，生成新节点 (6) 并放入集合中，集合中元素变为：A(3), D(4), (6)；
 * 4. 取 A(3)、D(4)，生成新节点 (7) 并放入集合中，集合中元素变为：(6), (7)；
 * 5. 取 (6)、(7)，生成新节点 (13) 并放入集合中，集合中元素变为：(13)；
 * 6. 集合中只有一个 (13)，即整棵树的根；
 * 
 * 最终构成的树如下：
 *                                      (13)
 *                                  /          \
 *                               (6)           (7)
 *                             /     \        /   \
 *                           (3)     C(3)   A(3)  D(4)
 *                         /     \
 *                       E(1)    M(2)
 * 
 * 如上图，频率最低的字符 E 的路径最长，频率最高的 D 路径最短（路径：从根到该节点简单路径上边数量）。
 * 
 * 根据哈夫曼树生成哈夫曼编码：
 * 从根开始往下遍历每个叶节点，每经过左子节点取 0，经过右子节点则取 1。
 * E: 000
 * M: 001
 * C: 01
 * A: 10
 * D: 11
 * 可见，频率最高的 D 和 A 转成哈夫曼编码后只占 2 个比特。
 * 
 * 编码（压缩）：
 * 压缩的本质是将字符原码替换成哈夫曼编码，由于哈夫曼编码中，频率越高的字符其编码占比特数越少，所以整体起到了压缩的作用。
 * 例如，按照上面的编码对字符串 DAM 执行编码：
 * 编码前二进制串：01000100 01000001 01001101，占 3 字节。
 * 编码后二进制串：1110001，占 1 字节。
 * 
 * 解码（解压）：
 * 先将编码表（即字符和哈夫曼编码之间的映射关系）转换为哈夫曼树，然后根据哈夫曼树来解码，具体参见代码实现。 
 */

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
     * 压缩
     * @param buf - 字节数组
     * @returns 压缩后的字节数组
     */
    public encode(buf: Buffer): Buffer {
        // 如果只有 21 个字节，不走压缩了，直接返回原串（因为元数据至少是 21 字节）
        if (buf.byteLength <= 21) {
            return buf
        }

        // 计算每个字符的编码值
        const hcodes = this.huffmanCode(buf)

        // 计算编码后比特数
        let zipBitCnt = 0
        for (const code of hcodes.values()) {
            zipBitCnt += code.length * code.freq
        }
        
        // 元数据 Buffer
        const metaBuff = this.metaData(hcodes, buf.byteLength,  zipBitCnt)

        // zipBuff 中由元数据+压缩字符串两部分构成
        const metaLen = metaBuff.length
        const zipBuff = Buffer.alloc(metaLen + Math.ceil(zipBitCnt / 8))

        // 将元数据拷贝到缓冲区
        zipBuff.set(metaBuff, 0)

        // 当前处理到的 bit 位数，初始化为元数据的比特数
        let pos = metaLen << 3

        // 逐字节压缩
        // 所谓压缩，就是将原字节转换成哈夫曼编码（比特位）
        for (let i = 0; i < buf.length; i++) {
            // 字符对应的哈夫曼编码
            const hcode = hcodes.get(buf[i])
            // 哈夫曼编码比特存放在 Buffer 中
            const codeBuff = hcode.buff

            // 逐比特转换
            for (let j = 0; j < hcode.length; j++) {
                // 取哈夫曼编码（字节数组）中对应比特的值
                // codeBuff[j >> 3] 定位到缓冲数组对应的字节
                // j & 7 是字节内比特偏移值。对字节右移该偏移量将需要的比特移到最右边
                // & 128 将该字节除了最右边以外的比特位全部变成 0
                const bit = (codeBuff[j >> 3] << (j & 7)) & 128

                if (bit === 0) {
                    // 因为 Buffer.alloc 函数会用 0 初始化 bit 位，所以这里无需处理了
                    pos++
                    continue
                }

                // 计算压缩缓冲区的字节下标和字节内比特偏移量
                const index = pos >> 3 
                const offset = pos & 7 

                // 将相应比特位设置为 1
                zipBuff[index] = zipBuff[index] | (1 << (7 - offset))
                pos++
            }
        }

        return zipBuff
    }

    /**
     * 生成元数据
     * 格式：原始字符串字节数(8 字节) + 压缩字符串字节数(8 字节) + 最后一字节有效比特数(1 字节) + 编码表字节数(即哈夫曼编码占用字节数，4 字节) + 编码表
     * 编码表格式：字符(1 字节) + 编码比特数(1 字节) + 编码（至少 1 字节）
     * @param hcodes - 哈夫曼编码
     * @param origLen - 原始字符串字节数
     * @param zipBitCnt - 编码后字符串比特数
     */
    private metaData(hcodes: Map<number, HCode>, origLen: number, zipBitCnt: number): Buffer {
        // 计算元数据总大小
        let size = 21
        for (const hcode of hcodes.values()) {
            size += 2 + Math.ceil(hcode.length / 8)
        }

        const buf = Buffer.alloc(size)
        let pos = 0

        // 原始字符串字节数（8 字节）
        buf.writeDoubleLE(origLen, pos)
        pos += 8

        // 压缩字符串字节数(8 字节)
        buf.writeDoubleLE(Math.ceil(zipBitCnt / 8), pos)
        pos += 8

        // 最后一位有效比特数
        buf.writeUInt8((zipBitCnt & 7) || 8, pos)
        pos++

        // 编码表字节数（4 字节）
        buf.writeUInt32LE(size - 21, pos)
        pos += 4

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

        // 构建哈夫曼树
        const htRoot = this.huffmanTree(freqs)

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
            map.set(root.char, { buff: this.str2bits(tmpCode), length: tmpCode.length, freq: root.freq })
            return
        }

        // 非叶节点，继续处理左右子节点
        this.tree2code(root.left, tmpCode + '0', map)
        this.tree2code(root.right, tmpCode + '1', map)
    }

    /**
     * 二进制字符串转成 bit 位，返回 Buffer
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
    private huffmanTree(freqs: number[]): Node {
        // 最小优先队列
        const queue = new MinPriorityQueue()

        for (let i = 0; i < freqs.length; i++) {
            if (!freqs[i]) {
                continue
            }

            // 加入到优先队列中，以频率作为 key，Node 作为 val
            queue.insert({
                key: freqs[i],
                val: { char: i, freq: freqs[i], left: null, right: null, isLeaf: true }
            })
        }

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
     * @param buf - 字节数组
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
 * 将编码转成哈夫曼树，根据哈夫曼树来解码字符串
 */
class HuffmanDecoder {
    public decode(buf: Buffer): Buffer {
        // 如果只有 21 个字节，直接返回原串
        if (buf.byteLength <= 21) {
            return buf
        }

        // 提取编码表（哈夫曼树）
        const htree = this.buildHuffmanTree(buf)

        // 解码
        return this.unzip(buf, htree)
    }

    /**
     * 根据哈夫曼树解压 buf，返回解码后字节数组
     * @param buf - 压缩后的字节数组
     * @param tree - 哈夫曼树
     */
    private unzip(buf: Buffer, tree: Node): Buffer {
        let pos = 0
        const bufLen = buf.byteLength

        // 原始字符串字节数
        const origLen = Math.round(buf.readDoubleLE(pos))
        pos += 8
        // 压缩后字符串字节数
        const zipLen = Math.round(buf.readDoubleLE(pos))
        pos += 8
        // 最后一字节有效比特数
        const lastBitCnt = buf.readUInt8(pos)
        pos++

        // pos 偏移到压缩字符串第一个字节
        pos = bufLen - zipLen

        // 存储解压后数据的 Buffer
        const unzipBuf = Buffer.alloc(origLen)
        // 指向 unzipBuf 中第一个空位
        let curr = 0

        // 节点指针初始化为根节点
        let nodePt = tree

        // 解压
        while (pos < bufLen) {
            const byte = buf[pos]
            // 当前字节有效比特数：如果不是最后一个字节则取 8，否则取 lastBitCnt
            const bitcnt = pos < bufLen - 1 ? 8 : lastBitCnt

            // 对当前字节逐比特处理
            let i = 0
            while (i < bitcnt) {
                // 当前比特为 1 则取右节点，否则取左节点
                nodePt = (128 >> i) & byte ? nodePt.right : nodePt.left

                if (nodePt.isLeaf) {
                    // 找到字符了
                    unzipBuf[curr++] = nodePt.char
                    // 重置 nodePt，匹配下一个字符
                    nodePt = tree
                }

                i++
            }

            pos++
        }

        return unzipBuf
    }

    /**
     * 从压缩字节中提取编码表并根据编码表生成哈夫曼树
     * 元数据格式：原始字符串字节数(8 字节) + 压缩字符串字节数(8 字节) + 最后一字节有效比特数(1 字节) + 编码表字节数(即哈夫曼编码占用字节数，4 字节) + 编码表
     * 编码表格式：字符(1 字节) + 编码比特数(1 字节) + 编码（至少 1 字节）
     * @param buf - 压缩后字节数组
     * @returns 哈夫曼树根节点
     */
    private buildHuffmanTree(buf: Buffer): Node {
        // 跳过 17 个字节
        let pos = 17

        // 编码表字节数
        const tableSize = buf.readUInt32LE(pos)
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