import assert from "assert"

/**
 * Generate data for sorting
 */
export function numberData(maxVal = Infinity) {
    const data = [
        [],
        [212],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [1, 1, 1, 1, 1],
        [4, 2, 6, 3, 3, 8, 1],
    ]

    // Generate 10000 random integers
    const arr: number[] = []
    for (let i = 0; i < 10000; i++) {
        arr.push(Math.floor(Math.random() * 100000))
    }

    data.push(arr)

    // Filter out values greater than maxVal
    for (const i in data) {
        data[i] = data[i].filter((val: number) => val <= maxVal)
    }

    return data
}

export function sort(sortFunc: (arr: number[]) => void) {
    const arrs = numberData()

    for (let i = 0; i < arrs.length; i++) {
        const arr = arrs[i]
        const flag = `${sortFunc.name}-${i}-cnt(${arr.length})`
        // Timing
        console.time(flag)
        sortFunc(arr)
        console.timeEnd(flag)

        // After sort, arr[j] >= arr[j-1]
        for (let j = 1; j < arr.length; j++) {
            assert.ok(arr[j] >= arr[j - 1])
        }
    }
}