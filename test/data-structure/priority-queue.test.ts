import assert from "assert"
import { MaxPriorityQueue, MinPriorityQueue, Value } from '../../src/data-structure/priority-queue'

const arrs: Value[][] = [
    [],
    [{ key: 2, val: 0 }],
    [{ key: 1, val: 0 }, { key: 2, val: 0 }, { key: 3, val: 0 }, { key: 4, val: 0 }, { key: 5, val: 0 }, { key: 6, val: 0 }, { key: 7, val: 0 }],
    [{ key: 7, val: 0 }, { key: 6, val: 0 }, { key: 5, val: 0 }, { key: 4, val: 0 }, { key: 3, val: 0 }, { key: 2, val: 0 }, { key: 1, val: 0 }],
    [{ key: 1, val: 0 }, { key: 1, val: 0 }, { key: 1, val: 0 }, { key: 1, val: 0 }, { key: 1, val: 0 }, { key: 1, val: 0 }, { key: 1, val: 0 }],
    [
        { key: 5, val: 0 },
        { key: 1, val: 0 },
        { key: 4, val: 0 },
        { key: 6, val: 0 },
        { key: 9, val: 0 },
        { key: 2, val: 0 },
        { key: 12, val: 0 },
        { key: 8, val: 0 },
        { key: 78, val: 0 },
        { key: 463, val: 0 },
        { key: 12, val: 0 },
        { key: 34, val: 0 },
        { key: 1, val: 0 },
        { key: 3, val: 0 },
    ]
]

describe('priority queue', () => {
    it('max priority queue should ok', () => {
        for (const arr of arrs) {
            const queue = new MaxPriorityQueue()
            assert.equal(queue.size(), 0)
            assert.ok(queue.isEmpty())

            // add elements
            for (const ele of arr) {
                queue.insert(ele)
            }

            assert.equal(queue.size(), arr.length)

            // check that extracted data order conforms to requirements
            let prev = Infinity
            let curr: Value
            while (!queue.isEmpty()) {
                curr = queue.extract()
                assert.ok(prev >= (curr.key as number))
                prev = curr.key as number
            }

            assert.equal(queue.size(), 0)
            assert.ok(queue.isEmpty())
        }
    })

    it('min priority queue should ok', () => {
        for (const arr of arrs) {
            const queue = new MinPriorityQueue()
            assert.equal(queue.size(), 0)
            assert.ok(queue.isEmpty())

            // add elements
            for (const ele of arr) {
                queue.insert(ele)
            }

            assert.equal(queue.size(), arr.length)

            // check that extracted data order conforms to requirements
            let prev = -Infinity
            let curr: Value
            while (!queue.isEmpty()) {
                curr = queue.extract()
                assert.ok(prev <= (curr.key as number))
                prev = curr.key as number
            }

            assert.equal(queue.size(), 0)
            assert.ok(queue.isEmpty())
        }
    })
})