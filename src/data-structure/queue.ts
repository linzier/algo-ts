/**
 * 队列
 * 先进先出
 * 
 * 这里用链表实现普通队列，用数组实现循环队列。
 */

import { Link } from './link'

class Queue {
    private link: Link

    public constructor() {
        this.link = new Link()
    }

    public size(): number {
        return this.link.size()
    }

    public isEmpty(): boolean {
        return this.link.isEmpty()
    }

    /**
     * 入列
     */
    public enqueue(data: unknown) {
        this.link.insert(data)
    }

    /**
     * 出列
     * 如果队列为空则抛异常
     */
    public dequeue(): unknown {
        if (this.isEmpty()) {
            throw new Error('queue is empty')
        }

        return this.link.pop()?.data
    }
}

/**
 * 循环队列
 * 用数组实现大小为 n 的循环队列。
 * 循环队列内部有两个指针：head 指向队头，tail 指向队尾的第一个空位。
 * 
 * 实现方式：
 *   让 head 和 tail 的值永远只增不减，这种情况下我们就能通过 tail - head 判断队列是否满了（或空了）。
 *   由于 head 和 tail 只增不减，所以要通过 head mod n、tail mod n（对 n 取模）来计算两者在数组中的实际下标。
 * （
 *   循环队列还有另一种实现方式：tail 和 head 表示数组中实际下标位置（取值 0 ~ n-1）。
 *   此时数组大小要是 n+1，永远有一个空位（也就是 tail 指向的位置），当整个数组只有一个空位（即 tail 后面就是 head）时，
 *   表示数组满了。当 head 和 tail 重叠时表示数组空了。
 *  ）
 */
class CircularQueue {
    // 队列容量
    private readonly CAP: number
    private arr: unknown[]
    // 指向队列头（第一个元素）
    private head: number
    // 指向第一个空位
    private tail: number

    public constructor(capacity: number) {
        if (capacity < 1) {
            throw new Error('invalid capacity')
        }

        this.CAP = capacity
        this.arr = new Array(capacity)
        this.head = 0
        this.tail = 0
    }

    public size(): number {
        return this.tail - this.head
    }

    public isEmpty(): boolean {
        return this.tail == this.head
    }

    public isFull(): boolean {
        return this.tail - this.head == this.CAP
    }

    /**
     * 入列
     */
    public enqueue(data: unknown) {
        if (this.isFull()) {
            throw new Error('queue is full')
        }

        this.arr[this.tail % this.CAP] = data
        this.tail++
    }

    /**
     * 出列
     */
    public dequeue(): unknown {
        if (this.isEmpty()) {
            throw new Error('queue is empty')
        }

        const data = this.arr[this.head % this.CAP]
        this.head++

        return data
    }
}

export { Queue, CircularQueue }