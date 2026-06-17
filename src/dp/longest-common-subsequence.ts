/**
 * Longest Common Subsequence
 * Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.
 * A subsequence of a string refers to a new string: it is formed by deleting some characters (or not deleting any characters)
 * from the original string without changing the relative order of the characters.
 * For example, "ace" is a subsequence of "abcde", but "aec" is not a subsequence of "abcde".
 * A common subsequence of two strings is a subsequence that both strings share.
 *
 * Solution approach:
 * Dynamic programming solution.
 * Optimal substructure:
 *  Assume we know the longest common subsequence of text1[0:i-1] and text2[0:j-1] is s, with length l,
 *  see how to accordingly find the longest common subsequence of text1[0:i] and text2[0:j].
 *  text1[i] and text2[j] have two cases: equal and not equal.
 *  1. When text1[i] = text2[j], the longest common subsequence length of text1[0:i] and text2[0:j] is certainly l + 1
 *     (adding text1[i] after s);
 *  2. When text1[i] != text2[j], the last character z of the longest common subsequence s' of text1[0:i] and text2[0:j]
 *     either doesn't equal text1[i], or doesn't equal text2[j] (there may also be cases where it doesn't equal text1[i]
 *     and also doesn't equal text2[j], but such cases are covered by the first two cases, so we don't examine them separately):
 *  2.1 When z doesn't equal text1[i], s' then equals the longest common subsequence of text1[i-1] and text2[j];
 *  2.2 When z doesn't equal text2[j], s' then equals the longest common subsequence of text1[i] and text2[j-1];
 *  Then, s' naturally takes the longer of 2.1 and 2.2.
 *
 * Overlapping subproblems:
 *  Since we need to calculate both cases 2.1 and 2.2, these two cases have overlapping subproblems.
 *
 * State equation definition:
 *  2D array dp[i][j] represents the longest common subsequence of substrings text1[0:i+1] and text2[0:j+1].
 *  Note: 0 <= i <= text1.length, 0 <= j <= text2.length, i.e., the array has one more row and column than the string character count.
 * (Actually dp[i][j] represents the longest common subsequence of the first i characters of text1 and the first j characters of text2.)
 *
 * Initial state:
 *  When i = 0, it means text1 is an empty substring, at this time no matter what substring text2 is, the longest common subsequence is 0,
 *  i.e., dp[0][0..j] = 0;
 *  When j = 0, it means text2 is an empty substring, at this time no matter what substring text1 is, the longest common subsequence is 0,
 *  i.e., dp[0..i][0] = 0;
 *
 * Termination: Get the value of dp[n][m]. (n and m are text1.length and text2.length respectively.)
 *
 * Time complexity: O(n*m).
 */

function longestCommonSubsequence(text1: string, text2: string): number {
    if (!text1.length || !text2.length) {
        return 0
    }

    const l1 = text1.length
    const l2 = text2.length
    const dp: number[][] = []

    for (let i = 0; i <= l1; i++) {
        dp[i] = []
    }

    // Initialize
    for (let j = 0; j <= l2; j++) {
        dp[0][j] = 0
    }

    for (let i = 0; i <= l1; i++) {
        dp[i][0] = 0
    }

    // State transition
    // Note: i here represents the first i characters of text1, text1[0:i-1] (this meaning is consistent with dp array index),
    // so to get the rightmost character of this substring we should use text1[i - 1], same for j.
    for (let i = 1; i <= l1; i++) {
        for (let j = 1; j <= l2; j++) {
            // When current elements of text1 and text2 match
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
            } else {
                // When they don't match, get the maximum of dp[i][j - 1] and dp[i - 1][j]
                dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
            }
        }
    }

    return dp[l1][l2]
}

export { longestCommonSubsequence }