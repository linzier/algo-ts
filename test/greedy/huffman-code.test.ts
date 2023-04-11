import assert from "assert"
import { HuffmanEncoder, HuffmanDecoder } from '../../src/greedy/huffman-code'

let text = ''
const arr = [1, 1]
for (let i = 2; i < 16; i++) {
    const len = arr[i-2] + arr[i-1]
    arr[i] = len
    text += new Array(len).fill(String.fromCharCode(65+i), 0, len - 1).join('')
}
const encBuf = new HuffmanEncoder().encode(text)
const decBuf = new HuffmanDecoder().decode(encBuf)
