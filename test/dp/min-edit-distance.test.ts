import assert from "assert"
import { minEditDistance } from '../../src/dp/min-edit-distance'

describe('min edit distance', () => {
    it('should ok', () => {
        const list: [string, string, number][] = [
            ['', '', 0],
            ['', 'abcde', 5],
            ['abcde', '', 5],
            ['abcde', 'abcde', 0],
            ['aaaa', 'aaaa', 0],
            ['aaaa', 'aaa', 1],
            ['horse', 'ros', 3],
            ['intention', 'execution', 5],
        ]

        for (const [s1, s2, num] of list) {
            assert.equal(minEditDistance(s1, s2), num)
        }
    })
})