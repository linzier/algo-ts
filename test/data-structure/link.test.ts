import assert from "assert"
import { Link } from '../../src/data-structure/link'

describe('double link', () => {
    it('should insert、search、delete success', () => {
        const link = new Link()

        assert.equal(link.size(), 0)
        assert.ok(link.isEmpty())

        const node0 = link.insert(20)
        assert.equal(link.size(), 1)
        link.delete(node0)
        assert.equal(link.size(), 0)

        link.insert(3)
        assert.equal(link.size(), 1)
        link.insert(5)
        assert.equal(link.size(), 2)
        link.insert(19)
        assert.equal(link.size(), 3)

        const node1 = link.search(3)
        assert.ok(node1 !== null)
        assert.equal(node1.data, 3)
        const node2 = link.search(19)
        assert.ok(node2 !== null)
        assert.equal(node2.data, 19)
        const node3 = link.search(-100)
        assert.ok(node3 === null)

        link.delete(node1)
        assert.equal(link.size(), 2)
        link.delete(node1)
        assert.equal(link.size(), 2)
        link.delete(node2)
        assert.equal(link.size(), 1)
        link.delete(link.search(5))
        assert.equal(link.size(), 0)
    })
})