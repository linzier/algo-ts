/**
 * Order Statistics
 * In a distinct array A = [a1, a2, ..., an], the i-th order statistic is the i-th smallest element in the array.
 * Minimum value is the 1st order statistic; maximum value is the n-th order statistic; median is the floor(n/2)-th
 * order statistic.
 *
 * Minimum and maximum values can be obtained with O(n) time complexity (traverse the entire array once).
 * The i-th order statistic can also be obtained in linear time using the quicksort idea.
 *
 * Quicksort implementation approach:
 *  1. For array A = [a1, a2, ..., an], after quicksort's partition finds pivot A[k], elements to the left of k
 *     are all less than A[k], elements to the right of k are all greater than A[k];
 *  2. If k happens to equal i (assume i starts from 0), then A[k] is the i-th smallest element;
 *  3. If k is greater than i, the i-th smallest element is to the left of k, continue quicksort on A[0:k-1];
 *  4. If k is less than i, the i-th smallest element is to the right of k, continue quicksort on A[k+1:n-1];
 *
 * Note: Besides using quicksort to implement order statistics in O(n) complexity, Red-Black Tree can also
 * be used to implement it in O(logn) complexity.
 * @see See data-structure/red-black-tree.ts
 */

import { partition } from './quick-sort'

/**
 * Return the i-th order statistic (i-th smallest value) in array arr
 * For convenience, limit arr elements to be distinct (each not equal to others). For arrays with duplicate elements,
 * deduplicate first.
 * Note: i starts from 1 (maximum value is arr.length), slightly different from the previous analysis.
 * arr cannot be an empty array
 */
function orderStatistic(arr: number[], i: number): number {
    if (i < 1 || i > arr.length) {
        throw new Error('i out of range')
    }

    if (arr.length == 1) {
        return arr[0]
    }

    // If finding maximum or minimum value, use a simple loop traversal, otherwise adopt quicksort idea
    if (i == 1 || i == arr.length) {
        return findMinMax(arr, i == 1)
    }

    return findMinK(arr, 0, arr.length - 1, i - 1)
}

/**
 * Return array minimum/maximum value
 * @param arr
 * @param isMin - Whether to return minimum value; false means return maximum value
 */
function findMinMax(arr: number[], isMin: boolean): number {
    let result = isMin ? Infinity : -Infinity

    for (const ele of arr) {
        if (isMin && ele < result || !isMin && ele > result) {
            result = ele
        }
    }

    return result
}

/**
 * Find the k-th smallest element in subarray arr[start:end] and return it
 * k starts from 0
 * Implemented through Quick Sort idea
 */
function findMinK(arr: number[], start: number, end: number, k: number): number {
    if (start == end) {
        // Only has one element, certainly it
        return arr[start]
    }

    // Perform partition
    const pt = partition(arr, start, end)

    const dist = pt - start
    if (dist == k) {
        // pt is the k-th smallest element of the subarray
        return arr[pt]
    }

    // If not, check which side the k-th smallest element should be on
    if (dist > k) {
        // Should be found on the left
        return findMinK(arr, start, pt - 1, k)
    } else {
        // Found on the right
        // Because k starts from 0, after k - pt the new relative distance still needs to decrease by 1
        return findMinK(arr, pt + 1, end, k - dist - 1)
    }
}

export { orderStatistic }