interface Value {
    key: number;
    val: unknown;
}

/**
 * 二分搜索
 * @param arr - 待搜索数组，必须是按升序排好序的（根据 Value.key）
 * @param key - 搜索关键字
 * @reutrn 搜索到则返回对应的 Value，否则返回 null
 */
function binSearch(arr: Value[], key: number): Value | null {
    if (arr.length === 0) {
        return null
    }

    // 子数组左右游标
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        // 取中
        const mid = left + Math.floor((right - left) / 2)
        const val = arr[mid]

        if (key === val.key) {
            return val
        }

        // key 小于 val 则在左边找
        if (key < val.key) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return null
}

export { binSearch }