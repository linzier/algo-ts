/**
 * Insertion Sort
 * Insertion Sort is an in-place sort (swaps values directly in the original array, no extra memory needed),
 * with time complexity O(n^2)
 *
 * Principle:
 *  1. Let sequence to sort A = [a0, a1, a2, ... an];
 *  2. Process from left to right in order;
 *  3. When processing the i-th element, the elements before it (subarray A[0:i-1]) are already sorted;
 *  4. Then, only need to insert element i after the first element that is less than or equal to it
 *     (for ascending order sort).
 *
 * Example:
 *  Array to sort A = [3, 1, 2, 5, 4].
 *  Start processing from A[1]. 1 is less than 3, need to put 1 before 3, get: [1, 3, 2, 5, 4];
 *  Next process A[2]. 2 is less than 3, greater than 1, need to put between 1 and 3, get: [1, 2, 3, 5, 4];
 *  Next process A[3]. 5 is greater than 3, so no processing needed, get: [1, 2, 3, 5, 4];
 *  Next process A[4]. 4 is less than 5, greater than 3, put between 3 and 5, get: [1, 2, 3, 4, 5];
 *
 * Since when processing the i-th element x, elements before i (A[0:i-1]) are already sorted,
 * then when we insert x into the appropriate position j according to the above rule, we can ensure
 * A[j-1] <= x < A[j+1], therefore after x is inserted, the new array A[0:i] is still sorted.
 */

/**
 * Perform Insertion Sort on number array (ascending order)
 * @param arr Array to sort
 */
function insertSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    // Start from second element (because there are no elements before the first element, no need to compare)
    let curr: number
    for (let i = 1; i < arr.length; i++) {
        // Temporarily store current element
        curr = arr[i]

        // As long as the value at position j is greater than curr, shift it one position back
        let j = i - 1
        while (j >= 0 && arr[j] > curr) {
            arr[j + 1] = arr[j]
            // Continue checking backward
            j -= 1
        }

        // Found the first position less than or equal to curr, insert curr after it (at position j+1)
        // Note: j may be -1, meaning all elements before i are greater than curr, put curr at arr[0]
        arr[j + 1] = curr
    }
}

export { insertSort }