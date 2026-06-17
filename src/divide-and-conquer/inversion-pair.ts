/**
 * Inversion Pairs
 * Definition: Given an array A = [a1, a2, ... an] with n distinct numbers, if i<j and A[i]>A[j], then the pair (i,j) is called an inversion pair of A.
 * For example, array A = [1, 4, 3, 2] has three inversion pairs: (4,3), (4,2), (3,2).
 *
 * Solving for the number of inversion pairs:
 *  Can use two-level loops for brute force solving, with time complexity O(n^2).
 *  Here we use the Merge Sort process to calculate the number of inversion pairs, with time complexity O(n*lgn).
 *  Merge Sort divides array A into two sorted left and right subarrays: L' = A[0:mid], R' = [mid+1:len-1]. Since L' and R' are already sorted,
 *  the number of inversion pairs within each of them is 0, so the number of inversion pairs in L'+R' is actually the number of inversion pairs
 *  between left subarray L' and right subarray R' (let's call it z).
 *  Additionally, we assume that before sorting, the number of inversion pairs within L' and R' are x and y respectively, so the total number
 *  of inversion pairs in the entire array A is z + x + y.
 *
 *  For example:
 *      A = [3, 7, 1, 2, 6, 4]
 *  Partition into two subarrays: L = [3, 7, 1], R = [2, 6, 4]. We assume L has x inversion pairs and R has y inversion pairs (we'll figure out how to calculate them later);
 *  Then we perform Merge Sort on L and R respectively to get sorted L' = [1, 3, 7], R' = [2, 4, 6];
 *  Now, if we can calculate the number of inversion pairs z between L'+R' (i.e., array [1, 3, 7, 2, 4, 6]), then adding the inversion pairs x and y
 *  within L and R gives us the total inversion pairs of the original array A.
 *
 *      (
 *  The key question here is why the number of inversion pairs in A equals z + x + y.
 *  No matter how we move elements within L and R, it won't cause elements to swap between L and R. No matter how elements in L move,
 *  their new indices are still less than any element in R.
 *  That is, if some element in L forms an inversion pair with an element in R before sorting, it will still form an inversion pair with that element
 *  in R after L is sorted.
 *  For example, the 3 in L forms an inversion pair (3,2) with an element in R before sorting L; after L is sorted, it's still the inversion pair (3,2).
 *  Therefore, the number of inversion pairs formed by the element 3 in A equals the number formed within L (1) plus the number formed with R (1), totaling 2.
 *  The same logic applies to other elements.
 *  Therefore, the number of inversion pairs in A equals the number of inversion pairs x in L plus the number of inversion pairs y in R,
 *  plus the number of inversion pairs z formed between elements in L and elements in R.
 *  So we first set aside solving for the inversion pairs within L and R (let them be x, y), and first solve for the number z between L and R.
 *  If we can indeed calculate z, then we can recursively calculate x and y.
 *      )
 *
 *      So now the focus is on how to calculate the number of inversion pairs between L' = [1, 3, 7] and R' = [2, 4, 6]:
 *      1. We first compare L'[0] with R'[0], 1 is less than 2, so 1 must be less than all elements after R'[0] (since it's in ascending order),
 *         so L'[0] and R' form 0 inversion pairs;
 *      2. Remove 1 from L' (or use a cursor, move the cursor forward one position);
 *      3. Then compare L'[1] with R'[0], 3 is greater than 2, so all elements after L'[1] must be greater than 2, so all elements in L' and R'[0]
 *         form 2 inversion pairs (L'[1] and the elements after it);
 *      4. Remove 2 from R';
 *      5. Then compare L'[1] with R'[1], 3 is less than 4, same as step 1, get 0 inversion pairs;
 *      6. Remove 3 from L';
 *      7. Then compare L'[2] with R'[1], 7 is greater than 4, get 1 inversion pair;
 *      8. Remove 4 from R';
 *      9. Then compare L'[2] with R'[2], 7 is greater than 6, get 1 inversion pair;
 *      10. Remove 6 from R';
 *      11. Now R' is empty, end matching, final inversion pair count is 4;
 *      Throughout the entire process, each step removes one element from either L' or R' (or equivalently, advances the cursor of L' or R' by one position),
 *      until one of them is empty, so at most L'.length+R'.length steps are needed.
 *  Comparing with the merge logic of Merge Sort, we find the above entire logic is extremely similar to the merge process, with the differences being:
 *  (1) Once any subarray becomes empty, we stop calculating;
 *  (2) If the left element is greater than the right one, on top of the merge logic, we add logic to calculate inversion pairs;
 */

/**
 * Calculate the number of inversion pairs in array arr
 * Implemented based on Merge Sort
 */
function inversionPair(arr: number[]): number {
    if (arr.length < 2) {
        return 0
    }

    return innerInversion(arr, 0, arr.length - 1)
}

/**
 * This internal function can perform Merge Sort on subarray arr[start:end] and calculate the number of inversion pairs
 * @param arr Array to process
 * @param start Subarray start position
 * @param end Subarray end position
 */
function innerInversion(arr: number[], start: number, end: number): number {
    if (start >= end) {
        // Subarray only has one element (or no element), end process
        return 0
    }

    // Get midpoint
    const mid = start + Math.floor((end - start) / 2)

    // Sort left subarray (including mid itself)
    const lCnt = innerInversion(arr, start, mid)
    // Sort right subarray
    const rCnt = innerInversion(arr, mid + 1, end)

    // Merge the two already sorted left and right subarrays
    return lCnt + rCnt + merge(arr, start, mid, end)
}

/**
 * This function can merge two already sorted subarrays arr[left:mid] and arr[mid+1:right], the merged array arr[left:right] still maintains sorted order
 * Meanwhile returns the number of inversion pairs between the two subarrays
 *
 * Merge logic:
 *  1. For two subarrays: L = [a1, a2, ... an], R = [b1, b2, ... bm]
 *  2. Compare the leftmost elements (a and b) of L and R, pop the smaller one from its subarray and push it into new array A;
 *  3. Continue doing step 2's operation, until one or both subarrays become empty;
 *  4. Once one subarray becomes empty, then directly append the remaining elements from the other subarray to new array A;
 *  Since steps 2, 3 are continuously comparing values in the two arrays, getting the smaller one and pushing it into the new array,
 *  the final new array A is still sorted.
 *  Operation steps (length of A): L.length + R.length (each time either get one from L or get one from R)
 *
 * @param arr Array to process
 * @param left Left boundary
 * @param mid Middle boundary
 * @param right Right boundary
 */
function merge(arr: number[], left: number, mid: number, right: number): number {
    // Create copies of left and right subarrays
    const larr = arr.slice(left, mid + 1)
    const rarr = arr.slice(mid + 1, right + 1)

    // Execute L.length + R.length times (from left to right, sequentially set arr's element values)
    let pair = 0
    for (let i = left; i <= right; i++) {
        // One array is empty (impossible for both to be empty simultaneously)
        if (!larr.length) {
            arr[i] = rarr.shift() as number
            continue
        } else if (!rarr.length) {
            arr[i] = larr.shift() as number
            continue
        }

        // Both left and right arrays are not empty
        if (larr[0] > rarr[0]) {
            pair += larr.length
            arr[i] = rarr.shift() as number
        } else {
            arr[i] = larr.shift() as number
        }
    }

    return pair
}

export { inversionPair }