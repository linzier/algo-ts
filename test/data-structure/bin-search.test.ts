import assert from "assert"
import { binSearch } from '../../src/data-structure/bin-search'

describe('bin search', () => {
    it('should search ok', () => {
        assert.equal(binSearch([], 3), null)
        assert.equal(binSearch([{ key: 1, val: 'a' }], 1).val, 'a')
        assert.equal(binSearch([{ key: 1, val: 'a' }], 2), null)

        const arr1 = [
            { key: 1, val: 'a' },
            { key: 2, val: 'b' },
            { key: 3, val: 'c' },
            { key: 4, val: 'd' },
            { key: 5, val: 'e' },
            { key: 6, val: 'f' },
            { key: 7, val: 'g' },
        ]

        assert.equal(binSearch(arr1, 1).val, 'a')
        assert.equal(binSearch(arr1, 2).val, 'b')
        assert.equal(binSearch(arr1, 6).val, 'f')
        assert.equal(binSearch(arr1, 7).val, 'g')
        assert.equal(binSearch(arr1, -1), null)
        assert.equal(binSearch(arr1, 20), null)
    })
})