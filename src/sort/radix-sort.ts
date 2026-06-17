/**
 * Radix Sort
 * Time complexity: O(n).
 *
 * Given a phone number array A = ['13909898741', '15809837812', '13098192837', ...]
 * How to sort it?
 * Besides using comparison-based sort algorithms (insertion, merge, quick sort, etc.), we can also adopt the following approach:
 * A(n) = [
 *      '13909898741',
 *      '15809837812',
 *      '13098192837',
 *      ...
 * ]
 * All elements here have the same width (11 digits), and each digit has a value range of 0-9.
 * We can sort from right to left (low digit to high digit), processing one column at a time and adjusting element positions based on sort results.
 * When the last column (leftmost) sort is complete, the entire array is sorted.
 *
 * Example:
 * Array A = ['427', '169', '702', '239', '233']
 * Each element has width 3, and each digit ranges from 0 to 9.
 * 1. Sort by leftmost digit: ['702', '233', '427', '169', '239']
 * 2. Based on step 1, sort by middle digit: ['702', '427', '233', '239', '169']
 * 3. Based on step 2, sort by rightmost digit: ['169', '233', '239', '427', '702']
 * This is the final result.
 *
 * Each pass sorts only one column (not the entire element) using a stable sort, then adjusts positions accordingly.
 * From right to left, after each pass the positions are updated based on the latest column sort results.
 * When the leftmost column sort is complete, the array is fully sorted.
 * Column values are generally small — for base 10 it is 0-9, for letters it is a-z and A-Z.
 * These ranges (the radix) allow using counting sort with linear complexity (the column sort must be stable, and counting sort meets this requirement).
 * Therefore Radix Sort time complexity is O(n) (n*d*k where d is element width and k is max column value; both are small constants).
 *
 * Why sort from right to left (not left to right)?
 * Consider array B = [241, 190].
 * If sorting left to right:
 *  1. Sort by leftmost column: B = [190, 241]
 *  2. Then sort by second column. 4 < 9, but can we directly move 241 before 190? No — we would need to reconsider the right columns (already sorted).
 *  If there are many right columns, each would need re-evaluation.
 * Sorting right to left avoids this problem because right columns have greater weight than left columns.
 * When sorting a right column, no need to consider left columns. Larger right column values sort later regardless of left column values.
 * Only when right column values are equal do we rely on left column order (which is already sorted from the previous pass).
 */

/**
 * Perform ascending sort on a string array.
 * Requires all string elements to have equal width.
 * For convenience, strings are limited to digits 0-9 (letters can be converted to ASCII codes).
 *
 * @param arr Array to sort
 * @param max Upper bound of column element values
 */
function radixSort(arr: string[], max: number) {
    if (max < 0) {
        throw new Error('invalid max value')
    }

    if (arr.length < 2) {
        return
    }

    const colWidth = arr[0].length

    // Sort from right to left, column by column using Counting Sort
    for (let i = colWidth - 1; i >= 0; i--) {
        countSort(arr, i, max)
    }
}

/**
 * Counting Sort
 * See count-sort.ts for detailed introduction.
 *
 * @param arr - Array to sort
 * @param idx - Sort by the idx-th column of each element
 * @param max Maximum column element value
 */
function countSort(arr: string[], idx: number, max: number) {
    // Counting array
    const C: number[] = new Array(max + 1).fill(0)
    // Preserve sorted data
    const sorted: string[] = new Array(arr.length)

    // Step 1: traverse arr, count occurrences of each element
    for (const val of arr) {
        C[Number(val[idx])] += 1
    }

    // Step 2: accumulate C, so C[i] represents the count of elements <= i in A
    C.reduce((prevVal: number, _: number, currIndex: number) => {
        return C[currIndex] += prevVal
    }, 0)

    // Step 3: traverse arr from right to left, place elements in correct positions
    let val: number
    for (let i = arr.length - 1; i >= 0; i--) {
        // Value of the idx-th column of the i-th element, converted to number
        val = Number(arr[i][idx])
        sorted[C[val] - 1] = arr[i]
        C[val]--
    }

    // Copy sorted values back to arr
    arr.splice(0, arr.length, ...sorted)
}

export { radixSort }
