/**
 * 计数排序
 * 应用场景：对于数组 A = [a1, a2, ..., an]，如果 A 中所有元素都是 0 ~ k 之间的整数，那么就可以用计数排序。
 * 当整数 k 不是很大时（如年龄），计数排序尤其有效。
 * 时间复杂度：O(n)。
 * 
 * 思想：
 * 计数排序关键是“计数”的思想。
 * 既然 A 中元素值范围都在 0 ~ k 之间，我们创建一个数组 C(k)，那么 A 中的所有元素都可以对应到 C 中的某个下标（索引）。
 * 现在思考：A 中的某个元素 x，排序后应该在什么位置？
 * 排序后，x 前面的元素都比 x 小（先不考虑相等的情况），也就是说，假如 A 中有 m 个元素比 x 小，那么排序后 x = A[m]。
 * 再考虑假设有 l 个元素值等于 x，那么排序后 x 的索引 j 一定在 m <= j < m + l。
 * 那么，如果让 C[a] 表示 A 中有多少个元素小于等于 a，那么原则上我们可以通过 C 数组的值来实现排序。
 * 
 * 例：
 * 1. 设待排序数组 A = [2, 5, 3, 0, 2, 3, 0, 3]，其中元素值的范围为 0 ~ 5。
 * 2. 创建数组 C, C.length = 5，且所有位置初始化为 0。C = [0, 0, 0, 0, 0]。
 * 3. 遍历 A，每遇到 A 中元素 x，将 C[x] 加 1。遍历完成后，C[x] 表示 x 在 A 中出现的次数：
 *    C = [2, 0, 2, 3, 0, 1]。
 * 4. 上面 C 表示 A 数组中的 0 出现了 2 次，1 出现了 0 次，2 出现了 2 次，3 出现了 3 次，那么 A 中小于等于 3 的元素一共
 *    出现了 2 + 0 + 2 + 3 = 7 次。也就是说，将 C[i] 以及 i 前面所有的值相加，就是小于等于 i 的值在 A 中出现的次数：
 *    累加后的 C = [2, 2, 4, 7, 7, 8]。
 * 5. 现在考察 A 中的三个 3 排序后的位置：它们应该在 C[2] ~ C[3] - 1 之间。
 *    不过有个问题：我们从左到右遍历 A，遇到第一个 3，放到位置 4（即 C[3-1]），但遇到第二个 3 时，必须要有某个记录告诉我们要放到位
 *    置 5（而不是 4 或者 6）。
 *    我们可以换个思路解决此问题：
 *       既然 C[3] 表示 A 中小于等于 3 的元素数量，那么当我们处理掉一个 3 后，A 中小于等于 3 的元素数量就会减 1，对应地我们将 C[3]
 *       的值也减 1，这样就实现了位置迁移。
 *       具体地，我们不再从左向右放置元素 3，而是反过来，第一个 3 放在 A[C[3] - 1]（右边界）处；当放置第二个 3 的时候，C[3] 的值已经
 *       递减了 1，所以依然可以直接放在 A[C[3] - 1] 处（即靠着第一个 3 的左边）。
 *       也就是说，我们可以直接用 C[a] 来确定 A 中所有元素 a 排序后的位置。
 *       还有个问题：
 *       我们对 A 执行的是从左到右的遍历，而放置的时候却是从右到左放置的，也就是说，对于两个元素 3，排序前后其位置变了。为此，我们对 A 的遍历
 *       也自右向左进行即可。
 *       （本例中因为没有卫星数据，这种变动无关紧要，但实际中一般都存在卫星数据，所以排序的稳定性很重要。）
 * 6. 根据 5 的分析，对数据执行排序（实际排序时需要一个额外数组 B 存放排序后的数据）。
 *    (1) 处理 A[7] = 3，根据 C[3] = 7，放入 B[6]；C[3] 减 1:
 *        B = [null, null, null, null, null, null, 3, null],
 *        C = [2, 2, 4, 6, 7, 8]。
 *    (2) 处理 A[6] = 0，根据 C[0] = 2，放入 B[1]；C[0] 减 1:
 *        B = [null, 0, null, null, null, null, 3, null],
 *        C = [1, 2, 4, 6, 7, 8]。
 *    (3) 处理 A[5] = 3，根据 C[3] = 6，放入 B[5]；C[3] 减 1:
 *        B = [null, 0, null, null, null, 3, 3, null],
 *        C = [1, 2, 4, 5, 7, 8]。
 *    依次处理，最终得到 B = [0, 0, 2, 2, 3, 3, 3, 5]。
 */

/**
 * 计数排序
 * @param arr 待排序数组，数组中元素大小必须是 0 ~ max
 * @param max arr 中元素最大值
 */
function countSort(arr: number[], max: number) {
    if (max < 0) {
        throw new Error('invalid max value')
    }

    if (arr.length < 2) {
        return
    }

    // 用来计数的数组
    const C: number[] = new Array(max + 1).fill(0)
    // 保存排序后的数据
    const sorted: number[] = new Array(arr.length)

    // 第一步，遍历 arr，算出每个元素出现的次数
    for (const val of arr) {
        C[val] += 1
    }

    // 第二步，累加 C 中元素，让 C[i] 表示 A 中小于等于 i 的元素数量
    C.reduce((prevVal: number, _: number, currIndex: number) => {
        return C[currIndex] += prevVal
    }, 0)

    // 第三步，从右向左遍历 arr，将元素放到合适的位置
    for (let i = arr.length - 1; i >= 0; i--) {
        sorted[C[arr[i]] - 1] = arr[i]
        C[arr[i]]--
    }

    // 将 sorted 值复制到 arr 中
    arr.splice(0, arr.length, ...sorted)
}

export { countSort }