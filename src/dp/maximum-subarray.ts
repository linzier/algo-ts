/**
 * Maximum Subarray (also known as Maximum Subarray Sum)
 * Dynamic programming algorithm. Time complexity: O(n)
 *
 * Problem description:
 * Given an integer array A, find a contiguous subarray with the maximum sum (subarray must contain at least one element), and return its maximum sum.
 * For example: A = [-2, 1, -3, 4, -1, 2, 1, -5, 4], maximum subarray is [4, -1, 2, 1], sum is 6.
 *
 * Solution approach:
 *  1. For array A = [a1, a2, ... an], let its maximum subarray be S = A[i:j],
 *  we focus our attention on the subarray's right boundary j.
 *  S is also the “maximum subarray with j as right boundary” in array A.
 *  2. Next we think in a dynamic programming way, to see if S can be solved through its predecessor
 *     (i.e., the “maximum subarray with j-1 as right boundary”):
 *     Suppose we know the maximum subarray in A “with j-1 as right boundary” is S' (let it be A[k:j-1]),
 *     can we derive S through S' and A[j]?
 *  Yes, there are two cases as follows:
 *       1. If sum(S') + A[j] > A[j], then adding A[j] to S' gives us S (at this point S = A[k:j]);
 *  2. Otherwise, A[j] alone constitutes S (at this point S = A[j:j]);
 *  In summary, S = max(S'+A[j], A[j]).
 *  3. Since we can solve j through j-1, and the initial value is also easy to obtain (A[0:0]'s maximum subarray is itself),
 *     we can then use dynamic programming to solve for S in a “rolling” manner;
 *  4. However there's still one remaining problem: we previously assumed A's maximum subarray is S = A[i:j],
 *     but we don't know exactly what the right boundary j is.
 *  However, since we can derive the solution for j from j-1, we can derive from the initial value (A[0])
 *  the maximum subarrays with 0~n as right boundaries respectively.
 *  Then j must be among 0~n. We just pick the one with the maximum sum.
 *
 * The key here is transforming the concept of “maximum subarray” into “maximum subarray with j as right boundary”
 * (the former is a subset of the latter; after calculating the full set, we can obtain the final solution through comparison).
 */

import { MaxSubInfo } from '../divide-and-conquer/maximum-subarray'

/**
 * Find the maximum subarray of arr, return the corresponding subarray sum and indices
 */
function maxSubarray(arr: number[]): MaxSubInfo {
    if (!arr.length) {
        return { start: -1, end: -1, sum: 0 }
    }

    if (arr.length == 1) {
        return { start: 0, end: 0, sum: arr[0] }
    }

    // dp[i] represents the maximum subarray information in arr with i as right boundary
    const dp: MaxSubInfo[] = []
    // Record the position of the maximum subarray in dp (after dp is fully solved, this position's value is the final solution)
    let maxIndex = 0

    // Initialize first element
    dp[0] = { start: 0, end: 0, sum: arr[0] }

    let prev: MaxSubInfo
    for (let i = 1; i < arr.length; i++) {
        prev = dp[i - 1]

        // Since subarray must have i as right boundary, the choice is whether to include the prev part
        if (prev.sum + arr[i] > arr[i]) {
            // prev's value can make the result larger, so use it
            dp[i] = { start: prev.start, end: i, sum: prev.sum + arr[i] }
        } else {
            // Otherwise, only use arr[i]
            dp[i] = { start: i, end: i, sum: arr[i] }
        }

        // Check if dp[i] is the maximum subarray so far
        if (dp[i].sum > dp[maxIndex].sum) {
            maxIndex = i
        }
    }

    return dp[maxIndex]
}

export { maxSubarray, MaxSubInfo }