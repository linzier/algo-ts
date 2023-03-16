import assert from "assert"
import { orderStatistic } from '../../src/sort/order-statistic'

describe('order statistic', () => {
    it('should find success', () => {
        assert.throws(() => {
            orderStatistic([], 1)
        })

        assert.throws(() => {
            orderStatistic([2], 2)
        })

        assert.throws(() => {
            orderStatistic([2], 0)
        })

        assert.equal(orderStatistic([4], 1), 4)
        assert.equal(orderStatistic([4, 2, 5, 7], 1), 2)
        assert.equal(orderStatistic([4, 2, 5, 7], 4), 7)
        assert.equal(orderStatistic([4, 2, 5, 7], 3), 5)
        assert.equal(orderStatistic([4, 2, 5, 7], 2), 4)
        assert.equal(orderStatistic([1, 2, 3, 4], 4), 4)
        assert.equal(orderStatistic([1, 2, 3, 4], 2), 2)
        assert.equal(orderStatistic([2, 5, 1, 6, 12, 34, 10, 42, 87], 4), 6)
    })
})