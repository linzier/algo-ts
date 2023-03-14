import { sort } from './sort-util'
import { selectSort } from '../../src/sort/selectsort'

describe('select sort', () => {
    it('should success for all array', () => {
        sort(selectSort)
    })
})