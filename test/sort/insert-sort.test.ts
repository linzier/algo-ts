import { sort } from './sort-util'
import { insertSort } from '../../src/sort/insert-sort'

describe('insert sort', () => {
    it('should success for all array', () => {
        sort(insertSort)
    })
})