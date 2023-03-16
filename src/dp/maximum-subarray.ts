import { MaxSubInfo } from '../divide-and-conquer/maximum-subarray'

/**
 * 最大子数组（又称为最大子序和）
 * 动态规划算法。时间复杂度：O(n)
 * 
 * 问题描述：
 * 给定一个整数数组 A，找到一个具有最大和的连续子数组（子数组最少包含一个元素），并返回其最大和。
 * 如：A = [-2, 1, -3, 4, -1, 2, 1, -5, 4]，最大子数组为 [4, -1, 2, 1]，和为 6。
 * 
 * 求解思路：
 *  1. 对于数组 A = [a1, a2, ... an]，设其最大子数组 S = A[i:j]，
 *     我们将关注点放在子数组右边界 j 上。
 *     S 亦是数组 A 中“以 j 作为右边界的”最大子数组。
 *  2. 接下来我们以动态规划的思维方式思考，看这个 S 能否通过它的前驱（即“以 j-1 作为右边界”的最大子数组）来求解：
 *     假定我们知道 A 中“以 j-1 作为右边界”的最大子数组是 S'（设为 A[k:j-1]），那能否通过 S' 和 A[j] 求得 S 呢？
 *     可以的，存在如下两种情况：
 *       1. 如果 sum(S') + A[j] > A[j]，则将 A[j] 加入 S' 中即得到 S（此时 S = A[k:j]）；
 *       2. 反之，则由 A[j] 一个元素单独构成 S（此时 S = A[j:j]）；
 *       总之，S = max(S'+A[j], A[j])。
 *  3. 既然能够通过 j-1 求解 j，而初始值又很容易求得（A[0:0] 的最大子数组是它自身），那么就可以用动态规划“滚动式”地求解 S 了；
 *  4. 不过还剩下一个问题，我们之前设定 A 的最大子数组是 S = A[i:j]，但我们并不知道这个右边界 j 到底是多少。
 *     不过，既然我们能够通过 j-1 的解推导 j 的解，那我们就可以通过初始值（A[0]）推导出分别以 0~n 作为右边界的最大子数组，
 *     那个 j 一定在 0~n 之间。然后我们取出其中和最大的那个即可。
 * 
 * 这里的关键是将“最大子数组”的概念转变为“以 j 为右边界的最大子数组”（前者属于后者的一个子集，求出全集后，通过比较即可得到最终解）。
 */

/**
 * 求 arr 的最大子数组，返回对应的子数组以及和
 */
function maxSubarray(arr: number[]): MaxSubInfo {
    if (!arr.length) {
        return { start: -1, end: -1, sum: 0 }
    }

    if (arr.length == 1) {
        return { start: 0, end: 0, sum: arr[0] }
    }

    // dp[i] 表示 arr 中以 i 作为右边界的最大子数组信息
    const dp: MaxSubInfo[] = []
    // 记录 dp 中最大的那个子数组在 dp 中的位置（dp 求解完成后，该位置的值就是最终解）
    let maxIndex = 0

    // 初始化第一个元素
    dp[0] = { start: 0, end: 0, sum: arr[0] }

    let prev: MaxSubInfo
    for (let i = 1; i < arr.length; i++) {
        prev = dp[i - 1]

        // 由于子数组必须以 i 作为右边界，所以可选行为是是否需要 prev 部分
        if (prev.sum + arr[i] > arr[i]) {
            // prev 的值能使结果变大，则用之
            dp[i] = { start:  prev.start, end: i, sum: prev.sum + arr[i]}
        } else {
            // 否则，只用 arr[i]
            dp[i] = { start: i, end: i, sum: arr[i] }
        }

        // 看 dp[i] 是否是目前为止最大的子数组
        if (dp[i].sum > dp[maxIndex].sum) {
            maxIndex = i
        }
    }

    return dp[maxIndex]
}

export { maxSubarray, MaxSubInfo }