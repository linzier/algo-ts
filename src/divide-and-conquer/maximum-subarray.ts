/**
 * Maximum Subarray (also known as Maximum Subarray Sum)
 * Divide and Conquer solution, time complexity: O(n*lgn)
 *
 * Problem description:
 * Given an integer array A, find a contiguous subarray with the maximum sum (subarray must contain at least one element), and return its maximum sum.
 * For example: A = [-2, 1, -3, 4, -1, 2, 1, -5, 4], maximum subarray is [4, -1, 2, 1], sum is 6.
 *
 * The most straightforward solution to this problem is brute force, with time complexity O(n^2).
 *
 * Divide and conquer strategy solution approach:
 *  Divide and conquer has three steps: divide, solve, merge.
 *  Divide: Divide the problem into subproblems with similar properties but smaller scale (generally divide into two), in this example divide the entire
 *       array from the middle into two subarrays: L = [-2, 1, -3, 4, -1], R = [2, 1, -5, 4];
 *  Solve: Since subarrays and the parent array have similar properties, we can recursively solve for the solutions of subarrays L and R
 *       (first assume they are subL and subR respectively);
 *  Merge: After calculating the maximum subarrays of L and R, we examine the maximum subarray of A, which must be one of three cases:
 *  1. Either it is subL (i.e., A's maximum subarray is within L);
 *  2. Or it is subR (i.e., A's maximum subarray is within R);
 *  3. Or it spans both L and R (i.e., crossing L and R, containing at least the two elements -1 and 2);
 *  The key then is to solve the maximum subarray in case 3, then compare all three and get the maximum.
 *  For case 3, since the maximum subarray must include L's right boundary and R's left boundary, we traverse from L's right boundary (-1)
 *       and R's left boundary (2) towards both sides respectively to obtain the result, with time complexity O(n).
 *
 * @see maximum-subarray2.ts for the Dynamic Programming implementation with O(n) complexity
 */

/**
 * Define maximum subarray information structure: start/end positions and sum
 * If it's an empty array, then start and end are both -1
 */
interface MaxSubInfo {
    start: number;
    end: number;
    sum: number;
}

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

    return findMaxSubarray(arr, 0, arr.length - 1)
}

/**
 * This function can solve the maximum subarray (maximum subarray sum) of subarray arr[start:end]
 */
function findMaxSubarray(arr: number[], start: number, end: number): MaxSubInfo {
    if (start == end) {
        // Subarray only has one element, terminate recursion
        return { start, end, sum: arr[start] }
    }

    // When there is more than one element, split arr in two, recursively solve the maximum subarray of left and right arrays respectively
    const mid = start + Math.floor((end - start) / 2)
    const subL = findMaxSubarray(arr, start, mid)
    const subR = findMaxSubarray(arr, mid + 1, end)

    // Solve the maximum subarray crossing both left and right arrays
    const subM = findCrossMaxSubarray(arr, start, mid, end)

    // Get the maximum from subL, subR, subM and return
    if (subL.sum >= subR.sum && subL.sum >= subM.sum) {
        return subL
    } else if (subR.sum >= subL.sum && subR.sum >= subM.sum) {
        return subR
    } else {
        return subM
    }
}

/**
 * Find the maximum subarray crossing both L = arr[start:mid] and R = arr[mid+1:end]
 * Note: this maximum subarray must occupy at least one element in each of L and R (otherwise it would become entirely in L or entirely in R,
 * which wouldn't satisfy the “crossing” condition)
 */
function findCrossMaxSubarray(arr: number[], start: number, mid: number, end: number): MaxSubInfo {
    // Solve left side
    // Maximum subarray left index
    let maxLeftIdx = 0
    // Maximum subarray sum, initialized to negative infinity
    let maxLeftSum = -Infinity
    // Sum of all elements on the left side
    let leftSum = 0

    // Scan sequentially from mid to start
    for (let i = mid; i >= start; i--) {
        leftSum += arr[i]
        if (leftSum > maxLeftSum) {
            maxLeftIdx = i
            maxLeftSum = leftSum
        }
    }

    // Solve right side
    let maxRightIdx = 0
    let maxRightSum = -Infinity
    let rightSum = 0

    for (let i = mid + 1; i <= end; i++) {
        rightSum += arr[i]
        if (rightSum > maxRightSum) {
            maxRightIdx = i
            maxRightSum = rightSum
        }
    }

    return { start: maxLeftIdx, end: maxRightIdx, sum: maxLeftSum + maxRightSum }
}

export { maxSubarray, MaxSubInfo }