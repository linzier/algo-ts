/**
 * 归并排序
 * 归并排序采用分治思想，将整个问题拆分成若干个子问题（子问题和父问题具有相似的性质），递归地对子问题求解，然后合并子问题以得到整个问题的解。
 * 时间复杂度：O(n*lgn)
 * 归并排序不是原址排序，需要额外的内存空间执行合并操作（merge）
 * 
 * 原理：
 *  1. 设待排序数组 A = [a1, a2, ... an]；
 *  2. 我们将数组 A 一分为二，得到 L = A[0:n/2] 和 R = A[n/2+1:len-1] 两个子数组（分解）；
 *  3. 分别对 L 和 R 这两个子数组执行排序（解决）；
 *  4. 对已经排好序的 L 和 R 执行合并，得到最终结果（合并）；
 *  其中，第 3 步是个递归过程，L 和 R 两个子数组的排序同样经历 2、3、4 三个步骤。
 *  该递归式的终止条件是拆分后的子数组最多只有一个元素，对于一个元素（或空）的数组无需再执行排序。
 * 
 * 例：
 *  待排序数组 A=[3, 1, 2, 5, 4]；
 *  对 A 一分为二得到 L = [3, 1]，R = [2, 5, 4] 两个子数组；
 *  对 L 和 R 继续一分为二，我们以 L 为例：
 *      L -> L1 = [3], L2 = [1]；
 *      L1 和 L2 各自只有一个元素了，不再需要递归拆分了；
 *  合并 L1 和 L2 得到排好序的 L' = [1, 3]；
 *  子数组 R 也按照同样的方式，最终得到排好序的 R' = [2, 4, 5]；
 *  继续向上合并 L' 和 R' 得到整个排好序的数组 A' = [1, 2, 3, 4, 5]；
 * 
 *  由本例可知：关键是如何对 L' 和 R' 执行合并操作，使得合并后的数组依然是排好序的。
 * 
 * @todo 优化：由于常量因子的影响，少量数据时，插入排序比归并排序表现更好，所以当子数组元素数小于一个临界点时不再递归，转用插入排序，减少归并排序的递归次数
 */

/**
 * 对数值类型数组执行归并排序
 * @param arr 待排序的数组
 */
function mergeSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    // 因为需要不断对子数组执行递归操作，我们定义一个内部函数来处理递归
    innerSort(arr, 0, arr.length - 1)
}

/**
 * 该内部函数能够对子数组 arr[start:end] 执行归并排序
 * @param arr 待排序数组
 * @param start 子数组开始位置
 * @param end 子数组结束位置
 */
function innerSort(arr: number[], start: number, end: number) {
    if (start >= end) {
        // 子数组只有一个元素（或没有元素），结束处理
        return
    }

    // 取中点
    const mid = start + Math.floor((end - start) / 2)

    // 对左边子数组（包括 mid 本身）排序
    innerSort(arr, start, mid)
    // 对右边子数组排序
    innerSort(arr, mid + 1, end)

    // 合并左右两个已经排好序的子数组
    merge(arr, start, mid, end)
}

/**
 * 该函数能够合并两个已经排好序的子数组 arr[left:mid] 和 arr[mid+1:right]，合并后的数组 arr[left:right] 仍然具备有序性
 * 合并逻辑：
 *  1. 对于两个子数组：L = [a1, a2, ... an]，R = [b1, b2, ... bm]
 *  2. 比较 L 和 R 中最左侧两者元素（a 和 b），将最小的那个从子数组中弹出并压入新数组 A 中；
 *  3. 继续做第 2 步的操作，直到其中一个或者两个子数组变为空；
 *  4. 一旦其中一个子数组变为空，则将另一个子数组中剩余元素直接追加到新数组 A 中即可；
 *  由于步骤 2、3 是在不断比较两个数组中的值，取小的压入新数组中，所以最终得到的新数组 A 仍然是有序的。
 *  操作步数（A 的长度）：L.length + R.length（每次要么从 L 中取一个，要么从 R 中取一个）
 * 
 * 哨兵：由第 4 步可知，每次我们必须检验子数组是否空了，如果空了则只能操作另一个数组。我们可以给两个子数组末尾各加一个极大值（如正无穷大）作为哨兵，因为数组中
 * 正常的值一定都小于哨兵，所以它能防止数组变空，从而免去数组判空的步骤，只需要操作 L.length + R.length 步后退出即可。
 *  
 * @param arr 待处理数组
 * @param left 左边界
 * @param mid 中间边界
 * @param right 右边界
 */
function merge(arr: number[], left: number, mid: number, right: number) {
    // 创建左右子数组的两个副本
    const larr = arr.slice(left, mid + 1)
    const rarr = arr.slice(mid + 1, right + 1)

    // 加哨兵
    larr.push(Infinity)
    rarr.push(Infinity)

    // 执行 L.length + R.length 次（从 left 到 right，依次设置 arr 的元素值）
    for (let i = left; i <= right; i++) {
        arr[i] = (larr[0] > rarr[0] ? rarr.shift() : larr.shift()) as number
    }
}

export { mergeSort }