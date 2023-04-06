/**
 * 数字三角形
 * 给定一个如下图所示的数字三角形，从顶部出发，在每一结点可以选择移动至其左下方的结点或移动至其右下方的结点，
 * 一直走到底层，要求找出一条路径，使路径上的数字的和最大。
 * 也就是说，arr[i][j] 只能往下走到 arr[i+1][j] 和 arr[i+1][j+1]。
 * 反过来说，arr[i+1][j] 节点只能由 arr[i][j - 1] 和 arr[i][j] 到达。
 * 注意边界问题。
 *                      7
 *                    3   8
 *                  8   1   0
 *                2   7   4   4
 *              4   5   2   6   5
 * 最大和路径为：
 *                     (7)
 *                   (3)   8
 *                 (8)   1   0
 *                2  (7)  4   4
 *              4  (5)  2   6   5
 * 和为 7 + 3 + 8 + 7 + 5 = 30
 * 
 * 求解思路：
 * 设最优路径如下：a1,...,an-1,an。我们考察是否存在最优子结构特性。
 * 我发现，上述路径的子路径 a1,...,an-1 必定也是一条最优路径，因为如若不是，那么必然存在一条更优的进过 an-1 的路径，那么这条更优的路径必然
 * 也能和 an 构成一条更优路径，和前提矛盾。
 * 也就是说，如果我们定义 dp[i][j] 表示以 arr[i][j] 为终点的最优路径，那么 dp[i][j] 可以通过 max(dp[i-1][j-1], dp[i-1][j]) 得到。
 * 
 * 数字三角形是一类思想，用来解决最大/最小权路径问题，如迷宫问题、最短路径问题等。
 */

interface Node {
    // 以该节点为终点的最优路径的权值
    value: number;
    // 前一个节点索引
    prev: number;
}

/**
 * 数字三角形问题
 * @param arr - arr[i] 里面有 i + 1 个数字
 * @returns 最优路径上的节点
 */
function numberTriangle(arr: number[][]): number[] {
    if (!arr.length) {
        return []
    }

    // dp 数组。n*m 的二维数组。n: arr.length; m: arr 中最后一个数组中数字个数
    const dp: Node[][] = []

    // 初始化
    for (let i = 0 ;i < arr.length; i++) {
        dp[i] = []
    }
    dp[0][0] = { value: arr[0][0], prev: -1 }

    // 状态转移
    for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            // 取 dp[i - 1][j - 1] 和 dp[i - 1][j] 之间最大的
            // 注意判断边界条件
            const left = j - 1 >= 0 ? dp[i - 1][j - 1].value : -Infinity
            const right = j < arr[i - 1].length ? dp[i - 1][j].value : -Infinity

            if (left > right) {
                dp[i][j] = { value: left + arr[i][j], prev: j - 1 }
            } else {
                dp[i][j] = { value: right + arr[i][j], prev: j }
            }
        }
    }

    // 取 dp[arr.length - 1] 中最大的
    let index = -1
    const last = dp[arr.length - 1]
    for (let j = 0; j < last.length; j++) {
        if (index < 0 || last[j].value > last[index].value) {
            index = j
        }
    }

    // 回溯
    const result: number[] = new Array(arr.length)
    for (let i = arr.length - 1; i >= 0; i--) {
        result[i] = arr[i][index]

        // 上一层的 index
        index = dp[i][index].prev
    }

    return result
}

export { numberTriangle }