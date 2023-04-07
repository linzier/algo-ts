import assert from "assert"
import { knapsack, Goods } from '../../src/dp/multi-knapsack'

describe('multi knapsack', () => {
    it('should ok', () => {
        // 物品数组, 背包容量, 结果
        const list: [Goods[], number, number][] = [
            [[], 100, 0],
            [[{ v: 77, w: 92, c: 1 }, { v: 22, w: 22, c: 1 }, { v: 29, w: 87, c: 1 }], 0, 0],
            [[{ v: 77, w: 92, c: 1 }, { v: 22, w: 22, c: 1 }, { v: 29, w: 87, c: 1 }], 21, 0],
            [[{ v: 77, w: 92, c: 1 }, { v: 22, w: 22, c: 1 }, { v: 29, w: 87, c: 1 }, { v: 50, w: 46, c: 1 },
                { v: 99, w: 90, c: 1 }], 100, 133],
            [[{ v: 79, w: 83, c: 1 }, { v: 58, w: 14, c: 1 }, { v: 86, w: 54, c: 1 }, { v: 11, w: 79, c: 1 },
                { v: 28, w: 72, c: 1 }, { v: 62, w: 52, c: 1 }, { v: 15, w: 48, c: 1 }, { v: 68, w: 62, c: 1 }], 200, 334],
            [[{ v: 77, w: 92, c: 1 }, { v: 22, w: 22, c: 3 }, { v: 29, w: 87, c: 2 }, { v: 50, w: 46, c: 2 },
                { v: 99, w: 90, c: 1 }], 100, 196],
        ]

        for (const [goods, V, result] of list) {
            assert.equal(knapsack(goods, V), result)
        }
    })
})