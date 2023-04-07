/**
 * 多重背包问题
 * 有 N 件物品和一个容量为 V 的背包。第 i 件物品的体积是 vi，价值是 wi，可用数量是 ci。
 * 求：将哪些物品装入背包可使这些物品在不超过背包容量 V 的前提下价值总和最大。
 * 和 0/1 背包问题不同的是，物品 i 可以使用 0..ci 个。
 * 
 * 求解思路：
 * 和 0/1 背包的思路类似（请先参见 0/1 背包问题的说明）。
 * 我们用 dp[i][j] 表示在可用空间为 j 的情况下，利用前 i 个物品可以构成的最大价值。
 * 我们尝试将多重背包转化成 0/1 背包：
 * 假如有三个物品 arr = [g1, g2, g3]，各自数量(c)为：g1.c = 2, g2.c = 3, g3.c = 4，则可转换为如下数组：
 * arr' = [g1', g1', g2', g2', g2', g3', g3', g3', g3'] 共 9 个物品，每个物品数量为 1，这就是 0/1 背包问题。
 * 不过，如果 gi 的数量非常多（如 10000 个），则拆解出来的数组非常大。
 * 有没有更优的拆解方式呢？
 * 
 * 二进制拆分：
 * 对于一个数 n，总是能拆分成若干个 2^i 的数相加，外加上一个余数。
 * 如：
 * 7 可以拆解成 7 = 1 + 2 + 4；
 * 12 可以拆解成 12 = 1 + 2 + 4 + 5；
 * 15 可以拆解成 15 = 1 + 2 + 4 + 8；
 * 这种拆分有什么特点呢？
 * 拆解出来的数可以构成 1..n 之间的任何数。
 * 如 15 的拆解出来的四个数 1、2、4、8 之间通过加法运算可以构成 1 到 15 之间的任何数（且四个数中的每个数最多只会用一次）。
 * 有什么用？
 * 对于“取 n 个相同元素中任意多个元素尝试”之类的问题，便可以用二进制拆分来大大降低组合尝试的次数。
 * 比如 15，如果看做 15 个独立的元素，则要执行 15 次尝试，执行二进制拆分后，只需要尝试 4 次。如果是 10000 个元素，则只需要
 * 14 次，差距巨大（Math.log2(10000)）。
 * 
 * 基于二进制拆分的求解思路：
 * 就是将前面物品的拆分方式改成二进制拆分：
 * arr'' = [g1', g1', g2', g2'', g3', g3'', g3'] 共 7 个物品，其中 g2'' 的体积和价值是 g2' 的两倍，其它也是类推。
 *（上面的由于物品数量少，优化不明显，当物品数量很多的时候，可以看出明显的优化效果。）
 * 然后再用 0/1 背包思路求解即可。 
 * 
 * 复杂度：
 * 时间复杂度：O(V*N*logm)；空间复杂度：O(V*N*logm)；
 * 
 * 优化：
 * 和 0/1 背包一样，可以通过滚动数组将空间复杂度优化到 O(V)。略。
 */

interface Goods {
    // 物品价值
    w: number;
    // 物品体积，正整数
    v: number;
    // 物品数量
    c: number;
}

/**
 * 多重背包问题
 * @param goods - 物品集合
 * @param V - 背包容量。整数
 * @returns 最大价值
 */
function knapsack(goods: Goods[], V: number): number {
    if (!goods.length || !V) {
        return 0
    }

    // 执行二进制拆分
    goods = binSplit(goods)

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
                // 当前物品体积大于可用体积，无法用当前物品
                dp[i][j] = dp[i - 1][j]
            } else {
                // 可用该物品
                dp[i][j] = Math.max(goods[i - 1].w + dp[i - 1][j - goods[i - 1].v], dp[i - 1][j])
            }
        }
    }

    return dp[N][V]
}

/**
 * 二进制拆分
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