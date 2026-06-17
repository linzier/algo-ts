/**
 * Bucket Sort
 * Time complexity: O(n)
 *
 * Let array to sort A = [a1, a2, ..., an], its elements are uniformly distributed in [0..1).
 * The idea of Bucket Sort is: we create an array B(n) as n "buckets", distribute elements from A evenly
 * into these buckets. Since buckets are sorted (according to B's index), we only need to perform Insertion Sort
 * on elements within each bucket to complete sorting the entire array A.
 *
 * Insertion Sort's time complexity is O(n^2), but since (uniformly distributed) elements in A are evenly
 * distributed into n buckets, the expected element count in each bucket is very small, so the expected cost
 * of Insertion Sort in each bucket is constant, making the total Bucket Sort time complexity O(n).
 *
 * How to implement buckets:
 * Elements in B are of Linked List type, linking elements in each bucket together in order.
 *
 * How to distribute elements into buckets:
 * Based on j = Math.floor(A[i] * n) distribute element into bucket j.
 * Since A[i] is in [0..1), A[i] * n is certainly less than n.
 */

import { insertSort } from './insert-sort'

/**
 * Perform Bucket Sort on number array. Array elements must be numbers in [0..1)
 * @param arr Array to sort
 */
function bucketSort(arr: number[]) {
    if (arr.length < 2) {
        return
    }

    // Create an array to store n buckets
    // Generally buckets are implemented through Linked Lists, but since JS arrays can freely expand
    // and element count in buckets won't be too large, we directly use JS arrays to implement buckets
    const B: number[][] = []

    // Put elements from arr into buckets
    const len = arr.length
    for (const val of arr) {
        // Calculate bucket index
        const bIndex = Math.floor(val * len)
        B[bIndex] === undefined && (B[bIndex] = [])

        // Insert into bucket
        insertToBucket(B[bIndex], val)
    }

    // Already sorted, copy to arr
    let i = 0
    for (const bucket of B) {
        if (bucket === undefined) {
            continue
        }

        arr.splice(i, bucket.length, ...bucket)
        i += bucket.length
    }
}

/**
 * Insert element val into bucket and perform sorting
 */
function insertToBucket(bucket: number[], val: number) {
    bucket.push(val)
    // Perform Insertion Sort
    insertSort(bucket)
}

export { bucketSort }