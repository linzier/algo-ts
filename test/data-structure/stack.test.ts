import assert from "assert"
import { Stack } from '../../src/data-structure/stack'

describe('stack', () => {
    it('push pop should ok', () => {
        const stack = new Stack()

        assert.ok(stack.isEmpty())

        stack.push(4)
        stack.push(3)
        stack.push(2)
        stack.push(1)

        assert.ok(!stack.isEmpty())

        assert.equal(stack.pop(), 1)
        assert.equal(stack.pop(), 2)
        assert.equal(stack.pop(), 3)
        assert.equal(stack.pop(), 4)

        assert.ok(stack.isEmpty())

        assert.throws(() => {
            stack.pop()
        })

        stack.push(10)
        assert.ok(!stack.isEmpty())
        assert.equal(stack.pop(), 10)
        assert.ok(stack.isEmpty())
    })
})