import assert from "assert"
import { longestCommonSubsequence } from '../../src/dp/longest-common-subsequence'

describe('longest common subsequence', () => {
    it('should ok', () => {
        const list: [string, string, number][] = [
            ['', '', 0],
            ['', 'abc', 0],
            ['abcd', '', 0],
            ['abcde', 'ace', 3],
            // ['abc', 'abc', 3],
            // ['abc', 'def', 0],
        ]
    
        for (const [text1, text2, num] of list) {
            assert.equal(longestCommonSubsequence(text1, text2), num)
        }
    })
})