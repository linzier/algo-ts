import { sort } from './sort-util'
import { mergeSort } from '../../src/sort/mergesort'

describe('merge sort', () => {
    it('should success for all array', () => {
        sort(mergeSort)
    })
})