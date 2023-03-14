import { sort } from './sort-util'
import { insertSort } from '../../src/sort/insertsort'

describe('insert sort', () => {
    it('should success for all array', () => {
        sort(insertSort)
    })
})