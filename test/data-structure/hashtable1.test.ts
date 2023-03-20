import assert from "assert"
import { HashTable } from '../../src/data-structure/hashtable1'

describe('hash table', () => {
    it('get、set', () => {
        const ht = new HashTable()

        assert.equal(ht.get('test1'), undefined)
        assert.equal(ht.count(), 0)

        const capacity = ht.capacity()

        ht.set('test1', 100)
        assert.equal(ht.get('test1'), 100)

        assert.throws(() => {
            ht.get('')
        })
        assert.throws(() => {
            ht.set('', 'abc')
        })

        ht.remove('test1')
        assert.equal(ht.get('test1'), undefined)

        ht.set('test1', 200)
        assert.equal(ht.get('test1'), 200)
        ht.remove('test1')

        // extend
        for (let i = 0; i < capacity; i++) {
            ht.set(`test_${i}`, i)
        }
        assert.equal(ht.count(), capacity)
        assert.equal(ht.capacity(), capacity * 2)

        // shrink
        for (let i = 0; i < capacity; i++) {
            ht.remove(`test_${i}`)
        }
        assert.equal(ht.count(), 0)
        assert.equal(ht.capacity(), capacity)
    })
})
