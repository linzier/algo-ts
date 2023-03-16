import { sort } from './sort-util'
import { quickSort } from '../../src/sort/quick-sort'

describe('quick sort', () => {
    it('should success for all array', () => {
        sort(quickSort)
    })
})