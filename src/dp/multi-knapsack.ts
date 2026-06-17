/**
 * Multi Knapsack Problem
 * There are N items and a knapsack with capacity V. The i-th item has volume vi, value wi, and available quantity ci.
 * Find: which items to put into the knapsack so that the total value is maximized without exceeding the knapsack capacity V.
 * The difference from the 0/1 Knapsack Problem is that item i can be used 0..ci times.
 *
 * Solution approach:
 * Similar to the 0/1 knapsack approach (please see the 0/1 Knapsack Problem description first).
 * We use dp[i][j] to represent the maximum value that can be formed using the first i items when the available space is j.
 * We try to convert the multi knapsack into 0/1 knapsack:
 * Suppose we have three items arr = [g1, g2, g3], with quantities (c) respectively: g1.c = 2, g2.c = 3, g3.c = 4,
 * then it can be converted to the following array:
 * arr' = [g1', g1', g2', g2', g2', g3', g3', g3', g3'] total 9 items, each with quantity 1, which is then the 0/1 Knapsack Problem.
 * However, if gi's quantity is very large (e.g., 10000), the decomposed array would be very large.
 * Is there a better decomposition method?
 *
 * Binary splitting:
 * For a number n, it can always be decomposed into a sum of several 2^i numbers, plus a remainder.
 * Examples:
 * 7 can be decomposed into 7 = 1 + 2 + 4;
 * 12 can be decomposed into 12 = 1 + 2 + 4 + 5;
 * 15 can be decomposed into 15 = 1 + 2 + 4 + 8;
 * What characteristic does this decomposition have?
 * The decomposed numbers can form any number between 1..n.
 * For example, the four decomposed numbers of 15: 1, 2, 4, 8 can form any number from 1 to 15 through addition
 * (and each number is used at most once).
 * What use does this have?
 * For problems of the type "try any number of elements from n identical elements", binary splitting can be used
 * to greatly reduce the number of combination attempts.
 * For example 15, if treated as 15 independent elements, 15 attempts would be needed. After binary splitting,
 * only 4 attempts are needed. If it's 10000 elements, only 14 attempts are needed, a huge difference (Math.log2(10000)).
 *
 * Solution approach based on binary splitting:
 * Change the previous item decomposition method to binary splitting:
 * arr'' = [g1', g1', g2', g2'', g3', g3'', g3'] total 7 items, where g2'' has twice the volume and value of g2',
 * and similarly for others.
 * (Since the item quantity is small in the above example, the optimization is not obvious. When item quantities are large,
 * the optimization effect is significant.)
 * Then use the 0/1 knapsack approach to solve it.
 *
 * Complexity:
 * Time complexity: O(V*N*logm); Space complexity: O(V*N*logm);
 *
 * Optimization:
 * Same as 0/1 knapsack, can optimize space complexity to O(V) through rolling array. Omitted.
 */

interface Goods {
    // Item value
    w: number;
    // Item volume/weight, positive integer
    v: number;
    // Item quantity
    c: number;
}

/**
 * Multi Knapsack Problem
 * @param goods - Item set
 * @param V - Knapsack capacity. Integer
 * @returns Maximum value
 */
function knapsack(goods: Goods[], V: number): number {
    if (!goods.length || !V) {
        return 0
    }

    // Perform binary splitting
    goods = binSplit(goods)

    const N = goods.length
    // 2D DP table, size: N+1 * V+1
    const dp: number[][] = []

    // Initialize
    for (let i = 0; i <= N; i++) {
        dp[i] = []

        dp[i][0] = 0
    }

    for (let j = 0; j <= V; j++) {
        dp[0][j] = 0
    }

    for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= V; j++) {
            // Note: i represents the first i items, to convert to index we need to decrease by 1
            if (goods[i - 1].v > j) {
                // Current item volume/weight greater than available volume, cannot use current item
                dp[i][j] = dp[i - 1][j]
            } else {
                // Can use this item
                dp[i][j] = Math.max(goods[i - 1].w + dp[i - 1][j - goods[i - 1].v], dp[i - 1][j])
            }
        }
    }

    return dp[N][V]
}

/**
 * Binary splitting
 */
function binSplit(goods: Goods[]): Goods[] {
    if (!goods.length) {
        return []
    }

    const results: Goods[] = []

    for (const g of goods) {
        let k = 1
        let n = g.c
        while (k <= n) {
            results.push({ w: g.w * k, v: g.v * k, c: 1 })
            n -= k
            k = k << 1
        }

        if (n) {
            results.push({ w: g.w * n, v: g.v * n, c: 1 })
        }
    }

    return results
}

export { knapsack, Goods }