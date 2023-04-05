/**
 * 最长公共子序列
 * 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。如果不存在公共子序列 ，返回 0。
 * 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
 * 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
 * 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
 * 
 * 解题思路：
 * 动态规划求解。
 * 最优子结构：
 *  假设已知 text1[0:i - 1] 和 text2[0:j - 1] 的最长公共子序列是 s，长度 l，看如何据此求 text1[0:i] 和 text2[0:j] 的最长公共子序列。
 *  text1[i] 和 text2[j] 有相等和不相等两种情况。
 *  1. 当 text1[i] = text2[j] 时，text1[0:i] 和 text2[0:j] 的最长公共子序列长度一定是 l + 1（在 s 后面加上 text1[i]）；
 *  2. 当 text1[i] != text2[j] 时，text1[0:i] 和 text2[0:j] 的最长公共子序列 s' 的最后一个字符 z 要么不等于 text1[i]，要么不等于
 *     text2[j]（当然有可能既不等于 text1[i] 也不等于 text2[j]，但这种情况囊括在前两种情况之内，我们不再另行考虑）：
 *     2.1 当 z 不等于 text1[i] 时，s' 就等于 text1[i - 1] 和 text2[j] 的最长公共子序列；
 *     2.2 当 z 不等于 text2[j] 时，s' 就等于 text1[i] 和 text2[j - 1] 的最长公共子序列；
 *     那么，s' 自然是取 2.1 和 2.2 两个中最长的那个。
 * 
 * 重叠子问题：
 *  由于需要计算 2.1 和 2.2 两种情况，这两种情况之间存在重叠子问题。
 * 
 * 状态方程定义：
 *  二维数组 dp[i][j] 表示 text1[0:i+1] 和 text2[0:j+1] 两个子串的最长公共子序列。
 *  注意：0 <= i <= text1.length，0 <= j <= text2.length，即数组行列都比字符串字符数多一个。
 * （实际上 dp[i][j] 表示的是 text1 中前 i 子串 和 text2 中前 j 子串的最长公共子序列。）
 * 
 * 初始状态：
 *  当 i = 0 时，表示 text1 中空子串，此时无论 text2 中取何子串， 最长公共子序列都是 0，即 dp[0][0..j] = 0；
 *  当 j = 0 时，表示 text2 中空子串，此时无论 text1 中取何子串，最长公共子序列都是 0，即 dp[0..i][0] = 0；
 * 
 * 终止：取 dp[n][m] 的值。（n 和 m 分别为 text1.length 和 text2.length）。
 * 
 * 时间复杂度：O(n*m)。
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

    // 初始化
    for (let j = 0; j <= l2; j++) {
        dp[0][j] = 0
    }

    for (let i = 0; i <= l1; i++) {
        dp[i][0] = 0
    }

    // 状态转移
    // 注意：这里的 i 表示 text1 中前 i 个子串 text1[0:i-1]（该含义和 dp 数组下标的一致），
    // 所以取该子串最右字符应该用 text1[i - 1]，j 也是如此。
    for (let i = 1; i <= l1; i++) {
        for (let j = 1; j <= l2; j++) {
            // 当 text1 和 text2 当前元素一致时
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
            } else {
                // 不一致时，取 dp[i][j - 1] 和 dp[i - 1][j] 最长的
                dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
            }
        }
    }

    return dp[l1][l2]
}

export { longestCommonSubsequence }