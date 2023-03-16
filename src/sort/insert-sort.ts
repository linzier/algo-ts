/**
 * 插入排序
 * 插入排序属于原址排序（直接在原数组上交换值，无需额外的内存空间），时间复杂度 O(n^2)
 * 
 * 原理：
 *  1. 设待排序序列 A=[a0, a1, a2, ... an]；
 *  2. 从左到右依次处理；
 *  3. 当处理第 i 个元素时，其前面的元素（子数组 A[0:i-1]）已经完成排序；
 *  4. 那么，只需要将元素 i 插入到前面第一个小于等于它的元素的后面即可（对于升序排序）。
 * 
 * 例：
 *  待排序数组 A=[3, 1, 2, 5, 4]。
 *  从 A[1] 开始处理。1 小于 3，需要将 1 放到 3 前面，得到：[1, 3, 2, 5, 4]；
 *  接着处理 A[2]。2 小于 3，大于 1，需要放到 1 和 3 之间，得到：[1, 2, 3, 5, 4]；
 *  接着处理 A[3]。5 大于 3，所以不需要做任何处理，得到：[1, 2, 3, 5, 4]；
 *  接着处理 A[4]。4 小于 5，大于 3，放在 3 和 5 之间，得到：[1, 2, 3, 4, 5]；
 * 
 * 由于在处理第 i 个元素 x 时，i 前面的元素（A[0:i-1]）已经排好序了，那么当我们按照上述规则将 x 插入到合适的位置 j 后，能保证 A[j-1] <= x < A[j+1]，
 * 所以 x 插入完成后，新数组 A[0:i] 仍然是有序的。
 */

/**
 * 对 number 数组执行插入排序（升序）
 * @param arr 待排序数组
 */
function insertSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    // 从第二个元素开始（因为第一个元素前面没有元素了，无需和前面比较）
    let curr: number
    for (let i = 1; i < arr.length; i++) {
        // 先暂存当前元素
        curr = arr[i]

        // 只要 j 位置的值大于 curr 则往后挪一位
        let j = i - 1
        while (j >= 0 && arr[j] > curr) {
            arr[j + 1] = arr[j]
            // 继续往前检查
            j -= 1 
        }

        // 找到了第一个小于等于 curr 的位置，将 curr 插入到其后面（j+1 位置）
        // 注意：j 有可能是 -1，此时说明 i 前面所有的元素都比 curr 大，此时将 curr 放在 arr[0]
        arr[j + 1] = curr
    }
}

export { insertSort }