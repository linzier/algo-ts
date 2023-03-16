import assert from 'assert'
import { radixSort } from '../../src/sort/radix-sort'

describe('radix sort', () => {
    let data: string[][]

    beforeEach(() => {
        data = [
            [],
            ['18298729383'],
            ['1829583', '1829583', '1829583', '1829583', '1829583'],
            ['1', '2', '3', '4', '5', '6'],
            ['6', '5', '4', '3', '2', '1'],
            [
                '69822827639',
                '72193835099',
                '89376837094',
                '39674837092',
                '49183837095',
                '29832837091',
                '89844837095',
                '39817837091',
                '15278867098',
                '29864130092',
                '64971887197',
            ]
        ]
    })

    it('should success for all array', () => {
        for (let i = 0; i < data.length; i++) {
            const arr = data[i]
            radixSort(arr, 9)

            // 排序后，j 大于等于 j - 1
            for (let j = 1; j < arr.length; j++) {
                assert.ok(arr[j] >= arr[j - 1], `arrs[${i}] fail,max val:${j}`)
            }
        }
    })
})