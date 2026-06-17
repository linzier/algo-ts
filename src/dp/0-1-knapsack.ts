/**
 * 0-1 Knapsack Problem
 * There are N items and a knapsack with capacity V. The i-th item has volume vi and value wi.
 * Find: which items to put into the knapsack so that the total value is maximized without exceeding the knapsack capacity V.
 * So-called 0-1 knapsack means for each item, either use it (and can only use one), or don't use it.
 *
 * Solution approach:
 * First try to find subproblems, see if we can find optimal substructure.
 * When solving string problems, we are accustomed to decomposing the problem into substrings like s[0:i]:
 * i.e., only considering the substring formed by the first i characters.
 * The Knapsack Problem also borrows this approach.
 * Let items be G = [g0, g1, g2, ..., gn], we consider subproblem G[0:i], i.e., the first i items,
 * and see if we can derive the solution for the first i+1 items from the solution for the first i items.
 * However, besides the item quantity constraint, there is another constraint: volume.
 * Because each time we choose or don't choose an item, it impacts the remaining available volume.
 * Therefore we introduce two variables into the problem space: item count i and available volume j.
 * That is, our dynamic programming array is two-dimensional.
 *
 * Transition equation:
 * Let dp[i][j] represent the maximum value formed by the first i items when the available volume is j.
 * Examine how to solve dp[i][j] in a "rolling" manner (i.e., find optimal substructure).
 * When we face the i-th item, we have two choices: use this item, or don't use this item:
 * 1. Don't use this item, then dp[i][j] = dp[i - 1][j];
 * 2. Use this item. Note, when using this item, it impacts the remaining available space. Specifically:
 *    after using this item, the remaining available space becomes j - vi. The maximum value at this point
 *    is this item's value wi plus the maximum value of the first i-1 items when available space is V - vi,
 *    i.e., dp[i][j] = dp[i - 1][j - vi] + wi;
 *    Note: there's still a condition: the prerequisite for using this item is that this item's volume vi
 *    does not exceed the remaining volume j, otherwise it cannot be used.
 * Whether to use or not use this item depends on which case gives a larger total value.
 * I.e., dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - vi] + wi).
 *
 * Initialization:
 * dp[0] means not using any item, the value is certainly 0, i.e., dp[0][j] = 0;
 * Additionally, when remaining volume is 0, no item can be put in, i.e., dp[i][0] = 0;
 *
 * Terminal value:
 * dp[N][V], represents the maximum value formed by all items with available volume V.
 *
 * Complexity:
 * Time complexity: O(N*V); Space complexity: O(N*V).
 * The space complexity can be optimized through a rolling array to compress the 2D array into a 1D array, i.e., O(V).
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
                // Current item volume/weight greater than available volume, certainly cannot use it
                dp[i][j] = dp[i - 1][j]
            } else {
                // Can use this item, has two choices: use or don't use, get the maximum total value
                dp[i][j] = Math.max(goods[i - 1].w + dp[i - 1][j - goods[i - 1].v], dp[i - 1][j])
            }
        }
    }

    return dp[N][V]
}

export { knapsack, Goods }