/**
 * Huffman Coding and using Huffman Coding to compress and decompress data.
 * Huffman Coding is based on Huffman Tree.
 * Given N weights as N leaf nodes, construct a binary tree. If the weighted path length of this tree reaches
 * the minimum, such a binary tree is called an optimal binary tree, also called a Huffman Tree.
 * Huffman Tree is the tree with the shortest weighted path length, where nodes with larger weights are closer to the root.
 *
 * Building Huffman Tree:
 * Implemented based on greedy algorithm, can use a min priority queue.
 * Example:
 * Given text string T, its constituent characters and frequencies are as follows:
 * E:1, M:2, C:3, A:3, D:4.
 * Approach to construct Huffman Tree:
 * 1. Treat all characters each as an independent node (equivalent to a tree with only a root), forming a set S (or forest);
 * 2. Get the two nodes with minimum frequency from S (in this example E and M; getting them means simultaneously
 *    removing them from S), create a new node N, with these two nodes as N's left and right children respectively.
 *    N's frequency equals the sum of the two child nodes' frequencies (in this example 1 + 2 = 3);
 * 3. Put new node N into set S;
 * 4. Repeat steps 2, 3, until set S has only one node (i.e., the root of the constructed tree);
 * (Greedy algorithm: each time always get the two elements with minimum frequency from the set. This approach makes
 *  elements with higher frequency be built later, i.e., closer to the tree root.)
 *
 * For text T, the Huffman Tree construction process is as follows:
 * 1. Initial state, set elements: E(1), M(2), C(3), A(3), D(4);
 * 2. Get E(1), M(2), generate new node (3) and put into set, set elements become: (3), C(3), A(3), D(4);
 * 3. Get (3), C(3), generate new node (6) and put into set, set elements become: A(3), D(4), (6);
 * 4. Get A(3), D(4), generate new node (7) and put into set, set elements become: (6), (7);
 * 5. Get (6), (7), generate new node (13) and put into set, set elements become: (13);
 * 6. Set has only one (13), i.e., the root of the entire tree;
 *
 * The final constructed tree is as follows:
 *                                      (13)
 *                                  /          \
 *                               (6)           (7)
 *                             /     \        /   \
 *                           (3)     C(3)   A(3)  D(4)
 *                         /     \
 *                       E(1)    M(2)
 *
 * As shown, the character E with the lowest frequency has the longest path, and D with the highest frequency
 * has the shortest path (path: number of edges on the simple path from root to this node).
 *
 * Generate Huffman Coding based on Huffman Tree:
 * Starting from root, traverse each leaf node downward, getting 0 for each left child and 1 for each right child.
 * E: 000
 * M: 001
 * C: 01
 * A: 10
 * D: 11
 * As can be seen, the high-frequency D and A only occupy 2 bits after converting to Huffman Coding.
 *
 * Encoding (compress):
 * The essence of compression is replacing character original codes with Huffman Coding. Since in Huffman Coding,
 * higher frequency characters have shorter encoding bit counts, it plays a compression role overall.
 * For example, encoding string DAM according to the above encoding:
 * Binary string before encoding: 01000100 01000001 01001101, occupying 3 bytes.
 * Binary string after encoding: 1110001, occupying 1 byte.
 *
 * Decoding (decompress):
 * First convert the encoding table (i.e., the mapping between characters and Huffman Coding) into a Huffman Tree,
 * then decode based on the Huffman Tree. See the code implementation for details.
 */

import { MinPriorityQueue } from '../data-structure/priority-queue'

// Huffman Tree node
interface Node {
    // Character
    char: number;
    // Frequency
    freq: number;
    // Left node
    left: Node | null;
    // Right node
    right: Node | null;
    // Whether it is a leaf node
    isLeaf: boolean;
}

// Huffman Coding
interface HCode {
    // Encoding, stored using byte array
    // For 256 characters (max single byte count), the maximum encoding length is 255 (when frequency follows Fibonacci)
    // Therefore create a 32-byte Buffer for storage (storage order: from left to right)
    buff: Buffer;
    // Exact encoding length (bit count)
    length: number;
    // Frequency
    freq: number;
}

/**
 * Huffman Coding
 */
class HuffmanEncoder {
    /**
     * Compress
     * @param buf - Byte array
     * @returns Compressed byte array
     */
    public encode(buf: Buffer): Buffer {
        // If only 21 bytes or less, skip compression, directly return original string (because metadata is at least 21 bytes)
        if (buf.byteLength <= 21) {
            return buf
        }

        // Calculate each character's encoding value
        const hcodes = this.huffmanCode(buf)

        // Calculate total bit count after encoding
        let zipBitCnt = 0
        for (const code of hcodes.values()) {
            zipBitCnt += code.length * code.freq
        }

        // Metadata Buffer
        const metaBuff = this.metaData(hcodes, buf.byteLength, zipBitCnt)

        // zipBuff is composed of metadata + compressed string, two parts
        const metaLen = metaBuff.length
        const zipBuff = Buffer.alloc(metaLen + Math.ceil(zipBitCnt / 8))

        // Copy metadata to buffer
        zipBuff.set(metaBuff, 0)

        // Current bit position being processed, initialized to metadata's bit count
        let pos = metaLen << 3

        // Compress byte by byte
        // So-called compression is converting original bytes to Huffman Coding (bit positions)
        for (let i = 0; i < buf.length; i++) {
            // Character's corresponding Huffman Coding
            const hcode = hcodes.get(buf[i])
            // Huffman Coding bits stored in Buffer
            const codeBuff = hcode.buff

            // Convert bit by bit
            for (let j = 0; j < hcode.length; j++) {
                // Get the corresponding bit value from the Huffman Coding (byte array)
                // codeBuff[j >> 3] locates the corresponding byte in the buffer array
                // j & 7 is the bit offset within the byte. Right-shifting the byte by this offset moves the needed bit to the rightmost
                // & 128 sets all bits except the rightmost to 0
                const bit = (codeBuff[j >> 3] << (j & 7)) & 128

                if (bit === 0) {
                    // Because Buffer.alloc function initializes bit positions with 0, no processing needed here
                    pos++
                    continue
                }

                // Calculate the byte index and bit offset within byte in the compress buffer
                const index = pos >> 3
                const offset = pos & 7

                // Set the corresponding bit to 1
                zipBuff[index] = zipBuff[index] | (1 << (7 - offset))
                pos++
            }
        }

        return zipBuff
    }

    /**
     * Generate metadata
     * Format: original string byte count (8 bytes) + compressed string byte count (8 bytes) + last byte valid bit count (1 byte) + encoding table byte count (i.e., Huffman Coding byte count, 4 bytes) + encoding table
     * Encoding table format: character (1 byte) + encoding bit count (1 byte) + encoding (at least 1 byte)
     * @param hcodes - Huffman Coding
     * @param origLen - Original string byte count
     * @param zipBitCnt - Encoded string bit count
     */
    private metaData(hcodes: Map<number, HCode>, origLen: number, zipBitCnt: number): Buffer {
        // Calculate total metadata size
        let size = 21
        for (const hcode of hcodes.values()) {
            size += 2 + Math.ceil(hcode.length / 8)
        }

        const buf = Buffer.alloc(size)
        let pos = 0

        // Original string byte count (8 bytes)
        buf.writeDoubleLE(origLen, pos)
        pos += 8

        // Compressed string byte count (8 bytes)
        buf.writeDoubleLE(Math.ceil(zipBitCnt / 8), pos)
        pos += 8

        // Last byte valid bit count
        buf.writeUInt8((zipBitCnt & 7) || 8, pos)
        pos++

        // Encoding table byte count (4 bytes)
        buf.writeUInt32LE(size - 21, pos)
        pos += 4

        // Encoding table
        for (const [char, hcode] of hcodes) {
            // Character (1 byte)
            buf.writeUint8(char, pos++)

            // Encoding bit count (1 byte)
            buf.writeUint8(hcode.length, pos++)

            // Encoding bits
            const byteLen = Math.ceil(hcode.length / 8)
            buf.set(Uint8Array.prototype.slice.call(hcode.buff, 0, byteLen), pos)
            pos += byteLen
        }

        return buf
    }

    /**
     * Calculate Huffman Coding based on character frequency
     * Generated based on min priority queue
     * @param freqs - Frequency of each character, array index represents the character's code value
     * @returns character -> encoding
     */
    private huffmanCode(buf: Buffer): Map<number, HCode> {
        // Calculate character frequency
        const freqs = this.calcFreqs(buf)

        // Build Huffman Tree
        const htRoot = this.huffmanTree(freqs)

        // Generate Huffman Coding, format: character -> encoding
        const hcodes: Map<number, HCode> = new Map()
        this.tree2code(htRoot, '', hcodes)

        return hcodes
    }

    /**
     * Build Huffman Coding based on Huffman Tree
     * @param root - Huffman Tree
     * @param tmpCode - Preserve Huffman Coding intermediate value
     * @param map - Preserve the final Huffman Coding
     */
    private tree2code(root: Node, tmpCode: string, map: Map<number, HCode>) {
        if (root.isLeaf) {
            map.set(root.char, { buff: this.str2bits(tmpCode), length: tmpCode.length, freq: root.freq })
            return
        }

        // Non-leaf node, continue processing left and right children
        this.tree2code(root.left, tmpCode + '0', map)
        this.tree2code(root.right, tmpCode + '1', map)
    }

    /**
     * Convert binary string to bits, return Buffer
     * @param bitStr - Binary string, e.g., "10010101010"
     */
    private str2bits(bitStr: string): Buffer {
        const buff = Buffer.alloc(32)
        // Convert string to bits
        for (let i = 0; i < bitStr.length; i++) {
            // 0 bits don't need processing (Buffer is initialized to 0)
            if (bitStr[i] === '0') {
                continue
            }

            // Integer divide by 8 (i >> 3) to get array index; modulo 8 (i & 7) to get byte-internal offset
            // Since it's from left to right, the left shift amount for 1 equals 7 - (i % 8)
            buff[i >> 3] |= 1 << (7 - (i & 7))
        }

        return buff
    }

    /**
     * Build Huffman Tree based on min priority queue
     * @param queue - Min priority queue
     */
    private huffmanTree(freqs: number[]): Node {
        // Min priority queue
        const queue = new MinPriorityQueue()

        for (let i = 0; i < freqs.length; i++) {
            if (!freqs[i]) {
                continue
            }

            // Add to priority queue, using frequency as key and Node as val
            queue.insert({
                key: freqs[i],
                val: { char: i, freq: freqs[i], left: null, right: null, isLeaf: true }
            })
        }

        // Process from leaf nodes upward, until queue has only one node, this node is the root
        // Total executions: queue.size - 1 times
        const qlen = queue.size()
        for (let i = 0; i < qlen - 1; i++) {
            // Get two elements with minimum frequency
            const left = queue.extract().val as Node
            const right = queue.extract().val as Node

            // Create new node (parent node), its char can be anything
            const parent = { char: 0, freq: left.freq + right.freq, left, right, isLeaf: false }

            // Put parent node into Queue
            queue.insert({ key: parent.freq, val: parent })
        }

        return queue.extract().val as Node
    }

    /**
     * Calculate the frequency of each character in the text
     * @param buf - Byte array
     */
    private calcFreqs(buf: Buffer): number[] {
        // Used to record frequency of each byte. Single byte range: 0 ~ 255. Initialized to 0
        const freqs: number[] = new Array(256).fill(0)

        for (let i = 0; i < buf.length; i++) {
            freqs[buf[i]]++
        }

        return freqs
    }
}

/**
 * Huffman Decoding
 * Convert encoding into Huffman Tree, decode string based on Huffman Tree
 */
class HuffmanDecoder {
    public decode(buf: Buffer): Buffer {
        // If only 21 bytes or less, directly return original string
        if (buf.byteLength <= 21) {
            return buf
        }

        // Extract encoding table (Huffman Tree)
        const htree = this.buildHuffmanTree(buf)

        // Decode
        return this.unzip(buf, htree)
    }

    /**
     * Decompress buf based on Huffman Tree, return decoded byte array
     * @param buf - Compressed byte array
     * @param tree - Huffman Tree
     */
    private unzip(buf: Buffer, tree: Node): Buffer {
        let pos = 0
        const bufLen = buf.byteLength

        // Original string byte count
        const origLen = Math.round(buf.readDoubleLE(pos))
        pos += 8
        // Compressed string byte count
        const zipLen = Math.round(buf.readDoubleLE(pos))
        pos += 8
        // Last byte valid bit count
        const lastBitCnt = buf.readUInt8(pos)
        pos++

        // pos offset to the first byte of compressed string
        pos = bufLen - zipLen

        // Buffer to store decompressed data
        const unzipBuf = Buffer.alloc(origLen)
        // Points to first empty position in unzipBuf
        let curr = 0

        // Node pointer initialized to root node
        let nodePt = tree

        // Decompress
        while (pos < bufLen) {
            const byte = buf[pos]
            // Current byte valid bit count: if not last byte then get 8, otherwise get lastBitCnt
            const bitcnt = pos < bufLen - 1 ? 8 : lastBitCnt

            // Process current byte bit by bit
            let i = 0
            while (i < bitcnt) {
                // If current bit is 1 then get right node, otherwise get left node
                nodePt = (128 >> i) & byte ? nodePt.right : nodePt.left

                if (nodePt.isLeaf) {
                    // Found character
                    unzipBuf[curr++] = nodePt.char
                    // Reset nodePt, match next character
                    nodePt = tree
                }

                i++
            }

            pos++
        }

        return unzipBuf
    }

    /**
     * Extract encoding table from compressed bytes and generate Huffman Tree based on it
     * Metadata format: original string byte count (8 bytes) + compressed string byte count (8 bytes) + last byte valid bit count (1 byte) + encoding table byte count (i.e., Huffman Coding byte count, 4 bytes) + encoding table
     * Encoding table format: character (1 byte) + encoding bit count (1 byte) + encoding (at least 1 byte)
     * @param buf - Compressed byte array
     * @returns Huffman Tree root node
     */
    private buildHuffmanTree(buf: Buffer): Node {
        // Skip 17 bytes
        let pos = 17

        // Encoding table byte count
        const tableSize = buf.readUInt32LE(pos)
        pos += 4

        // Read and generate Huffman Tree (don't need frequency)
        // Initialize root node
        const root: Node = { char: 0, freq: 0, left: null, right: null, isLeaf: false }
        // Encoding byte right boundary
        const last = pos + tableSize
        while (pos < last) {
            // Character (1 byte)
            const char = buf.readUInt8(pos++)
            // Encoding bit count (1 byte)
            let bitcnt = buf.readUInt8(pos++)
            // Node pointer, initialized pointing to root
            let currNode = root

            // Generate tree based on encoding bits
            // Process byte by byte
            while (bitcnt > 0) {
                // Bit count to process in this iteration
                let n = bitcnt > 8 ? 8 : bitcnt
                const byte = buf[pos]
                // Set the leftmost n-th bit to 1, convenient for following operations
                const mask = 128 >> (n - 1)
                // Process bit by bit
                while (n-- > 0) {
                    // Check bit by bit and generate tree nodes
                    // Process from left to right
                    const bit = (mask << n) & byte

                    let node = bit && currNode.right || !bit && currNode.left
                    if (node) {
                        // Corresponding node already exists, no need to create
                        currNode = node
                        continue
                    }

                    // Create new node
                    node = { char: 0, freq: 0, left: null, right: null, isLeaf: false }
                    // Special handling for leaf node
                    // Leaf node check condition: current is the last byte, and processed to the last bit
                    if (n == 0 && bitcnt <= 8) {
                        node.char = char
                        node.isLeaf = true
                    }

                    bit ? currNode.right = node : currNode.left = node

                    // Point curr pointer to current node
                    currNode = node
                }

                // Remaining bit count to process decreases by 8
                bitcnt -= 8
                // buf moves forward 1 byte
                pos++
            }
        }

        return root
    }
}

export { HuffmanEncoder, HuffmanDecoder }