import { sort } from './sort-util'
import { selectSort } from '../src/select-sort'

describe('select sort', () => {
    it('should success for all array', () => {
        sort(selectSort)
    })
})