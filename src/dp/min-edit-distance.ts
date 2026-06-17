/**
 * Minimum Edit Distance
 * Given two strings s1 and s2, return the minimum number of operations to convert s1 into s2.
 * Three operations can be performed on a word:
 *  Insert a character
 *  Delete a character
 *  Replace a character
 *
 * Example:
 * Input: s1 = "horse", s2 = "ros"
 * Output: 3
 * Explanation:
 * horse -> rorse (replace 'h' with 'r')
 * rorse -> rose (delete 'r')
 * rose -> ros (delete 'e')
 *
 * Solution approach:
 * To find the edit distance between two strings s1 -> s2, a natural subproblem decomposition idea is to take
 * substrings s1[0:i] and s2[0:j], and examine whether optimal substructure exists.
 * Assume we already know the minimum edit distance from s1[0:i-1] to s2[0:j-1] is x, now examine the case
 * of adding s1[i] and s2[j] (i.e., examine the minimum edit distance y from s1[0:i] to s2[0:j]).
 * 1. When s1[i] = s2[j], no operation is needed at this time, y = x;
 * 2. When s1[i] != s2[j], there are three operation methods:
 *  2.1 Delete s1[i], then compare s1[i+1] with s2[j];
 *  2.2 Insert s2[j], then compare s1[i] with s2[j+1];
 *  2.3 Change s1[i] to s2[j], then compare s1[i+1] with s2[j+1];
 *
 * Explanation:
 * The above operations are not very intuitive when understood directly using s1 and s2, so we can introduce
 * a third intermediate array for understanding.
 * Initial: Introduce intermediate array arr = [], used to store edited characters.
 * s1 = a1,a2,...,ai-1,ai,...,an
 * s2 = b1,b2,...,bj-1,bj,...,bm
 * After examining s1[0:i-1] -> s2[0:j-1], arr = [c1,c2,...,ck].
 * Now examine positions i, j.
 * 1. If s1[i] = s2[j], then directly copy the character s1[i] (or s2[j]) into arr (assume the cost of copying is 0),
 *    then both sides move forward one position, continue examining s1[i+1] and s2[j+1];
 * 2. If s1[i] != s2[j], then there are three operation methods: delete, insert, replace:
 *  2.1 Delete: equivalent to s1 having an extra character ai at this position, we delete the ai character,
 *      the problem is solved, s1 moves forward one position to s1[i+1]. No character is written to arr at this time
 *      (meaning don't want this character), since we didn't touch any character in s2, s2 is still at position j,
 *      next we compare s1[i+1] with s[j] (i.e., examine the minimum edit distance from s1[0:i+1] to s2[j]);
 *  2.2 Insert: equivalent to s1 missing the character s2[j] at the current position, we insert it,
 *      making the inserted character correspond to s2[j], s2's current position is solved, move forward to j+1.
 *      Since we didn't use any character from s1, s1's position doesn't move, next compare s1[i] with s2[j+1];
 *  2.3 Replace: Since s1's character at this position doesn't match, we replace it with the same character as s2[j],
 *      s2[j]'s position is solved. Meanwhile since we changed s1[i], after the operation both move forward one position,
 *      next compare s1[i+1] with s2[j+1];
 *
 * Transition equation (conversion table):
 * Let dp[i][j] represent the minimum edit distance from substring s1[0:i+1] to s2[0:j+1].
 * (That is: i represents the substring formed by the first i characters of s1, same for j.)
 * Case 1: dp[i][j] = dp[i-1][j-1];
 * Case 2.1: dp[i][j] = dp[i][j-1] + 1;
 * Case 2.2: dp[i][j] = dp[i-1][j] + 1;
 * Case 2.3: dp[i][j] = dp[i-1][j-1] + 1;
 * Take the minimum of cases 2.1, 2.2, 2.3.
 *
 * Initial:
 * 1. When i = 0, it means converting the empty string in s1 to each substring in s2, requiring several insert operations;
 * 2. When j = 0, it means converting each substring in s1 to the empty string of s2, requiring several delete operations;
 *
 * @see https://www.cnblogs.com/linvanda/p/16465191.html
 */

function minEditDistance(s1: string, s2: string): number {
    if (!s1 && !s2) {
        return 0
    }

    // (s1.length + 1) * (s2.length + 1) size
    const dp: number[][] = []

    // Initialize
    for (let i = 0; i <= s1.length; i++) {
        dp[i] = []
    }

    // When j = 0
    for (let i = 0; i <= s1.length; i++) {
        dp[i][0] = i
    }

    // When i = 0
    for (let j = 0; j <= s2.length; j++) {
        dp[0][j] = j
    }

    // State transition
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            // Note: the meaning of i, j is the first i, j characters, so the corresponding index should decrease by 1
            if (s1[i - 1] === s2[j - 1]) {
                // Case 1
                dp[i][j] = dp[i - 1][j - 1]
            } else {
                // Case 2
                dp[i][j] = Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]) + 1
            }
        }
    }

    return dp[s1.length][s2.length]
}

export { minEditDistance }