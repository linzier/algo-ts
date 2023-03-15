/**
 * 最大子数组（又称为最大子序和）
 * 分治算法求解，时间复杂度：O(n*lgn)
 * 
 * 问题描述：
 * 给定一个整数数组 A，找到一个具有最大和的连续子数组（子数组最少包含一个元素），并返回其最大和。
 * 如：A = [-2, 1, -3, 4, -1, 2, 1, -5, 4]，最大子数组为 [4, -1, 2, 1]，和为 6。
 * 
 * 该问题的最差求解方式是暴力求解，其时间复杂度是 O(n^2)。
 * 
 * 分治策略求解思路：
 *  分治策略分三步：分解、求解、合并。
 *  分解：将问题分解成性质相似但规模更小的子问题（一般分解成两个），本例中将整个数组自中间分为两个子数组：
 *       L = [-2, 1, -3, 4, -1], R = [2, 1, -5, 4]；
 *  求解：由于子数组和上层数组具备相似的性质，所以可通过递归求解子数组 L 和 R 的解（先假定其分别为 subL 和 subR）；
 *  合并：算得 L 和 R 的最大子数组后，我们考察 A 的最大子数组，必然是以下三种情况中的一种：
 *       1. 要么是 subL（即 A 的最大子数组在 L 中）；
 *       2. 要么是 subR（即 A 的最大子数组在 R 中）；
 *       3. 要么同时落在 L 和 R 上（即横跨 L 和 R，至少包含 -1 和 2 两个元素）；
 *       那么接下来的关键就是求解第 3 中情况的最大子数组，然后比较三者取最大的。
 *       对于情况 3，由于最大子数组一定包括 L 的右边界和 R 的左边界，所以我们分别从 L 的右边界（-1）和 R 的左边界（2）分别往两边遍历，即可
 *       求得结果，其时间复杂度是 O(n)。 
 */

// 定义最大子数组信息结构体：起止位置以及和
// 如果是空数组，则 start 和 end 都是 -1
interface MaxSubInfo {
    start: number;
    end: number;
    sum: number;
}

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

    return findMaxSubarray(arr, 0, arr.length - 1)
}

/**
 * 该函数能求解子数组 arr[start:end] 的最大子数组（最大子序和）
 */
function findMaxSubarray(arr: number[], start: number, end: number): MaxSubInfo {
    if (start == end) {
        // 子数组只有一个元素，终止递归
        return { start, end, sum: arr[start] }
    }

    // 不止一个元素时，将 arr 一分为二，分别递归求解左右两个数组的最大子数组
    const mid = start + Math.floor((end - start) / 2)
    const subL = findMaxSubarray(arr, start, mid)
    const subR = findMaxSubarray(arr, mid + 1, end)

    // 求解横跨左右两个数组的那个最大子数组
    const subM = findCrossMaxSubarray(arr, start, mid, end)

    // 从 subL、subR、subM 中取最大的返回
    if (subL.sum >= subR.sum && subL.sum >= subM.sum) {
        return subL
    } else if (subR.sum >= subL.sum && subR.sum >= subM.sum) {
        return subR
    } else {
        return subM
    }
}

/**
 * 求横跨 L = arr[start:mid] 和 R = arr[mid+1:end] 两个数组的最大子数组
 * 注意：该最大子数组至少在 L 和 R 中各占一个元素（否则就变成全部在 L 或者全部在 R，就不满足“横跨”的条件了）
 */
function findCrossMaxSubarray(arr: number[], start: number, mid: number, end: number): MaxSubInfo {
    // 求左边
    // 最大子数组左下标
    let maxLeftIdx = 0
    // 最大子数组的和，初始化为无穷小
    let maxLeftSum = -Infinity
    // 左侧所有元素的和
    let leftSum = 0

    // 从 mid 到 start 依次扫描
    for (let i = mid; i >= start; i--) {
        leftSum += arr[i]
        if (leftSum > maxLeftSum) {
            maxLeftIdx = i
            maxLeftSum = leftSum
        }
    }

    // 求右边
    let maxRightIdx = 0
    let maxRightSum = -Infinity
    let rightSum = 0

    for (let i = mid + 1; i <= end; i++) {
        rightSum += arr[i]
        if (rightSum > maxRightSum) {
            maxRightIdx = i
            maxRightSum = rightSum
        }
    }

    return { start: maxLeftIdx, end: maxRightIdx, sum: maxLeftSum + maxRightSum }
}

export { maxSubarray, MaxSubInfo }