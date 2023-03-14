/**
 * 选择排序
 * 选择排序属于原址排序，时间复杂度 O(n^2)
 * 
 * 原理：
 *  1. 对于待排序数组 A = [a1, a2, ... an]；
 *  2. 首先从 A[0:n-1] 中选出最小的，和 A[0] 交换（也就是把整个数组中最小的放在 A[0]）；
 *  3. 然后从剩下的 A[1:n-1] 中选出最小的，和 A[1] 交换。此时，A[0]、A[1] 分别放的是整个数组中最小和次小的元素；
 *  4. 然后从剩下的 A[2:n-1] 中选出最小的，和 A[2] 交换；
 *  5. 以此类推......
 *  我们发现，当处理子数组 A[i:n-1] 时，A[0:i-1] 已经排好序，那么当处理到 A[n-1] 时，整个数组都已经排好序。
 * 
 * 例：
 *  待排序数组：A=[3, 1, 2, 5, 4]。
 *  首先取整个数组最小元素和 A[0] 交换，得到：[1, 3, 2, 5, 4]
 *  再从 [3, 2, 5, 4] 中取出最小的 和 A[1] 交换，得到：[1, 2, 3, 5, 4]
 *  再从 [3, 5, 4] 中取出最小的和 A[2] 交换，得到：[1, 2, 3, 5, 4]
 *  再从 [5, 4] 中取出最小的和 A[3] 交换，得到：[1, 2, 3, 4, 5]
 *  然后只剩下最后一个元素 [5]，它一定是整个数组中最大的，无需处理了
 */

/**
 * 对 number 数组执行选择排序（升序）
 * @param arr 待排序数组
 */
function selectSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    const len = arr.length
    let min: number
    let minIdx: number
    let tmp: number

    // 只需要处理 n-1 次，因为第 n 次时子数组只有最后一个元素，一定是最大元素，无需和任何元素交换了
    for (let i = 0; i < len - 1; i++) {
        // 遍历子数组 arr[i:len-1]，找出最小的元素位置
        min = arr[i]
        minIdx = i
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < min) {
                min = arr[j]
                minIdx = j
            }
        }

        // 交换
        if (minIdx != i) {
            tmp = arr[i]
            arr[i] = arr[minIdx]
            arr[minIdx] = tmp
        }
    }
}

export { selectSort }