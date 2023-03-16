import assert from 'assert'
import { bucketSort } from '../../src/sort/bucket-sort'

describe('bucket sort', () => {
    it('should ok', () => {
        const data = [
            [],
            [0],
            [0.1],
            [0.1, 0.1, 0.1, 0.1, 0.1],
            [0.1, 0.2, 0.3, 0.4, 0.5],
            [0.5, 0.4, 0.3, 0.2, 0.1],
            [0.431, 0.12, 0.999, 0.78123, 0, 0.917, 0.5],
        ]

        for (const i in data) {
            const len = data[i].length
            bucketSort(data[i])

            assert.equal(data[i].length, len)

            // 排序后，j 大于等于 j - 1
            for (let j = 1; j < data[i].length; j++) {
                assert.ok(data[i][j] >= data[i][j - 1], `arrs[${i}] fail`)
            }
        }
    })

    it('performance test', () => {
        const arr = []
        for (let i = 0; i < 10000; i++) {
            let v = Math.random()
            if (v == 1) {
                v = 0.9999
            }
            arr.push(v)
        }

        console.time('bucket-sort')
        bucketSort(arr)
        console.timeEnd('bucket-sort')
    })
})