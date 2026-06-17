import assert from "assert"
import fs from 'node:fs'
import path from 'node:path'
import { HuffmanEncoder, HuffmanDecoder } from '../../src/greedy/huffman-code'

describe('huffman code', () => {
    // Basic functionality test
    it('should ok', () => {
        const enc = new HuffmanEncoder()
        const dec = new HuffmanDecoder()

        // decoded result should match original string
        assert.equal(dec.decode(enc.encode(Buffer.from(''))), '')
        assert.equal(dec.decode(enc.encode(Buffer.from('a'))), 'a')
        assert.equal(dec.decode(enc.encode(Buffer.from('中国'))), '中国')
        assert.equal(dec.decode(enc.encode(Buffer.from('To learn more about the language, click above in "Examples" or "What\'s New"'))), 'To learn more about the language, click above in "Examples" or "What\'s New"')
    })

    // compression rate
    it('compressibility', () => {
        const enc = new HuffmanEncoder()
        const dec = new HuffmanDecoder()

        // English text with Fibonacci frequencies
        let text = 'ab'
        const arr = [1, 1]
        for (let i = 2; i < 26; i++) {
            const len = arr[i-2] + arr[i-1]
            arr[i] = len
            text += new Array(len).fill(String.fromCharCode(65+i), 0, len - 1).join('')
        }
        let encBuf = enc.encode(Buffer.from(text))
        let decBuf = dec.decode(encBuf)

        assert.equal(decBuf.byteLength, text.length)
        console.log('fibonacci freq:origin length:', text.length, '; encoded length:', encBuf.byteLength, 'rate:', 1 - encBuf.byteLength / text.length)

        // Chinese text
        const cnBuf = fs.readFileSync(path.join(__dirname, 'huffman.txt'))
        encBuf = enc.encode(cnBuf)
        decBuf = dec.decode(encBuf)

        assert.equal(decBuf.byteLength, cnBuf.byteLength)
        console.log('Chinese freq:origin length:', cnBuf.byteLength, '; encoded length:', encBuf.byteLength, 'rate:', 1 - encBuf.byteLength / cnBuf.byteLength)

        // English text
        const enBuf = fs.readFileSync(path.join(__dirname, 'huffman-en.txt'))
        encBuf = enc.encode(enBuf)
        decBuf = dec.decode(encBuf)

        assert.equal(decBuf.byteLength, enBuf.byteLength)
        console.log('English freq:origin length:', enBuf.byteLength, '; encoded length:', encBuf.byteLength, 'rate:', 1 - encBuf.byteLength / enBuf.byteLength)
    })
})