/**
 * Complete Knapsack Problem
 * There are N items and a knapsack with capacity V. The i-th item has volume vi and value wi.
 * Find: which items to put into the knapsack so that the total value is maximized without exceeding the knapsack capacity V.
 * The difference from the 0/1 Knapsack Problem is that here each type of item can be used 0 or unlimited times.
 *
 * Solution approach:
 * Similar to the 0/1 knapsack approach (please see the 0/1 Knapsack Problem description first).
 * We use dp[i][j] to represent the maximum value that can be formed using the first i items when the available space is j.
 * Note: each item can be used 0 or many times.
 * Two cases:
 * 1. Use the i-th item. The remaining space is j - vi. Note, the problem to examine next differs from 0/1 knapsack:
 *    in 0/1 knapsack, after using item i, only i-1 items remain available, but here since item usage count is unlimited,
 *    the remaining available items are still i, so dp[i][j] = dp[i][j - vi] + wi.
 *    Note the meaning of dp[i][j - vi]: it represents the maximum value that can be formed by the first i items
 *    when the remaining space is j - vi, which already includes the case of using 0 or many item i.
 *    (Need to carefully understand case 1, it covers all scenarios of using 1 or many item i in the remaining space j.
 *    Only by understanding this can you understand why case 2 only needs to consider the first i-1 items.)
 * 2. Besides case 1, there is still one case to consider: not using item i at all. The remaining space is still j,
 *    which means examining the maximum value formed by the first i-1 items in space j.
 * (Case 1 examines scenarios of using (1 or many) item i; case 2 examines scenarios of not using item i;)
 * Finally get the maximum value from both cases.
 *
 * Transition equation:
 * When j < vi:
 *  dp[i][j] = dp[i - 1][j]
 * Otherwise:
 *  dp[i][j] = max(dp[i - 1][j], dp[i][j - vi] + wi)
 * From the transition equation, the only difference from 0/1 knapsack is changing dp[i - 1][j - vi] + wi to dp[i][j - vi] + wi.
 *
 * Optimization:
 * Same as 0/1 knapsack, can optimize space complexity to O(V) through rolling array. Omitted.
 */

interface Goods {
    // Item value
    w: number;
    // Item volume/weight, positive integer
    v: number;
}

/**
 * Knapsack Problem
 * @param goods - Item set
 * @param V - Knapsack capacity. Integer
 * @returns Maximum value
 */
function knapsack(goods: Goods[], V: number): number {
    if (!goods.length || !V) {
        return 0
    }

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
                // Can use this item, use 0 or many, get the maximum
                dp[i][j] = Math.max(goods[i - 1].w + dp[i][j - goods[i - 1].v], dp[i - 1][j])
            }
        }
    }

    return dp[N][V]
}

export { knapsack, Goods }