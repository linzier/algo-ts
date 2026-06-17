/**
 * Priority Queue
 * 
 * A max priority queue maintains a set S where each element x has a key. Each dequeue operation retrieves the element with the largest key among the remaining elements in S.
 * Application: Job scheduling in computer systems, where each job has a priority (or weight, level), and higher priority jobs execute first.
 * Uses a max-heap to implement the max priority queue (based on max-heap property: each time the top element is extracted, yielding the maximum element in order).
 * 
 * Operations:
 *  queue.insert(x): Add element x to the priority queue;
 *  queue.extract(): Remove and return the element with the maximum key from the queue;
 *  queue.changePriority(x, newKey): Change x.key to newKey (adjust x's priority);
 * 
 * For simplicity, our Priority Queue only considers the key itself, not satellite data (any data other than the key is called “satellite data”), and only considers the case where the key is a numeric value.
 * (Most algorithms in this project are also implemented for numeric data.)
 * Therefore, the above operations become:
 *  queue.insert(key: number): Add key to the Priority Queue;
 *  queue.extract(): Get the maximum key from the Queue;
 *  queue.changePriority(i, newKey): Change the value of node i to newKey (adjust priority);
 */

import { Heap, Value } from './heap'

class PriorityQueue extends Heap {
    /**
     * Insert key into the priority queue
     * @param key The key
     * @returns The position where key was inserted
     */
    public insert(key: Value): number {
        return this.push(key)
    }

    /**
     * Extract the maximum/minimum key from the queue
     */
    public extract(): Value {
        return this.pop()
    }
}

/**
 * Max Priority Queue
 */
class MaxPriorityQueue extends PriorityQueue {
    public constructor() {
        super([], true)
    }
}

/**
 * Min Priority Queue
 */
class MinPriorityQueue extends PriorityQueue {
    public constructor() {
        super([], false)
    }
}

export { MaxPriorityQueue, MinPriorityQueue, Value }