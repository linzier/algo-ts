import assert from 'assert'
import { numberData } from './sort-util'
import { countSort } from '../../src/sort/count-sort'

describe('count sort', () => {
    it('should success for all array', () => {
        // Use max from 0 to 100, verify correctness for each
        for (let j = 0; j <= 5; j++) {
            const arrs = numberData(j)

            for (let i = 0; i < arrs.length; i++) {
                const arr = arrs[i]
                countSort(arr, j)
    
                // After sort, arr[j] >= arr[j-1]
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