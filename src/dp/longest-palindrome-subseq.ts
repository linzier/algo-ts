/**
 * Longest Palindromic Subsequence
 * Given a string s, find the longest palindromic subsequence in it, and return the length of this sequence.
 * Subsequence definition: a sequence formed by deleting some characters or not deleting any characters without changing
 * the order of the remaining characters.
 * A palindrome is a non-empty string that reads the same forwards and backwards, such as all strings of length 1, civic, racecar, etc.
 *
 * Solution approach:
 * One approach is to reverse the original string, then find the longest common subsequence of the two strings
 * (original string and reversed string).
 * The second approach also borrows from the longest common subsequence approach, however palindromic subsequences
 * must examine both ends simultaneously (because adding a character to one end of a palindrome string cannot form
 * a new palindrome string, unless all characters in the original palindrome string are the same).
 * This article adopts the second approach.
 *
 * Optimal substructure:
 * Assume sequence A = [a1,a2,...,an-1,an] has longest palindromic subsequence s. Remove one character from each end
 * of this sequence to get sequence B = [a2,...,an-1], let its longest palindromic subsequence be s',
 * we examine the relationship between s and s'.
 * Here we need to consider the relationship between a1 and an.
 * 1. When a1 = an, at this time adding a1 and an to the left and right sides of s' respectively can form a new
 *    palindromic subsequence, i.e., s = a1 + s' + an;
 * 2. When a1 != an, at this time s cannot equal a1 + s' + an, i.e., both ends of s cannot simultaneously be a1 and an,
 *    which also splits into two cases:
 *  2.1 When a1 is not in palindrome sequence s, this means s equals the longest palindromic subsequence of
 *      sequence C = [a2,...,an-1,an];
 *  2.2 When an is not in palindrome sequence s, this means s equals the longest palindromic subsequence of
 *      sequence D = [a1,a2,...,an-1];
 *  (There is also a case where both a1 and an are not in s, but this case is covered by 2.1 and 2.2,
 *  so no separate examination is needed.)
 *
 * Transition equation (State transition table):
 * Let dp[i][j] represent the longest palindrome string of subsequence A[i:j].
 * When A[i] = A[j], dp[i][j] = A[i] + dp[i + 1][j - 1] + A[j];
 * When A[i] != A[j], dp[i][j] = maxLength(dp[i + 1][j], dp[i][j - 1]);
 * I.e.: the value of dp[i][j] depends on values at its left, below, or left-below positions,
 * so the state transition direction should be from the left-below corner towards the right-upper corner.
 *
 * Initialization:
 * 1. When i > j, the palindromic subsequence is empty;
 * 2. When i = j (single character), the palindromic subsequence is A[i] (a single character itself is a palindrome);
 *
 * Terminal value:
 * dp[0][A.length - 1]
 */

interface Value {
    // Maximum palindromic subsequence length
    length: number;
    // Which direction the current palindrome sequence is based on from the subproblem (sub-palindrome sequence) solution
    direction: 'left' | 'down' | 'leftdown';
}

function longestPalindromeSubseq(text: string): string {
    if (!text.length) {
        return ''
    }

    const dp: Value[][] = []

    // Initialize
    for (let i = 0; i < text.length; i++) {
        dp[i] = []

        dp[i][i] = { length: 1, direction: 'leftdown' }
    }

    // State transition
    for (let i = text.length - 2; i >= 0; i--) {
        for (let j = i + 1; j < text.length; j++) {
            if (text[i] == text[j]) {
                // Note: dp[i + 1][j - 1] may be at the left-below of the diagonal, this area is not initialized,
                // so special checking is needed
                dp[i][j] = { length: dp[i + 1][j - 1] ? dp[i + 1][j - 1].length + 2 : 2, direction: 'leftdown' }
            } else if (dp[i + 1][j].length > dp[i][j - 1].length) {
                dp[i][j] = { length: dp[i + 1][j].length, direction: 'down' }
            } else {
                dp[i][j] = { length: dp[i][j - 1].length, direction: 'left' }
            }
        }
    }

    // Assemble palindrome string
    // i, j indicate which element in dp to get next to form the palindrome sequence
    let i = 0
    let j = text.length - 1
    // Final palindromic subsequence length
    const len = dp[i][j].length
    // Character array
    const result: string[] = new Array(len)
    // Indicates the current position being filled in the result array
    let pos = 0

    do {
        const curr = dp[i][j]

        switch (curr.direction) {
            case 'leftdown':
                // From left-below, need to add current character at both ends of result
                result[pos] = result[len - 1 - pos] = text[i]
                pos++
                i++
                j--
                break
            case 'left':
                // From left
                j--
                break
            case 'down':
                // From below
                i++
                break
        }
    } while (i <= j)

    return result.join('')
}

export { longestPalindromeSubseq }