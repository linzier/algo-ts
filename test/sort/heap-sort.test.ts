import assert from 'assert'
import { numberData } from './sort-util'
import { heapSort, Value } from '../../src/sort/heap-sort'

describe('heap sort', () => {
    it('should success for all array', () => {
        
        const list = numberData()
        for (const d of list) {
            const data = d.map((v): Value => {
                return { key: v, val: v }
            })

            // 计时
            console.time('heap-sort,cnt:' + d.length)
            heapSort(data)
            console.timeEnd('heap-sort,cnt:' + d.length)

            // 排序后，j 大于等于 j - 1
            for (let j = 1; j < data.length; j++) {
                assert.ok(data[j] >= data[j - 1])
            }
        }

    })
})