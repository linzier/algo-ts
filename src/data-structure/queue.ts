/**
 * Queue
 * First In First Out
 * 
 * Uses a linked list for the regular queue and an array for the circular queue.
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
     * Enqueue
     */
    public enqueue(data: unknown) {
        this.link.insert(data)
    }

    /**
     * Dequeue
     * Throws an exception if queue is empty
     */
    public dequeue(): unknown {
        if (this.isEmpty()) {
            throw new Error('queue is empty')
        }

        return this.link.pop()?.data
    }
}

/**
 * Circular Queue
 * Implements a circular queue of size n using an array.
 * The circular queue has two internal pointers: head points to the front, tail points to the first empty slot after the rear.
 * 
 * Implementation:
 *   Keep head and tail values always increasing (never decreasing), so we can determine if the queue is full (or empty) via tail - head.
 *   Since head and tail only increase, we compute actual array indices via head mod n and tail mod n.
 * (
 *   Another implementation approach: tail and head represent actual array index positions (values 0 ~ n-1).
 *   The array size would be n+1, always having one empty slot (the position tail points to). When there is only one empty slot (i.e., head is right after tail),
 *   the array is full. When head and tail overlap, the array is empty.
 * )
 */
class CircularQueue {
    // Queue capacity
    private readonly CAP: number
    private arr: unknown[]
    // Points to the front of the queue (first element)
    private head: number
    // Points to the first empty slot
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
     * Enqueue
     */
    public enqueue(data: unknown) {
        if (this.isFull()) {
            throw new Error('queue is full')
        }

        this.arr[this.tail % this.CAP] = data
        this.tail++
    }

    /**
     * Dequeue
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