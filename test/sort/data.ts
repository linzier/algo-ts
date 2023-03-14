/**
 * 生成待排序的数据
 */
export function numberData() {
    const data = [
        [],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [1, 1, 1, 1, 1],
        [4, 2, 6, 3, 3, 8, 1],
    ]

    const arr: number[] = []
    for (let i = 0; i < 200; i++) {
        arr.push(Math.floor(Math.random() * 10000))
    }

    data.push(arr)

    return data
}