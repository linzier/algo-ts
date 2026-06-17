import assert from "assert"
import { Heap, Value } from '../../src/data-structure/heap'

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

describe('heap', () => {
    it('build heap from array', () => {
        for (const arr of arrs) {
            // get array copy
            const maxHeap = new Heap(arr.slice(0), true)
            assert.equal(maxHeap.size(), arr.length)

            // examine max-heap correctness (sequentially pop, previous is always >= next)
            let prev = Infinity
            let curr: Value
            while (!maxHeap.isEmpty()) {
                curr = maxHeap.pop()
                assert.ok(prev >= (curr.key as number))
                prev = curr.key as number
            }

            assert.equal(maxHeap.size(), 0)
            assert.ok(maxHeap.isEmpty())
        }
    })

    it('heap pop and push', () => {
        for (const arr of arrs) {
            const len = arr.length
            const maxHeap = new Heap(arr.slice(0), true)

            // correctness of push, pop operations and size
            if (!maxHeap.isEmpty()) {
                maxHeap.pop()
                assert.equal(maxHeap.size(), len - 1)
                maxHeap.push({ key: 2, val: 0 })
                maxHeap.push({ key: 4, val: 0 })
                maxHeap.push({ key: 88, val: 0 })
                maxHeap.push({ key: 13, val: 0 })
                assert.equal(maxHeap.size(), len + 3)
            } else {
                assert.throws(() => {
                    maxHeap.pop()
                })
            }

            // after some push/pop operations, heap property is still maintained
            let prev = Infinity
            let curr: Value
            while (!maxHeap.isEmpty()) {
                curr = maxHeap.pop()

                assert.ok(prev >= (curr.key as number))

                prev = curr.key as number
            }

            assert.equal(maxHeap.size(), 0)
            assert.ok(maxHeap.isEmpty())
        }
    })
})