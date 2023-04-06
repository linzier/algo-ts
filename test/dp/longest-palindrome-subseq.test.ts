import assert from "assert"
import { longestPalindromeSubseq } from '../../src/dp/longest-palindrome-subseq'

describe('longest palindrome subseq', () => {
    it('should ok', () => {
        assert.equal(longestPalindromeSubseq(''), '')
        assert.equal(longestPalindromeSubseq('a'), 'a')
        assert.equal(longestPalindromeSubseq('aa'), 'aa')
        assert.equal(longestPalindromeSubseq('aaa'), 'aaa')
        assert.equal(longestPalindromeSubseq('aaaa'), 'aaaa')
        const s1 = longestPalindromeSubseq('ab')
        assert.ok(s1 == 'a' || s1 == 'b')
        assert.equal(longestPalindromeSubseq('aba'), 'aba')
        const s2 = longestPalindromeSubseq('abab')
        assert.ok(s2 == 'aba' || s2 == 'bab')
        assert.equal(longestPalindromeSubseq('bbbab'), 'bbbb')
        assert.equal(longestPalindromeSubseq('caebgbhijdkhlmop'), 'bgb')
    })
})