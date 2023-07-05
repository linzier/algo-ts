import assert from "assert"
import { SkipList } from "../../src/data-structure/skiplist"

class SkipListTest extends SkipList {
    public testRandomLevel(N = 10000) {
        let maxLevel = 0
        for (let i = 0; i < N; i++) {
            maxLevel = Math.max(this.randomLevel(), maxLevel)
        }

        console.log(`testRandomLevel.执行${N}次，得到最大 level = ${maxLevel}.对应的理论次数:${Math.pow(SkipList.N, maxLevel - 1)}`)
    }

    public printLevel() {
        console.log(`size:${this.size()}, level:${this.level}`)
    }

    public getLevel(): number {
        return this.level
    }

    public checkNullLevel() {
        for (let i = 0; i < this.level; i++) {
            // head 的有效层不可能指向 null
            if (!this.head.nexts[i]) {
                throw new Error(`head.next[${i}] is null.level:${this.level}`)
            }
        }
    }
}

describe('skipList', () => {
    it('test random level', () => {
        const list = new SkipListTest()
        // 只是打印，不做 assert
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

        for (const d of data) {
            list.insert(d[0], d[1])
        }

        assert.equal(list.size(), data.length)
        assert.equal(list.search(5), 6170)

        list.printLevel()

        for (const d of data) {
            assert.equal(list.search(d[0]), d[1])
        }

        // 插入一个重复的
        list.insert(5, 100)

        assert.equal(list.size(), data.length)
        assert.equal(list.search(5), 100)
        assert.equal(list.search(-1000), undefined)

        assert.doesNotThrow(() => {
            list.checkNullLevel()
        })

        // 删除
        for (const d of data) {
            list.delete(d[0])
        }

        assert.doesNotThrow(() => {
            list.checkNullLevel()
        })

        assert.equal(list.size(), 0)
        assert.equal(list.getLevel(), 0)

        // 再执行一次
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