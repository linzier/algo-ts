/**
 * Counting Sort
 * Applicable scenario: for array A = [a1, a2, ..., an], if all elements in A are integers between 0 ~ k,
 * then Counting Sort can be used.
 * When integer k is not very large (e.g., age), Counting Sort is particularly effective.
 * Time complexity: O(n).
 *
 * Idea:
 * The key of Counting Sort is the "counting" idea.
 * Since the element value range in A is all between 0 ~ k, we create an array C(k), then all elements in A
 * can correspond to some index in C.
 * Now think: for some element x in A, what position should it be at after sorting?
 * After sorting, all elements before x are smaller than x (let's not consider equal cases for now).
 * That is, if A has m elements smaller than x, then after sorting x = A[m].
 * Then consider: assume there are l elements with value equal to x, then after sorting x's index j must be
 * in range m <= j < m + l.
 * So, if we let C[a] represent how many elements in A are less than or equal to a, then we can implement
 * sorting through the values of the C array.
 *
 * Example:
 * 1. Let array to sort A = [2, 5, 3, 0, 2, 3, 0, 3], its element value range is 0 ~ 5.
 * 2. Create array C, C.length = 5, all positions initialized to 0. C = [0, 0, 0, 0, 0].
 * 3. Traverse A, each time encountering element x in A, increment C[x] by 1. After traversal, C[x] represents
 *    the number of times x appears in A:
 *    C = [2, 0, 2, 3, 0, 1].
 * 4. The above C shows that in array A, 0 appeared 2 times, 1 appeared 0 times, 2 appeared 2 times,
 *    3 appeared 3 times. Then elements less than or equal to 3 in A appeared a total of
 *    2 + 0 + 2 + 3 = 7 times. That is, adding C[i] and all values before i gives the number of times
 *    values less than or equal to i appear in A:
 *    C after cumulative addition = [2, 2, 4, 7, 7, 8].
 * 5. Now examine the position of the three 3s in A after sorting: they should be between C[2] ~ C[3] - 1.
 *    However there's a problem: we traverse A from left to right, encountering the first 3, put it at position 4
 *    (i.e., C[3-1]), but when encountering the second 3, there must be some record telling us to put it at
 *    position 5 (not 4 or 6).
 *    We can change approach to solve this problem:
 *    Since C[3] represents the number of elements less than or equal to 3 in A, then after we process one 3,
 *    the number of elements less than or equal to 3 in A decreases by 1, correspondingly we also decrease C[3]'s
 *    value by 1, implementing position migration this way.
 *    Specifically, instead of placing element 3 from left to right, we do the reverse: first place 3 at
 *    A[C[3] - 1] (right boundary); when placing the second 3, C[3]'s value has already decreased by 1,
 *    so we can still directly place it at A[C[3] - 1] (i.e., to the left of the first 3).
 *    That is, we can directly use C[a] to determine the sorted position of all elements a in A.
 *    Still has a problem:
 *    We traverse A from left to right, but place from right to left. That is, for two elements 3, their relative
 *    positions change before and after sorting. So we should traverse A from right to left instead.
 *    (In this example because there's no satellite data, this change doesn't matter, but in practice satellite
 *    data generally exists, so sorting stability is important.)
 * 6. Based on 5's analysis, perform sorting on data (actual sorting needs an extra array B to store sorted data).
 *  (1) Process A[7] = 3, based on C[3] = 7, put into B[6]; C[3] decreases by 1:
 *        B = [null, null, null, null, null, null, 3, null],
 *        C = [2, 2, 4, 6, 7, 8].
 *  (2) Process A[6] = 0, based on C[0] = 2, put into B[1]; C[0] decreases by 1:
 *        B = [null, 0, null, null, null, null, 3, null],
 *        C = [1, 2, 4, 6, 7, 8].
 *  (3) Process A[5] = 3, based on C[3] = 6, put into B[5]; C[3] decreases by 1:
 *        B = [null, 0, null, null, null, 3, 3, null],
 *        C = [1, 2, 4, 5, 7, 8].
 *  Process in order, finally get B = [0, 0, 2, 2, 3, 3, 3, 5].
 */

/**
 * Counting Sort
 * @param arr Array to sort, element values must be between 0 ~ max
 * @param max Maximum element value in arr
 */
function countSort(arr: number[], max: number) {
    if (max < 0) {
        throw new Error('invalid max value')
    }

    if (arr.length < 2) {
        return
    }

    // Array used for counting
    const C: number[] = new Array(max + 1).fill(0)
    // Store sorted data
    const sorted: number[] = new Array(arr.length)

    // Step 1: traverse arr, calculate the count of each element
    for (const val of arr) {
        C[val] += 1
    }

    // Step 2: accumulate elements in C, let C[i] represent the count of elements less than or equal to i in A
    C.reduce((prevVal: number, _: number, currIndex: number) => {
        return C[currIndex] += prevVal
    }, 0)

    // Step 3: traverse arr from right to left, put elements to appropriate positions
    for (let i = arr.length - 1; i >= 0; i--) {
        sorted[C[arr[i]] - 1] = arr[i]
        C[arr[i]]--
    }

    // Copy sorted values to arr
    arr.splice(0, arr.length, ...sorted)
}

export { countSort }