import assert from 'assert'
import { inversionPair } from '../src/inversion-pair'

describe('inversion pair', () => {
    it('should success for all array', () => {
        const map:[number[], number][] = [
            [[], 0],
            [[12], 0],
            [[1, 2, 3, 4, 5, 6], 0],
            [[1, 1, 1, 1], 0],
            [[4, 3, 2, 1], 6],
            [[3, 7, 1, 2, 6, 4], 7],
        ]

        for (const [arr, cnt] of map) {
            assert.equal(inversionPair(arr), cnt)
        }
    })
})