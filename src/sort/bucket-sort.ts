/**
 * 桶排序
 * 时间复杂度：O(n)
 * 
 * 设待排序数组 A = [a1, a2, ..., an]，其元素在 [0..1) 之间均匀分布。
 * 桶排序的思想是，我们创建一个数组 B(n) 作为 n 个“桶”，将 A 中的元素均匀地分配到这些桶中，
 * 由于 桶之间是排好序的（按 B 的下标），我们只需要对桶内部的元素执行插入排序，即完成对整个数组 A 的排序。
 * 
 * 插入排序的时间复杂度是 O(n^2)，但由于 A 中的（均匀分布的）元素是均匀地落入到 n 个桶中，每个桶中期望元素数量
 * 都很少，所以每个桶中的插入排序期望代价是常数，整个桶排序的时间复杂度是 O(n)。
 * 
 * 如何实现桶：
 * B 中的元素类型是链表，通过链表将桶中的元素按顺序链在一起。
 * 
 * 如何分配元素到桶中：
 * 根据 j = Math.floor(A[i] * n) 将元素分配到 j 桶中。
 * 由于 A[i] 在 [0..1) 之间，所以 A[i] * n 一定小于 n。
 */

import { insertSort } from './insert-sort'

/**
 * 对 number 数组执行桶排序。数组中元素必须属于 [0..1) 之间的数
 * @param arr 待排序数组
 */
function bucketSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    // 创建一个数组存放 n 个桶
    // 一般通过链表来实现桶，但由于 js 的数组可以自由扩张，而且桶中元素数量不会太大，这里直接用 js 的数组来实现桶
    const B: number[][] = []

    // 将 arr 中元素放入桶中
    const len = arr.length
    for (const val of arr) {
        // 计算桶序号
        const bIndex = Math.floor(val * len)
        B[bIndex] === undefined && (B[bIndex] = [])

        // 插入到桶中
        insertToBucket(B[bIndex], val)
    }

    // 已排好序，复制到 arr 中
    let i = 0
    for (const bucket of B) {
        if (bucket === undefined) {
            continue
        }
        
        arr.splice(i, bucket.length, ...bucket)
        i += bucket.length
    }
}

/**
 * 将元素 val 插入到桶中并实现排序
 */
function insertToBucket(bucket: number[], val: number) {
    bucket.push(val)
    // 执行插入排序
    insertSort(bucket)
}

export { bucketSort }