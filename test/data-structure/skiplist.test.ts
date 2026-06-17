import assert from "assert"
import { SkipList } from "../../src/data-structure/skiplist"

class SkipListTest extends SkipList {
    public testRandomLevel(N = 10000) {
        let maxLevel = 0
        for (let i = 0; i < N; i++) {
            maxLevel = Math.max(this.randomLevel(), maxLevel)
        }

        console.log(`testRandomLevel executed ${N} times, got maximum level = ${maxLevel}. Corresponding theoretical count: ${Math.pow(SkipList.N, maxLevel - 1)}`)
    }

    public printLevel() {
        console.log(`size:${this.size()}, level:${this.level}`)
    }

    public getLevel(): number {
        return this.level
    }

    public checkNullLevel() {
        for (let i = 0; i < this.level; i++) {
            // head 's valid levels cannot point to null
            if (!this.head.nexts[i]) {
                throw new Error(`head.next[${i}] is null.level:${this.level}`)
            }
        }
    }

    public tailNode() {
        return this.tail
    }
}

describe('skipList', () => {
    it('test random level', () => {
        const list = new SkipListTest()
        // Just printing, no assertions
        list.testRandomLevel(100000)
    })
    it('should be ok', () => {
        let n = 100000
        const data: [number, number][] = []
        for (let i = 0; i < n; i++) {
            data.push([i, i * 1234])
        }

        const list = new SkipListTest()

        assert.equal(list.size(), 0)
        assert.equal(list.tailNode(), null)

        for (const d of data) {
            list.insert(d[0], d[1])
        }

        assert.equal(list.size(), data.length)
        assert.equal(list.search(5), 6170)
        assert.ok(list.tailNode() && list.tailNode().val === list.search(n - 1))

        list.printLevel()

        for (const d of data) {
            assert.equal(list.search(d[0]), d[1])
        }

        // Insert a duplicate
        list.insert(5, 100)

        assert.equal(list.size(), data.length)
        assert.equal(list.search(5), 100)
        assert.equal(list.search(-1000), undefined)

        assert.doesNotThrow(() => {
            list.checkNullLevel()
        })

        // delete
        for (const d of data) {
            list.delete(d[0])
        }

        assert.doesNotThrow(() => {
            list.checkNullLevel()
        })

        assert.equal(list.size(), 0)
        assert.equal(list.getLevel(), 0)
        assert.equal(list.tailNode(), null)

        // then execute one more time
        n = 40000
        const data2: [number, number][] = []
        for (let i = 0; i < n; i++) {
            data2.push([i, i * 111])
        }
        for (const d of data2) {
            list.insert(d[0], d[1])
        }

        assert.equal(list.size(), data2.length)
        assert.equal(list.search(5), 555)
        assert.ok(list.tailNode() && list.tailNode().val === list.search(n - 1))

        for (const d of data2) {
            list.delete(d[0])
        }

        assert.doesNotThrow(() => {
            list.checkNullLevel()
        })

        assert.equal(list.size(), 0)
        assert.equal(list.getLevel(), 0)
    })
})