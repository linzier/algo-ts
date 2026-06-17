/**
 * Selection Sort
 * Selection Sort is an in-place sort with time complexity O(n^2).
 *
 * Principle:
 *  1. For array to sort A = [a1, a2, ... an];
 *  2. First, select the minimum from A[0:n-1] and swap it with A[0] (place the minimum of the entire array at A[0]);
 *  3. Then select the minimum from the remaining A[1:n-1] and swap it with A[1]. At this point, A[0] and A[1] hold the smallest and second smallest elements respectively;
 *  4. Then select the minimum from the remaining A[2:n-1] and swap it with A[2];
 *  5. And so on...
 *  We observe that when processing subarray A[i:n-1], A[0:i-1] is already sorted, so when we reach A[n-1], the entire array is sorted.
 *
 * Example:
 *  Array to sort: A=[3, 1, 2, 5, 4].
 *  First, find the minimum of the entire array and swap with A[0]: [1, 3, 2, 5, 4]
 *  Then find the minimum from [3, 2, 5, 4] and swap with A[1]: [1, 2, 3, 5, 4]
 *  Then find the minimum from [3, 5, 4] and swap with A[2]: [1, 2, 3, 5, 4]
 *  Then find the minimum from [5, 4] and swap with A[3]: [1, 2, 3, 4, 5]
 *  Only the last element [5] remains, which is certainly the maximum — no processing needed.
 */

/**
 * Perform Selection Sort (ascending order) on a number array
 * @param arr Array to sort
 */
function selectSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    const len = arr.length
    let min: number
    let minIdx: number
    let tmp: number

    // Only need n-1 passes, because on the nth pass only one element remains which is certainly the maximum — no swap needed
    for (let i = 0; i < len - 1; i++) {
        // Traverse subarray arr[i:len-1], find the minimum element position
        min = arr[i]
        minIdx = i
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < min) {
                min = arr[j]
                minIdx = j
            }
        }

        // Swap
        if (minIdx != i) {
            tmp = arr[i]
            arr[i] = arr[minIdx]
            arr[minIdx] = tmp
        }
    }
}

export { selectSort }
