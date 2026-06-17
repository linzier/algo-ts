/**
 * Number Triangle
 * Given a number triangle as shown below, starting from the top, at each node you can choose to move to the node
 * at its left-below or move to the node at its right-below, keep walking to the bottom level, and find a path
 * that maximizes the sum of numbers on the path.
 * That is, arr[i][j] can only go down to arr[i+1][j] and arr[i+1][j+1].
 * Conversely, arr[i+1][j] can only be reached from arr[i][j - 1] and arr[i][j].
 * Note boundary problems.
 *                      7
 *                    3   8
 *                  8   1   0
 *                2   7   4   4
 *              4   5   2   6   5
 * Maximum sum path is:
 *                     (7)
 *                   (3)   8
 *                 (8)   1   0
 *                2  (7)  4   4
 *              4  (5)  2   6   5
 * Sum is 7 + 3 + 8 + 7 + 5 = 30
 *
 * Solution approach:
 * Let the optimal path be: a1,...,an-1,an. We examine whether optimal substructure exists.
 * I found that the subpath a1,...,an-1 of the above path must also be an optimal path, because if it weren't,
 * there would exist a better path through an-1, and this better path would also be able to form a better path
 * with an, contradicting the premise.
 * That is, if we define dp[i][j] as the optimal path ending at arr[i][j], then dp[i][j] can be obtained
 * through max(dp[i-1][j-1], dp[i-1][j]).
 *
 * Number Triangle is a type of idea, used to solve maximum/minimum weight path problems, such as maze problems,
 * shortest path problems, etc.
 */

interface Node {
    // Weight of the optimal path ending at this node
    value: number;
    // Previous node index
    prev: number;
}

/**
 * Number Triangle problem
 * @param arr - arr[i] contains i + 1 numbers
 * @returns Nodes on the optimal path
 */
function numberTriangle(arr: number[][]): number[] {
    if (!arr.length) {
        return []
    }

    // DP array. n*m 2D array. n: arr.length; m: number count in the last array of arr
    const dp: Node[][] = []

    // Initialize
    for (let i = 0; i < arr.length; i++) {
        dp[i] = []
    }
    dp[0][0] = { value: arr[0][0], prev: -1 }

    // State transition
    for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            // Get the maximum between dp[i - 1][j - 1] and dp[i - 1][j]
            // Note: check boundary conditions
            const left = j - 1 >= 0 ? dp[i - 1][j - 1].value : -Infinity
            const right = j < arr[i - 1].length ? dp[i - 1][j].value : -Infinity

            if (left > right) {
                dp[i][j] = { value: left + arr[i][j], prev: j - 1 }
            } else {
                dp[i][j] = { value: right + arr[i][j], prev: j }
            }
        }
    }

    // Get the maximum in dp[arr.length - 1]
    let index = -1
    const last = dp[arr.length - 1]
    for (let j = 0; j < last.length; j++) {
        if (index < 0 || last[j].value > last[index].value) {
            index = j
        }
    }

    // Backtrack
    const result: number[] = new Array(arr.length)
    for (let i = arr.length - 1; i >= 0; i--) {
        result[i] = arr[i][index]

        // Previous level's index
        index = dp[i][index].prev
    }

    return result
}

export { numberTriangle }