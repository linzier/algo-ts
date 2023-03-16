import assert from "assert"

/**
 * 生成待排序的数据
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

    // 生成 10000 个随机整数
    const arr: number[] = []
    for (let i = 0; i < 10000; i++) {
        arr.push(Math.floor(Math.random() * 100000))
    }

    data.push(arr)

    // 排除掉大于 maxVal 的
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
        // 计时
        console.time(flag)
        sortFunc(arr)
        console.timeEnd(flag)

        // 排序后，j 大于等于 j - 1
        for (let j = 1; j < arr.length; j++) {
            assert.ok(arr[j] >= arr[j - 1])
        }
    }
}