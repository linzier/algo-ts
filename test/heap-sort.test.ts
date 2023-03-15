import { sort } from './sort-util'
import { heapSort } from '../src/heap-sort'

describe('heap sort', () => {
    it('should success for all array', () => {
        sort(heapSort)
    })
})