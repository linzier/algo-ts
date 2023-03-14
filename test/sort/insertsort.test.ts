import assert from 'assert'
import { numberData } from './data'
import { insertSort } from '../../src/sort/insertsort'

const arrs = numberData()

describe('insert sort', () => {
    it('should success for all array', () => {
        for (let i = 0; i < arrs.length; i++) {
            const arr = arrs[i]
            insertSort(arr)

            // 排序后，j 大于等于 j - 1
            for (let j = 1; j < arr.length; j++) {
                assert.ok(arr[j] >= arr[j - 1])
            }
        }
    })
})