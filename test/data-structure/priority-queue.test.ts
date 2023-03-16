import assert from "assert"
import { MaxPriorityQueue } from '../../src/data-structure/priority-queue'

const arrs = [
    [],
    [2],
    [1, 2, 3, 4, 5, 6, 7],
    [7, 6, 5, 4, 3, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [5, 1, 4, 6, 9, 2, 12, 8, 8, 78, 463, 12, 34, 1, 3],
]

describe('priority queue', () => {
    it('max priority queue should ok', () => {
        for (const arr of arrs) {
            const queue = new MaxPriorityQueue()
            assert.equal(queue.size(), 0)
            assert.ok(queue.isEmpty())

            // 加入元素
            const indexes = new Map()
            for (const ele of arr) {
                indexes.set(queue.insert(ele), ele)
            }

            assert.equal(queue.size(), arr.length)

            // 随机修改其中元素的优先级
            const randVals = [0, -1, -5, 1, 5, -10, 10, -15, 15, -20, 20]
            for (const [i, v] of indexes) {
                const val = v + randVals[Math.floor(Math.random() * (randVals.length - 1))]
                queue.changePriority(i, val)
            }

            // 经过 insert 和 change 操作后，检查 extract 出来的数据顺序是否符合要求
            let prev = Infinity
            let curr: number
            while (!queue.isEmpty()) {
                curr = queue.extract()
                assert.ok(prev >= curr)
                prev = curr
            }

            assert.equal(queue.size(), 0)
            assert.ok(queue.isEmpty())
        }
    })
})