interface Value {
    key: number;
    val: unknown;
}

/**
 * Binary search
 * @param arr - Array to search, must be sorted in ascending order (by Value.key)
 * @param key - Search key
 * @reutrn Returns the corresponding Value if found, otherwise null
 */
function binSearch(arr: Value[], key: number): Value | null {
    if (arr.length === 0) {
        return null
    }

    // Left and right cursors of subarray
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        // Get midpoint
        const mid = left + Math.floor((right - left) / 2)
        const val = arr[mid]

        if (key === val.key) {
            return val
        }

        // If key < val, search on the left
        if (key < val.key) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return null
}

export { binSearch }