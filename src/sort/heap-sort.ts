import { Heap } from '../data-structure/heap'
/**
 * 堆排序
 * 使用大顶堆实现升序排序（小顶堆实现降序排序）
 * 原址排序
 * 时间复杂度：O(n*lgn)
 * 
 * 基于大顶堆的性质：堆顶元素总是整个堆中最大的。
 * 
 * 步骤：
 *  1. 将堆顶元素和堆尾元素互换，同时堆元素数量减 1（即换到堆尾的元素不再算作堆元素）；
 *  2. 对新堆顶执行 heapify；
 *  3. 循环执行步骤1、2，直到堆中只剩一个元素（最后一个元素不需要交换了）；
 * 其实就是不断从数组剩余元素中取最大的，从数组末尾自右向左依次排列。
 */

class SortHeap extends Heap {
    /**
     * 执行堆排序
     */
    public sort() {
        let tmp: number
        while (this._size > 1) {
            // 将堆顶和堆尾元素交换
            tmp = this.data[1]
            this.data[1] = this.data[this._size]
            this.data[this._size] = tmp

            // 堆元素数减一
            this._size--

            // heapify
            this.heapify(1)
        }

        // 因为建堆的时候我们向数组开头添加了一个元素，需要删掉
        this.data.shift()
    }
}

function heapSort(arr: number[]) {
    (new SortHeap(arr, true)).sort()
}

export { heapSort }