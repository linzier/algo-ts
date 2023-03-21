/**
 * 顺序统计量
 * 在互异数组 A = [a1, a2, ..., an] 中，第 i 个顺序统计量是该数组中第 i 小的元素。
 * 最小值是第一个顺序统计量；最大值是第 n 个顺序统计量；中位数是第 floor(n/2) 个顺序统计量。
 * 
 * 最小值和最大值可以通过 O(n) 的时间复杂度获得（遍历一遍整个数组）。
 * 第 i 个顺序统计量也可以通过快排思想在线性时间内得到。
 * 
 * 快排实现思路：
 *  1. 对于数组 A = [a1, a2, ..., an]，以快排的 partition 找到主元 A[k] 后，k 左边的元素
 *     都小于 A[k]，k 右边的元素都大于 A[k]；
 *  2. 如果 k 刚好等于 i（假设 i 从 0 开始），则 A[k] 就是第 i 小的元素；
 *  3. 如果 k 大于 i，说明第 i 小的元素在 k 的左边，对 A[0:k-1] 继续执行快排；
 *  4. 如果 k 小于 i，说明第 i 小的元素在 k 的右边，对 A[k+1:n-1] 继续执行快排；
 */

import { partition } from './quick-sort'

/**
 * 返回数组 arr 中第 i 个顺序统计量（第 i 小的值）
 * 为了方便起见，限制 arr 中元素是互异的（各不相等）。对于存在重复元素的，可以先去重。
 * 注意：i 从 1 开始（最大值是 arr.length），和前面的分析稍有不同。
 * arr 不能是空数组
 */
function orderStatistic(arr: number[], i: number): number {
    if (i < 1 || i > arr.length) {
        throw new Error('i 超出范围')
    }

    if (arr.length == 1) {
        return arr[0]
    }

    // 如果是求最大值或者最小值，则使用普通的循环遍历求法，否则采用快排思想
    if (i == 1 || i == arr.length) {
        return findMinMax(arr, i == 1)
    }

    return findMinK(arr, 0, arr.length - 1, i - 1)
}

/**
 * 返回数组最小/最大值
 * @param arr 
 * @param isMin - 是否返回最小值；false 表示返回最大值
 */
function findMinMax(arr: number[], isMin: boolean): number {
    let result = isMin ? Infinity : -Infinity

    for (const ele of arr) {
        if (isMin && ele < result || !isMin && ele > result) {
            result = ele
        }
    }

    return result
}

/**
 * 寻找子数组 arr[start:end] 中第 k 小的元素并返回
 * k 从 0 开始
 * 通过快速排序思想实现
 */
function findMinK(arr: number[], start: number, end: number, k: number): number {
    if (start == end) {
        // 只有一个元素，一定就是它
        return arr[start]
    }

    // 执行 partition
    const pt = partition(arr, start, end)

    const dist = pt - start
    if (dist == k) {
        // pt 就是子数组第 k 小的元素
        return arr[pt]
    }

    // 若不是，则判断第 k 小的元素应该在那边
    if (dist > k) {
        // 应该在左边找
        return findMinK(arr, start, pt - 1, k)
    } else {
        // 在右边找
        // 因为 k 是从 0 开始的，所以 k - pt 得到新的相对距离后还要减去 1
        return findMinK(arr, pt + 1, end, k - dist - 1)
    }
}

export { orderStatistic }