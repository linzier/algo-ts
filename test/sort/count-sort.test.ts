import assert from 'assert'
import { numberData } from './sort-util'
import { countSort } from '../../src/sort/count-sort'

describe('count sort', () => {
    it('should success for all array', () => {
        // max 取 0 ~ 100，分别验证正确性
        for (let j = 0; j <= 5; j++) {
            const arrs = numberData(j)

            for (let i = 0; i < arrs.length; i++) {
                const arr = arrs[i]
                countSort(arr, j)
    
                // 排序后，j 大于等于 j - 1
                for (let j = 1; j < arr.length; j++) {
                    assert.ok(arr[j] >= arr[j - 1], `arrs[${i}] fail,max val:${j}`)
                }
            }
        }
    })

    it('performance test', () => {
        const arr = []
        const max = 100
        for (let i = 0; i < 10000; i++) {
            arr.push(Math.floor(Math.random() * max))
        }

        console.time('count-sort')
        countSort(arr, max)
        console.timeEnd('count-sort')
    })
})