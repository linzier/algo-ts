import assert from "assert"
import { Heap } from '../src/heap'

const arrs = [
    [],
    [2],
    [1, 2, 3, 4, 5, 6, 7],
    [7, 6, 5, 4, 3, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [5, 1, 4, 6, 9, 2, 12, 8, 8, 78, 463, 12, 34, 1, 3],
]

describe('heap', () => {
    it('build heap from array', () => {
        for (const arr of arrs) {
            const maxHeap = new Heap(arr.slice(0), true)
            assert.equal(maxHeap.size(), arr.length)

            // 检验大顶堆的正确性（依次 pop，前面的总比后面的大（或等于））
            let prev = Infinity
            let curr: number
            while (!maxHeap.isEmpty()) {
                curr = maxHeap.pop()
                assert.ok(prev >= curr)
                prev = curr
            }

            assert.equal(maxHeap.size(), 0)
            assert.ok(maxHeap.isEmpty())
        }
    })

    it('heap pop and push', () => {
        for (const arr of arrs) {
            const len = arr.length
            const maxHeap = new Heap(arr.slice(0), true)

            // push、pop 操作以及 size 的正确性
            if (!maxHeap.isEmpty()) {
                maxHeap.pop()
                assert.equal(maxHeap.size(), len - 1)
                maxHeap.push(2)
                maxHeap.push(4)
                maxHeap.push(88)
                maxHeap.push(23)
                assert.equal(maxHeap.size(), len + 3)
            } else {
                assert.throws(() => {
                    maxHeap.pop()
                })
            }

            // 经过一番 push、pop 后仍然保持堆的特性
            let prev = Infinity
            let curr: number
            while (!maxHeap.isEmpty()) {
                curr = maxHeap.pop()

                assert.ok(prev >= curr)

                prev = curr
            }

            assert.equal(maxHeap.size(), 0)
            assert.ok(maxHeap.isEmpty())
        }
    })
})