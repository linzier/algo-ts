import assert from "assert"
import { Queue, CircularQueue } from "../../src/data-structure/queue"

describe('queue', () => {
    it('queue:enqueue、dequeue', () => {
        const queue = new Queue()

        assert.equal(queue.size(), 0)
        assert.ok(queue.isEmpty())

        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)
        queue.enqueue(4)

        assert.equal(queue.size(), 4)
        assert.ok(!queue.isEmpty())

        assert.equal(queue.dequeue(), 1)
        assert.equal(queue.dequeue(), 2)
        assert.equal(queue.dequeue(), 3)
        assert.equal(queue.dequeue(), 4)

        assert.equal(queue.size(), 0)
        assert.ok(queue.isEmpty())

        assert.throws(() => {
            queue.dequeue()
        })
    })

    it('circular queue:enqueue、dequeue', () => {
        const queue = new CircularQueue(3)

        assert.equal(queue.size(), 0)
        assert.ok(queue.isEmpty())
        assert.ok(!queue.isFull())

        assert.throws(() => {
            queue.dequeue()
        })

        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)

        assert.equal(queue.size(), 3)
        assert.ok(queue.isFull())
        assert.ok(!queue.isEmpty())

        assert.throws(() => {
            queue.enqueue(4)
        })

        assert.equal(queue.dequeue(), 1)
        assert.equal(queue.dequeue(), 2)

        queue.enqueue(5)

        assert.equal(queue.dequeue(), 3)
        assert.equal(queue.size(), 1)

        queue.enqueue(6)
        queue.enqueue(7)

        assert.equal(queue.size(), 3)

        assert.throws(() => {
            queue.enqueue(8)
        })

        assert.equal(queue.dequeue(), 5)
        assert.equal(queue.dequeue(), 6)
        assert.equal(queue.dequeue(), 7)

        assert.ok(queue.isEmpty())

        assert.throws(() => {
            queue.dequeue()
        })
    })
})