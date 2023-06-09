/**
 * 基数排序
 * 时间复杂度：O(n)。
 * 
 * 设有手机号数组 A = ['13909898741', '15809837812', '13098192837', ...]
 * 如何对其排序？
 * 除了使用比较排序算法（插入、归并、快排等），还可以采用如下方式：
 * A(n) = [
 *      '13909898741',
 *      '15809837812',
 *      '13098192837',
 *      ...
 * ] 
 * 这里所有元素的位数都是一样的（11 位），且每一位上的值都是有范围的（0-9）。
 * 我们可以从右到左（低位到高位），一次取一列数据进行排序，并根据排序结果调整元素位置。当最后一列（最左边）排序完成后，
 * 整个元素即排好序。
 * 
 * 例：
 * 数组 A = [
 *      '427',
 *      '169',
 *      '702',
 *      '239',
 *      '233',
 *     ]
 * 该数组每个元素宽度都是 3 位，且每位上值范围都是 0 ~ 9。
 * 1. 根据最左边的值排序得到：
 *      A = [
 *          '702',
 *          '233',
 *          '427',
 *          '169',
 *          '239',
 *      ]
 * 2. 在 1 的基础上，根据中间的值排序得到：
 *      A = [
 *          '702',
 *          '427',
 *          '233',
 *          '239',
 *          '169',
 *      ]
 * 3. 在 2 的基础上，根据最右边的值排序得到：
 *      A = [
 *          '169',
 *          '233',
 *          '239',
 *          '427',
 *          '702',
 *      ]
 *  即为最终结果。
 * 
 * 一次只从各元素中取同一列的单个部分执行排序（而不是对整个元素执行排序）并据此排序结果安排元素位置；从右到左，每完成一轮排序，
 * 就根据最新列排序结果调整元素位置。当最左边列排序完成后，整个数组元素的位置最终有序。
 * 一列的值一般不会太大，对于 10 进制就是 0 ~ 9，对于字母就是 a-z 以及 A-Z，这些范围（值）就是基（十进制数的基就是 10），因而可以
 * 使用线性复杂度的计数排序实现（列排序算法必须是稳定的，计数排序符合条件），因此基数排序时间复杂度是 O(n)（n*d*k，d 是元素宽度，
 * k 是每列的值上限，d 和 k 都不会太大，可认为是常数，因而时间复杂度是 O(n)）。
 * 
 * 为何要从右到左逐列排序（而不是从左到右）呢？
 * 设有如下数组:
 *  B = [
 *      241,
 *      190,
 *  ]
 * 如果从左到右逐列排序：
 *  1. 先根据最左列排序得到：
 *    B = [
 *        190,
 *        241,
 *    ]
 *  2. 再根据第二列排序。4 比 9 小，但能直接据此将 241 放 190 前面吗？不能，此时我们还要去考虑右边列的值大小（已经排完序的列），
 *     如果右边有多列，那每列都得重新考虑。
 *     从右往左排列则无此问题，因为右边列的权重大于左边的列，所以在排右边列时，无需顾及左边的列。右边列值大的一定排在后面，无论其左边列的
 *     值是多少；只有当右边列的值相同时，才根据左边列的顺序来（左边列先前已经排好序了）。
 */

/**
 * 对字符串数组执行升序排序
 * 要求所有字符串元素等宽
 * 为方便起见，此处再限定字符串只能由 0 - 9 的数字组成（对于字母也可以将其转成 ASCII 码形式）
 * 
 * @param arr 待排序数组
 * @param max 每列中元素值上限
 */
function radixSort(arr: string[], max: number) {
    if (max < 0) {
        throw new Error('invalid max value')
    }

    if (arr.length < 2) {
        return
    }

    const colWidth = arr[0].length

    // 从右到左逐列执行计数排序
    for (let i = colWidth - 1; i >= 0; i--) {
        countSort(arr, i, max)
    }
}

/**
 * 计数排序
 * 计数排序的详细介绍参见 count-sort.ts
 * 
 * @param arr - 待排序数组
 * @param idx - 对元素中的第 idx 列执行排序
 * @param max 列元素最大值
 */
function countSort(arr: string[], idx: number, max: number) {
    // 用来计数的数组
    const C: number[] = new Array(max + 1).fill(0)
    // 保存排序后的数据
    const sorted: string[] = new Array(arr.length)

    // 第一步，遍历 arr，算出每个元素出现的次数
    for (const val of arr) {
        C[Number(val[idx])] += 1
    }

    // 第二步，累加 C 中元素，让 C[i] 表示 A 中小于等于 i 的元素数量
    C.reduce((prevVal: number, _: number, currIndex: number) => {
        return C[currIndex] += prevVal
    }, 0)

    // 第三步，从右向左遍历 arr，将元素放到合适的位置
    let val: number
    for (let i = arr.length - 1; i >= 0; i--) {
        // 第 i 个元素的第 idx 列的值，转成 number
        val = Number(arr[i][idx])
        sorted[C[val] - 1] = arr[i]
        C[val]--
    }

    // 将 sorted 值复制到 arr 中
    arr.splice(0, arr.length, ...sorted)
}

export { radixSort }