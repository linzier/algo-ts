import { Heap } from './heap'

/**
 * 优先队列
 * 此处实现最大优先队列
 * 
 * 最大优先队列维护一个集合 S，其元素 x，每个元素都有关键字 key，每次出列操作拿到的都是 S 中（剩余元素中） key 最大的那个 x。
 * 应用：如计算机系统的作业调度，每个作业有个优先级（或叫权重、级别），调度时高优先级的作业先执行。
 * 使用大顶堆实现最大优先队列（根据大顶堆的特性：每次取堆顶元素，即可依次取得堆中最大元素）。
 * 
 * 操作：
 *  queue.insert(x): 将元素 x 添加到优先队列中；
 *  queue.extract(): 从队列中取出最大关键字的 x；
 *  queue.changePriority(x, newKey): 修改 x.key 为 newKey（调整 x 的优先级）；
 * 
 * 简单起见，我们的优先队列仅考虑关键字本身，不考虑卫星数据（x 中除 key 以外的数据都叫“卫星数据”），且只考虑 key 为数值的情况。
 * （本项目其它大部分算法也是针对 number 型数据的实现。）
 * 因而上面的操作变成：
 *  queue.insert(key: number): 将 key 添加到优先队列中；
 *  queue.extract(): 从队列中取出最大 key；
 *  queue.changePriority(i, newKey): 修改节点 i 的值 为 newKey（调整优先级）；
 */

/**
 * 最大优先队列
 */
class MaxPriorityQueue extends Heap {
    public constructor() {
        super([], true)
    }

    /**
     * 将关键字插入到优先队列中
     * @param key 关键字
     * @returns key 被插入到的位置
     */
    public insert(key: number): number {
        return this.push(key)
    }

    /**
     * 从队列中取出最大 key
     */
    public extract(): number {
        return this.pop()
    }

    /**
     * 修改 i 位置的 key 为 newKey
     * @param i - key 所在位置
     * @param newKey - 新的 key
     * @returns newKey 所在的位置 j
     */
    public changePriority(i: number, newKey: number): number {
        if (i > this._size || i < 1) {
            throw new Error('i is invalid')
        }

        const oldKey = this.data[i]

        if (oldKey == newKey) {
            return i
        }

        this.data[i] = newKey

        /**
         * 对于最大优先队列（大顶堆）来说：
         *  如果 newKey > oldKey，不会改变 TREE(i) 子树的堆性质（newKey 一定大于其下子树中所有元素），但可能改变它与 PARENT(i) 之间的关系，因而要执行 bubble；
         *  如果 newKey < oldKey，不会改变其与 PARENT(i) 之间的关系，但可能改变 TREE(i) 子树的堆性质，因而要执行 heapify；
         */
        if (newKey > oldKey) {
            return this.bubble(i)
        }

        return this.heapify(i)
    }
}

export { MaxPriorityQueue }