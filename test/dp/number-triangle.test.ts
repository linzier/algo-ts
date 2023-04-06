import assert from "assert"
import { numberTriangle } from '../../src/dp/number-triangle'

describe('number triangle', () => {
    it('should ok', () => {
        const r1 = numberTriangle([])
        assert.equal(r1.length, 0)

        const r2 = numberTriangle([[10]])
        assert.equal(r2.length, 1)
        assert.equal(r2[0], 10)

        const r3 = numberTriangle([[10], [2, 5]])
        assert.equal(r3.length, 2)
        assert.equal(r3[0] + r3[1], 15)

        const r4 = numberTriangle([
            [7],
            [3, 8],
            [8, 1, 0],
            [2, 7, 4, 4],
            [4, 5, 2, 6, 5]
        ])
        assert.equal(r4.length, 5)
        assert.equal(r4.reduce((prev, curr) => prev + curr), 30)
    })
})