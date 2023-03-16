/**
 * 快速排序
 * 原址排序。时间复杂度: O(n*lgn)
 * 
 * 思路：
 * 设数组 A = [a1, a2, ... an]，
 * 从中随机取一个元素 x，然后将 A 一分为二为 L = [a1', a2', .., ak'], R = [b1', b2', .., bm']，
 * L 中的元素都小于等于 x，R 中的元素都大于 x，此时 A = [...L, x, ...R]。
 * 然后递归地对 L 和 R 做上面的处理。
 * 当递归结束后，所有元素都已经排好序
 */
function quickSort(arr: number[]) {
    innerQuickSort(arr, 0, arr.length - 1)
}

/**
 * 该函数能对 arr[start:end] 子数组执行快排
 */
function innerQuickSort(arr: number[], start: number, end: number) {
    // 只剩一个（或空）时无需排序了
    if (start >= end) {
        return
    }

    const mid = partition(arr, start, end)

    // 再对 mid 左右两边的子数组分别执行快排
    innerQuickSort(arr, start, mid - 1)
    innerQuickSort(arr, mid + 1, end)
}

/**
 * 对子数组 arr[start:end] 执行 partition：
 *  随机取 [start, end] 之间的一个元素 x，然后通过交换元素，
 *  使得 x 左边的元素都小于等于 x，右边的都大于 x
 * @returns partition 后 x 所在的新位置 j
 */
function partition(arr: number[], start: number, end: number): number {
    // 从 arr 中随机取一个元素
    const index = start + Math.floor(Math.random() * (end - start))
    const ele = arr[index]

    /**
     * 我们尽量将小于等于 ele 的元素往左边放，大于它的往右边放
     * 所以我们定义两个游标，left 游标左边的元素都小于等于 ele；right 游标右边的元素都大于 ele
     */

    // 为了满足 left、right 的定义，我们先将 ele 临时放到数组最后面（即和最后一个元素交换位置。防止 ele 所在的位置不满足要求）
    let tmp = arr[end]
    arr[end] = ele
    arr[index] = tmp

    let left = start
    let right = end - 1

    // left 和 right 在一次循环中最多只能有一个移动，保证不会导致 left > right
    while (left < right) {
        if (arr[left] <= ele) {
            // 当前位置的值满足条件，left 指针直接后移
            left++
            continue
        }

        if (arr[right] > ele) {
            // right 位置的值满足条件，right 指针直接前移
            right--
            continue
        }

        // 走到这里，说明 left 和 right 位置的值应该互换
        tmp = arr[left]
        arr[left] = arr[right]
        arr[right] = tmp
    }

    // 至此，left 和 right 重叠
    // 如果 left 位置的值大于 ele 则和 ele 交换，否则用 right + 1 位置的值和 ele 交换
    // 因为 right 是从 end - 1 开始移动的，所以 right + 1 不会越界（顶多是最后一个元素也就是 ele 自身）
    const idx = arr[left] > ele ? left : right + 1
    tmp = arr[idx]
    arr[idx] = ele
    arr[end] = tmp

    return idx
}

export { quickSort, partition }