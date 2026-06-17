/**
 * Merge Sort
 * Merge Sort adopts the divide and conquer idea, dividing the entire problem into several subproblems
 * (subproblems and parent problem have similar properties), recursively solving subproblems, then merging
 * subproblem solutions to get the entire problem's solution.
 * Time complexity: O(n*lgn)
 * Merge Sort is not in-place sort, needs extra memory space to perform merge operations
 *
 * Principle:
 *  1. Let array to sort A = [a1, a2, ... an];
 *  2. We split array A in two, getting L = A[0:n/2] and R = A[n/2+1:len-1] two subarrays (divide);
 *  3. Perform sorting on L and R these two subarrays respectively (solve);
 *  4. Merge the already sorted L and R to get the final result (merge);
 *  Among them, step 3 is a recursive process. Sorting L and R similarly goes through steps 2, 3, 4.
 *  The termination condition of this recursion is when the split subarray has at most one element,
 *  for an array with one element (or empty), no sorting is needed.
 *
 * Example:
 *  Array to sort A = [3, 1, 2, 5, 4];
 *  Split A in two to get L = [3, 1], R = [2, 5, 4] two subarrays;
 *  Continue splitting L and R in two. Taking L as example:
 *      L -> L1 = [3], L2 = [1];
 *  L1 and L2 each have only one element, no need for further recursive splitting;
 *  Merge L1 and L2 to get sorted L' = [1, 3];
 *  Subarray R follows the same approach, finally getting sorted R' = [2, 4, 5];
 *  Continue merging L' and R' upward to get the entirely sorted array A' = [1, 2, 3, 4, 5];
 *
 *  From this example we can see: the key is how to perform merge operations on L' and R' so that
 *  the merged array remains sorted.
 *
 * @todo Optimization: due to constant factor impact, with small data, Insertion Sort performs better than
 * Merge Sort, so when subarray element count is less than a threshold, stop recursion and switch to
 * Insertion Sort, reducing Merge Sort's recursion count
 */

/**
 * Perform Merge Sort on number type array
 * @param arr Array to sort
 */
function mergeSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    // Because we need to continuously perform recursive operations on subarrays, we define an internal function
    // to handle recursion
    innerSort(arr, 0, arr.length - 1)
}

/**
 * This internal function can perform Merge Sort on subarray arr[start:end]
 * @param arr Array to sort
 * @param start Subarray start position
 * @param end Subarray end position
 */
function innerSort(arr: number[], start: number, end: number) {
    if (start >= end) {
        // Subarray only has one element (or no element), end processing
        return
    }

    // Get midpoint
    const mid = start + Math.floor((end - start) / 2)

    // Sort left subarray (including mid itself)
    innerSort(arr, start, mid)
    // Sort right subarray
    innerSort(arr, mid + 1, end)

    // Merge the two already sorted left and right subarrays
    merge(arr, start, mid, end)
}

/**
 * This function can merge two already sorted subarrays arr[left:mid] and arr[mid+1:right],
 * the merged array arr[left:right] still maintains sorted order
 * Merge logic:
 *  1. For two subarrays: L = [a1, a2, ... an], R = [b1, b2, ... bm]
 *  2. Compare the leftmost elements (a and b) of L and R, pop the smaller one from its subarray and push into new array A;
 *  3. Continue doing step 2's operation, until one or both subarrays become empty;
 *  4. Once one subarray becomes empty, directly append the remaining elements from the other subarray to new array A;
 *  Since steps 2, 3 are continuously comparing values in the two arrays, getting the smaller one and pushing into
 *  the new array, the final new array A is still sorted.
 *  Operation steps (length of A): L.length + R.length (each time either get one from L or get one from R)
 *
 * Sentinel: From step 4 we know, each time we must check if a subarray is empty, and if empty we can only operate
 * on the other array. We can add an extremely large value (e.g., positive infinity) as sentinel to the end of each
 * subarray. Since normal values in the array are certainly all less than the sentinel, it can prevent the array from
 * becoming empty, thereby avoiding the empty check step. Only need L.length + R.length steps before returning.
 *
 * @param arr Array to process
 * @param left Left boundary
 * @param mid Middle boundary
 * @param right Right boundary
 */
function merge(arr: number[], left: number, mid: number, right: number) {
    // Create copies of left and right subarrays
    const larr = arr.slice(left, mid + 1)
    const rarr = arr.slice(mid + 1, right + 1)

    // Add sentinels
    larr.push(Infinity)
    rarr.push(Infinity)

    // Execute L.length + R.length times (from left to right, sequentially set arr's element values)
    for (let i = left; i <= right; i++) {
        arr[i] = (larr[0] > rarr[0] ? rarr.shift() : larr.shift()) as number
    }
}

export { mergeSort }