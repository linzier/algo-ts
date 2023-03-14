/**
 * 逆序对
 * 定义：假设 A = [a1, a2, ... an] 是一个有 n 个不同数的数组，若 i<j 且 A[i]>A[j]，则对偶 (i,j) 称为 A 的一个逆数对。
 * 如数组 A = [1, 4, 3, 2]，存在 (4,3)、(4,2)、(3,2) 三个逆数对。
 * 
 * 逆序对数量求解：
 *  可以用两层循环暴力求解，时间复杂度是 O(n^2)。
 *  这里用归并排序过程来计算逆数对数量，时间复杂度是 O(n*lgn)。
 *  归并排序将数组 A 划分成两个排好序的左右子数组：L' = A[0:mid]、R' = [mid+1:len-1]，由于 L'、R' 是已经排好序的，所以它们自身内部的逆序对个数是 0，
 *  所以 L'+R' 的逆序对个数实际上就等于左子数组 L' 和右子数组 R' 之间的逆序对数量（设为 z）。
 *  另外，我们假设 L' 和 R' 在排好序之前其内部的逆序对个数分别是 x 和 y，则整个数组 A 的逆序对数量为 z + x + y。 
 * 
 *  例如：
 *      A = [3, 7, 1, 2, 6, 4]
 *      划分成两个子数组：L = [3, 7, 1], R = [2, 6, 4]。我们假设 L 的逆序对个数是 x，R 的逆序对个数是 y（先不管怎么算出来的）；
 *      然后将 L、R 分别执行归并排序得到排好序的 L' = [1, 3, 7]，R' = [2, 4, 6]；
 *      此时，如果我们能求出 L'+R'（即数组 [1, 3, 7, 2, 4, 6]）的逆逆序对数量 z，再加上 L 和 R 内部的逆序对数量 x、y 则为原始数组 A 的逆序对数量。
 * 
 *      (
 *       这里需要搞清楚为啥 A 的逆序对数量等于 z + x + y。
 *       我们对 L 和 R 内部元素无论如何移动位置，都不会导致 L 和 R 之间交换元素，L 中的元素无论如何移动，移动后其新下标仍然小于 R 中的任何元素。
 *       也就是说，如果 L 中的某个元素在排序前和 R 中元素构成 a 个逆序对，那么在 L 排完序后，它和 R 中元素仍然构成 a 个逆序对。
 *       例如 L 中的 3，在 L 排序之前它和 R 中元素构成 (3,2) 一个逆序对；在 L 排完序后，仍然是 (3,2) 这个逆序对。
 *       所以，3 这个元素在 A 中构成的逆序对数量等于它在 L 内部构成的数量(1)加上它和 R 中构成的数量(1)，共 2 个。其它元素以此类推。
 *       所以，A 中逆序对数量就等于 L 中逆序对数量 x 加 R 中逆序对数量 y，再加上 L 中元素和 R 中元素构成的逆序对数量 z。
 *       所以我们先把 L 和 R 内部的逆序对数量的求解放在一边（设定为 x、y），先求解 L 和 R 之间的数量 z。如果果真能求出 z，那么就可以通过递归求出 x 和 y。
 *      )
 * 
 *      所以现在的重点是如何求出 L' = [1, 3, 7] 和 R' = [2, 4, 6] 之间的逆序对数量：
 *      1. 我们先拿 L'[0] 和 R'[0] 比较，1 小于 2，那么 1 一定小于 R'[0] 后面的元素（因为是升序的），所以 L'[0] 和 R' 构成 0 个逆序对；
 *      2. 将 1 从 L' 中拿掉（或者用游标，将游标向后移一位）；
 *      3. 再拿 L'[1] 和 R'[0] 比较，3 大于 2，那么 L'[1] 后面的元素一定大于 2，所以 L' 中的所有元素和 R'[0] 构成 2 个逆序对（L'[1] 以及后面元素的个数）；
 *      4. 将 2 从 R' 中拿掉；
 *      5. 再拿 L'[1] 和 R'[1] 比较，3 小于 4，同第 1 步，得到 0 个逆序对；
 *      6. 将 3 从 L' 中拿掉；
 *      7. 再拿 L'[2] 和 R'[1] 比较，7 大于 4，得到 1 个逆序对；
 *      8. 将 4 从 R' 中拿掉；
 *      9. 再拿 L'[2] 和 R'[2] 比较，7 大于 6，得到 1 个逆序对；
 *      10. 将 6 从 R' 中拿掉；
 *      11. 此时 R' 空了，结束匹配，最终得到逆序对数量为 4；
 *      整个过程中，每一步都会从 L' 或者 R' 中踢掉一个元素（或者说 L' 或者 R' 的游标前进一位），直到其中一个为空，所以最多需要 L'.length+R'.length 步。
 *      而且对比归并排序的 merge 逻辑会发现，上面整个逻辑和 merge 过程极为相似，除了:
 *          (1) 任何一个子数组空后就不再计算了；
 *          (2) 如果左边元素大于右边的，在 merge 逻辑的基础上，加上计算逆序对的逻辑；
 */

/**
 * 求数组 arr 中逆序对数量
 * 基于归并排序实现
 */
function inversionPair(arr: number[]): number {
    if (arr.length < 2) {
        return 0
    }

    return innerInversion(arr, 0, arr.length - 1)
}

/**
 * 该内部函数能够对子数组 arr[start:end] 执行归并排序并计算逆序对数量
 * @param arr 待处理数组
 * @param start 子数组开始位置
 * @param end 子数组结束位置
 */
function innerInversion(arr: number[], start: number, end: number): number {
    if (start >= end) {
        // 子数组只有一个元素（或没有元素），结束处理
        return 0
    }

    // 取中点
    const mid = start + Math.floor((end - start) / 2)

    // 对左边子数组（包括 mid 本身）排序
    const lCnt = innerInversion(arr, start, mid)
    // 对右边子数组排序
    const rCnt = innerInversion(arr, mid + 1, end)

    // 合并左右两个已经排好序的子数组
    return lCnt + rCnt + merge(arr, start, mid, end)
}

/**
 * 该函数能够合并两个已经排好序的子数组 arr[left:mid] 和 arr[mid+1:right]，合并后的数组 arr[left:right] 仍然具备有序性
 * 同时返回两个子数组之间的逆序对数量
 * 
 * 合并逻辑：
 *  1. 对于两个子数组：L = [a1, a2, ... an]，R = [b1, b2, ... bm]
 *  2. 比较 L 和 R 中最左侧两者元素（a 和 b），将最小的那个从子数组中弹出并压入新数组 A 中；
 *  3. 继续做第 2 步的操作，直到其中一个或者两个子数组变为空；
 *  4. 一旦其中一个子数组变为空，则将另一个子数组中剩余元素直接追加到新数组 A 中即可；
 *  由于步骤 2、3 是在不断比较两个数组中的值，取小的压入新数组中，所以最终得到的新数组 A 仍然是有序的。
 *  操作步数（A 的长度）：L.length + R.length（每次要么从 L 中取一个，要么从 R 中取一个）
 *
 * @param arr 待处理数组
 * @param left 左边界
 * @param mid 中间边界
 * @param right 右边界
 */
function merge(arr: number[], left: number, mid: number, right: number): number {
    // 创建左右子数组的两个副本
    const larr = arr.slice(left, mid + 1)
    const rarr = arr.slice(mid + 1, right + 1)

    // 执行 L.length + R.length 次（从 left 到 right，依次设置 arr 的元素值）
    let pair = 0
    for (let i = left; i <= right; i++) {
        // 有一个数组为空（不可能两个同时为空）
        if (!larr.length) {
            arr[i] = rarr.shift() as number
            continue
        } else if (!rarr.length) {
            arr[i] = larr.shift() as number
            continue
        }

        // 左右数组都不为空
        if (larr[0] > rarr[0]) {
            pair += larr.length
            arr[i] = rarr.shift() as number
        } else {
            arr[i] = larr.shift() as number
        }
    }

    return pair
}

export { inversionPair }