/**
 * Heap Sort
 * Use Max-Heap to implement ascending order Sort (Min-Heap implements descending order Sort)
 * In-place sort
 * Time complexity: O(n*lgn)
 *
 * Based on Max-Heap property: the top element of the heap is always the maximum in the entire heap.
 *
 * Steps:
 *  1. Swap heap top element and heap tail element, meanwhile heap element count decreases by 1
 *     (i.e., the element swapped to the heap tail is no longer counted as a heap element);
 *  2. Perform heapify on the new heap top;
 *  3. Loop executing steps 1, 2, until heap has only one element left (last element doesn't need swapping);
 * Actually it's continuously getting the maximum from the remaining array elements, arranging them from
 * the array end towards the left sequentially.
 */

import { Heap, Value } from '../data-structure/heap'

class SortHeap extends Heap {
    /**
     * Perform Heap Sort
     */
    public sort() {
        let tmp: Value
        while (this._size > 1) {
            // Swap heap top and heap tail element
            tmp = this.data[1]
            this.data[1] = this.data[this._size]
            this.data[this._size] = tmp

            // Heap element count decreases by one
            this._size--

            // Heapify
            this.heapify(1)
        }

        // Because when building the heap we added an element to the beginning of the array, need to remove it
        this.data.shift()
    }
}

function heapSort(arr: Value[]) {
    (new SortHeap(arr, true)).sort()
}

export { heapSort, Value }