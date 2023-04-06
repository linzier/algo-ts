/**
 * 最长回文子序列
 * 给你一个字符串 s ，找出其中最长的回文子序列，并返回该序列的长度。
 * 子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。
 * 回文是指正序和逆序相同的非字符串，如所有长度为 1 的字符串，civic、racecar 等。
 * 
 * 求解思路：
 * 一种思路是将原字符串翻转，然后求解两字符串（原字符串和翻转字符串）的最长公共子序列即可。
 * 第二种思路也是借鉴最长公共子序列的思路，不过回文子序列必须同时考察两端（因为往一个回文串一端添加一个字符无法构成新回文串，除非原回文串中
 * 所有字符都相同）。
 * 本文采用第二种思路。
 * 
 * 最优子结构：
 * 假设序列 A = [a1,a2,...,an-1,an] 的最长回文子序列是 s，将该序列首尾各去掉一个字符得到序列 B = [a2,...,an-1]，设其最长回文子序列是 s'，
 * 我们考察 s 和 s' 之间的关系。
 * 这里需要考虑 a1 和 an 之间的关系。
 * 1. 当 a1 = an，此时将 a1 和 an 分别加到 s' 左右两边可以构成新的回文子序列，即此时 s = a1 + s' + an；
 * 2. 当 a1 != an，此时 s 不可能等于 a1 + s' + an，即 s 两端不可能同时是 a1 和 an，此时又分两种情况：
 *  2.1 当 a1 不在回文序列 s 中时，这意味着 s 就等于序列 C = [a2,...,an-1,an] 的最长回文子序列；
 *  2.2 当 an 不在回文序列 s 中时，这意味着 s 就等于序列 D = [a1,a2,...,an-1] 的最长回文子序列；
 *  （当然还有种情况是 a1 和 an 同时不在 s 中，但这种情况囊括在 2.1 和 2.2 中，不用单独考察。）
 * 
 * 转移方程（状态转移表）：
 * 设 dp[i][j] 表示子序列 A[i:j] 的最长回文串。
 * 当 A[i] = A[j] 时，dp[i][j] = A[i] + dp[i + 1][j - 1] + A[j]；
 * 当 A[i] != A[j] 时，dp[i][j] = maxLength(dp[i + 1][j], dp[i][j - 1])；
 * 即：dp[i][j] 的值依赖于其左方、下方或者左下方位置的值，所以状态转移方向应该是从左下角向右上角进行。
 * 
 * 初始化：
 * 1. 当 i > j 时，回文子序列为空；
 * 2. 当 i = j 时（单字符），回文子序列为 A[i]（单字符本身都是回文串）；
 * 
 * 终值：
 * dp[0][A.length - 1]
 */

interface Value {
    // 最大回文子序列的长度
    length: number;
    // 当前回文序列依据哪个方向的子问题（子回文序列）求解得来
    direction: 'left' | 'down' | 'leftdown';
}

function longestPalindromeSubseq(text: string): string {
    if (!text.length) {
        return ''
    }

    const dp: Value[][] = []

    // 初始化
    for (let i = 0; i < text.length; i++) {
        dp[i] = []

        dp[i][i] = { length: 1, direction: 'leftdown' }
    }

    // 状态转移
    for (let i = text.length - 2; i >= 0; i--) {
        for (let j = i + 1; j < text.length; j++) {
            if (text[i] == text[j]) {
                // 注意：dp[i + 1][j - 1] 有可能在对角线左下方，这片区域没有初始化，要做特殊判断
                dp[i][j] = { length: dp[i + 1][j - 1] ? dp[i + 1][j - 1].length + 2 : 2, direction: 'leftdown' }
            } else if (dp[i + 1][j].length > dp[i][j - 1].length) {
                dp[i][j] = { length: dp[i + 1][j].length, direction: 'down' }
            } else {
                dp[i][j] = { length: dp[i][j - 1].length, direction: 'left' }
            }
        }
    }

    // 组合回文串
    // i, j 指示下一步取 dp 中哪个元素来构成回文序列
    let i = 0
    let j = text.length - 1
    // 最终回文子序列长度
    const len = dp[i][j].length
    // 字符数组
    const result: string[] = new Array(len)
    // 指示当前 result 数组填充到的位置
    let pos = 0

    do {
        const curr = dp[i][j]

        switch (curr.direction) {
            case 'leftdown':
                // 来自左下方，需要在 result 前后加上当前字符
                result[pos] = result[len - 1 - pos] = text[i]
                pos++
                i++
                j--
                break
            case 'left':
                // 来自左方
                j--
                break
            case 'down':
                // 来自下方
                i++
                break
        }
    } while (i <= j)

    return result.join('')
}

export { longestPalindromeSubseq }