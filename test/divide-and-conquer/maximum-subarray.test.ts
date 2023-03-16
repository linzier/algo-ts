import assert from 'assert'
import { maxSubarray, MaxSubInfo } from '../../src/divide-and-conquer/maximum-subarray'

const data: [number[], MaxSubInfo][] = [
    [[], { start: -1, end: -1, sum: 0 }],
    [[-2], { start: 0, end: 0, sum: -2 }],
    [[-2, 1], { start: 1, end: 1, sum: 1 }],
    [[-2, 1, 0, 2, -1, 3], { start: 1, end: 5, sum: 5 }],
    [[-2, 1, -3, 4, -1, 2, 1, -5, 4], { start: 3, end: 6, sum: 6 }]
]

describe('max subarray:divide and conquer strategy', () => {
    it('should success for all array', () => {
        for (const [arr, info] of data) {
            const rst = maxSubarray(arr)
            assert.ok(rst.start == info.start && rst.end == info.end && rst.sum == info.sum)
        }
    })
})