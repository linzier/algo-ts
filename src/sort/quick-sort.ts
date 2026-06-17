/**
 * Quick Sort
 * In-place sort. Time complexity: O(n*lgn)
 *
 * Approach:
 * Let array A = [a1, a2, ... an],
 * Randomly pick one element x, then split A in two into L = [a1', a2', .., ak'], R = [b1', b2', .., bm'],
 * Elements in L are all less than or equal to x, elements in R are all greater than x, so A = [...L, x, ...R].
 * Then recursively perform the above process on L and R.
 * When recursion ends, all elements are already sorted
 */
function quickSort(arr: number[]) {
    innerQuickSort(arr, 0, arr.length - 1)
}

/**
 * This function can perform quicksort on arr[start:end] subarray
 */
function innerQuickSort(arr: number[], start: number, end: number) {
    // When only one (or empty) remains, no need to sort
    if (start >= end) {
        return
    }

    const mid = partition(arr, start, end)

    // Then perform quicksort on the subarrays to the left and right of mid respectively
    innerQuickSort(arr, start, mid - 1)
    innerQuickSort(arr, mid + 1, end)
}

/**
 * Perform partition on subarray arr[start:end]:
 *  Randomly pick one element x in [start, end], then through swapping elements,
 *  make elements to the left of x all less than or equal to x, and to the right all greater than x
 * @returns The new position j of x after partition
 */
function partition(arr: number[], start: number, end: number): number {
    // Randomly pick one element from arr
    const index = start + Math.floor(Math.random() * (end - start))
    const ele = arr[index]

    /**
     * We try to put elements less than or equal to ele to the left, and greater ones to the right
     * So we define two cursors: elements to the left of the left cursor are all less than or equal to ele;
     * elements to the right of the right cursor are all greater than ele
     */

    // To satisfy the left and right definitions, first temporarily put ele at the end of the array
    // (i.e., swap position with last element. Prevent ele's position from not satisfying requirements)
    let tmp = arr[end]
    arr[end] = ele
    arr[index] = tmp

    let left = start
    let right = end - 1

    // Left and right can have at most one move in one loop iteration, ensuring left > right won't happen
    while (left < right) {
        if (arr[left] <= ele) {
            // Current position's value satisfies condition, left pointer directly moves forward
            left++
            continue
        }

        if (arr[right] > ele) {
            // Right position's value satisfies condition, right pointer directly moves backward
            right--
            continue
        }

        // Reaching here means left and right positions' values should be swapped
        tmp = arr[left]
        arr[left] = arr[right]
        arr[right] = tmp
    }

    // At this point, left and right overlap
    // If left position's value is greater than ele, swap with ele, otherwise swap with right + 1 position's value
    // Because right starts moving from end - 1, right + 1 won't go out of bounds (at most the last element, which is ele itself)
    const idx = arr[left] > ele ? left : right + 1
    tmp = arr[idx]
    arr[idx] = ele
    arr[end] = tmp

    return idx
}

export { quickSort, partition }