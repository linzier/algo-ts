import assert from "assert"
import { knapsack, Goods } from '../../src/dp/complete-knapsack'

describe('complete knapsack', () => {
    it('should ok', () => {
        // 物品数组, 背包容量, 结果
        const list: [Goods[], number, number][] = [
            [[], 100, 0],
            [[{ v: 77, w: 92 }, { v: 22, w: 22 }, { v: 29, w: 87 }], 0, 0],
            [[{ v: 77, w: 92 }, { v: 22, w: 22 }, { v: 29, w: 87 }], 21, 0],
            [[{ v: 77, w: 92 }, { v: 22, w: 22 }, { v: 29, w: 87 }, { v: 50, w: 46 }, { v: 99, w: 90 }], 100, 261],
            [[{ v: 79, w: 83 }, { v: 58, w: 14 }, { v: 86, w: 54 }, { v: 11, w: 79 }, { v: 28, w: 72 },
                { v: 62, w: 52 }, { v: 15, w: 48 }, { v: 68, w: 62 }], 200, 1422],
        ]

        for (const [goods, V, result] of list) {
            assert.equal(knapsack(goods, V), result)
        }
    })
})