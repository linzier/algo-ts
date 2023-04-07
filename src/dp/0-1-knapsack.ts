/**
 * 0-1 背包问题
 * 有 N 件物品和一个容量为 V 的背包。第 i 件物品的体积是 vi，价值是 wi。
 * 求：将哪些物品装入背包可使这些物品在不超过背包容量 V 的前提下价值总和最大。
 * 所谓 0-1 背包，是指对于每个物品，要么用（且只能用一个），要么不用。
 * 
 * 解题思路：
 * 首先尝试去寻找子问题，看是否能找到最优子结构。
 * 之前在求解字符串问题时，我们习惯于将问题拆解成诸如 s[0:i] 这样的子串：即仅考虑前 i 个字符构成的子串。
 * 背包问题也借鉴此思路。
 * 设有物品 G = [g0, g1, g2, ..., gn]，我们考虑子问题 G[0:i]，即前 i 个物品，看能否通过前 i 个物品的解推出前 i + 1 的解。
 * 不过，这里除了物品数量这一个限制因素，还有一个因素：体积。
 * 因为我们每选择或者不选择某个物品后，都对剩余可用体积产生影响。
 * 所以我们为问题空间引入两个变量：物品数 i 和 可用体积 j。也就是说，我们的动态规划数组是二维的。
 * 
 * 转换方程：
 * 设 dp[i][j] 表示在可用体积为 j 的情况下，前 i 个物品构成的最大价值。
 * 考察如何通过"滚动"的方式求解 dp[i][j]（即找最优子结构）。
 * 当我们面对第 i 个物品时，我们有两种选择：用该物品，或者不用该物品：
 * 1. 不用该物品，此时 dp[i][j] = dp[i - 1][j]；
 * 2. 用该物品。注意，当用该物品时，会对剩余可用空间产生影响，具体来说是：当使用了该物品后，剩余可用空间变为 j - vi。此时最大价值
 *    为本物品的价值 wi 加上前 i - 1 个物品在可用空间为 V - vi 的情况下的最大价值，即 dp[i][j] = dp[i - 1][j - vi] + wi；
 *    注意：还有个条件：用该物品的前提是该物品的体积 vi 不大于剩余体积 j，否则不可用。
 * 那到底是用还是不用该物品呢，取决于情况 1 和情况 2 的哪个总价值大。
 * 即 dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - vi] + wi)。
 * 
 * 初始化：
 * dp[0] 表示不用任何物品，此时价值肯定是 0，即 dp[0][j] = 0；
 * 另外剩余体积为 0 时可不可放入任何物品，即 dp[i][0] = 0；
 * 
 * 终值：
 * dp[N][V]，表示在可用体积 V 下所有物品构成的最大价值。
 * 
 * 复杂度：
 * 时间复杂度：O(N*V)；空间复杂度：O(N*V)。
 * 其中空间复杂度可通过滚动数组将二维数组压缩成一维数组，即 O(V)。
 */

interface Goods {
    // 物品价值
    w: number;
    // 物品体积，正整数
    v: number;
}

/**
 * 背包问题
 * @param goods - 物品集合
 * @param V - 背包容量。整数
 * @returns 最大价值
 */
function knapsack(goods: Goods[], V: number): number {
    if (!goods.length || !V) {
        return 0
    }

    const N = goods.length
    // 二维动态规划表，大小：N+1 * V+1
    const dp: number[][] = []

    // 初始化
    for (let i = 0; i <= N; i++) {
        dp[i] = []

        dp[i][0] = 0
    }

    for (let j = 0; j <= V; j++) {
        dp[0][j] = 0
    }

    for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= V; j++) {
            // 注意：i 表示前 i 个物品，转成下标需要减 1
            if (goods[i - 1].v > j) {
                // 当前物品体积大于可用体积，一定不能放进去
                dp[i][j] = dp[i - 1][j]
            } else {
                // 可用该物品时，有两种选择：用或者不用，取总价值最大的
                dp[i][j] = Math.max(goods[i - 1].w + dp[i - 1][j - goods[i - 1].v], dp[i - 1][j])
            }
        }
    }

    return dp[N][V]
}

export { knapsack, Goods }