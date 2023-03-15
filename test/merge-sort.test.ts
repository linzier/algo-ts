import { sort } from './sort-util'
import { mergeSort } from '../src/merge-sort'

describe('merge sort', () => {
    it('should success for all array', () => {
        sort(mergeSort)
    })
})