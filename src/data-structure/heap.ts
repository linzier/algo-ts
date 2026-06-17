/**
 * Heap (Binary Heap)
 * A heap is a complete binary tree (all levels are full except possibly the last, which is filled from left to right).
 * as shown: 
 *                               16
 *                            /      \
 *                          14        10
 *                         /   \     /  \
 *                        8      7  9    3
 *                      /  \    /
 *                     2    4  1
 * 
 * A complete binary tree can be represented by an array. The parent-child index relationships are:
 * (For easier computation, the first array element is unused, indices start from 1)
 * Computing children from parent index p:
 *      Left child index: l = 2p;
 *      Right child index: r = 2p + 1;
 * Computing parent index p from child index c (whether left or right child):
 *      p = floor(c/2);
 * 
 * Note: The code uses bit shifting for multiplication/division by 2 (right shift = divide by 2, left shift = multiply by 2).
 * 
 * Max-heap: For any subtree in the heap, parent values are >= child values (root is the maximum element);
 * Min-heap: For any subtree in the heap, parent values are <= child values (root is the minimum element);
 * 
 * For convenience in the comments below:
 *  TREE(i) denotes the subtree rooted at node i;
 *  LEFT(i) denotes i's left child;
 *  RIGHT(i) denotes i's right child;
 *  PARENT(i) denotes i's parent;
 */

interface Value {
    // Key, supports both string and number types
    key: string | number,
    // Value (satellite data), any type
    val: unknown;
}

class Heap {
    protected data: Value[]
    // Number of elements in heap
    protected _size: number
    // Whether it is a max-heap
    protected isMax: boolean

    /**
     * Build heap from data array
     * Note: This operation modifies the external data array; pass a copy if you don't want this
     * 
     * @param data - Array used to build the heap
     * @param isMax - Whether it is a max-heap
     */
    public constructor(data: Value[], isMax: boolean) {
        this.isMax = isMax
        this._size = data.length
        this.data = data
        // First position is unused
        this.data.unshift({ key: '', val: null })

        // Build heap
        this.build()
    }

    public size(): number {
        return this._size
    }

    public isEmpty(): boolean {
        return this._size == 0
    }

    /**
     * Pop the heap top element
     * After popping, move an element from the heap tail to the top, then heapify the top
     */
    public pop(): Value {
        if (this._size == 0) {
            throw new Error('heap is empty')
        }

        // Get the first element (heap top)
        const ele = this.data[1]
        // Move the last element to the heap top
        const last = this.data.pop()
        this._size -= 1

        if (this._size > 0) {
            this.data[1] = last
            /**
             * After moving the last element to the top, the new top may no longer satisfy the heap property, requiring heapification.
             * The reason for taking from the heap tail: if we took from elsewhere (e.g., the original top's left/right child), it would disrupt the structure
             * of subtrees below, causing a chain reaction (needing to keep moving elements down).
             * Taking from the tail, since the tail node has no children (and no right sibling), produces no cascading effects, ensuring all subtrees
             * except the root still satisfy the heap property, so we only need to heapify the top.
             */
            this.heapify(1)
        }

        return ele
    }

    /**
     * Add element to the heap
     * First add the element to the heap tail, then bubble up to find the appropriate position (similar to insertion sort).
     * (For max-heap: bubble up to find position i where data[i] < ele and PARENT(i) >= ele)
     * (Following parent pointers upward from any node gives a sorted sequence)
     * @returns The position where element ele was inserted
     */
    public push(ele: Value): number {
        // Add element to the end
        this.data.push(ele)
        this._size += 1

        // Let the last element “bubble” upward to the appropriate position
        return this.bubble(this._size)
    }

    /**
     * Starting from position i, “bubble” up along the parent chain to find the appropriate position for data[i]
     * Idea is the same as Insertion Sort
     * @returns The new position j where the original element at position i ends up after bubbling
     */
    protected bubble(i: number): number {
        if (i == 1) {
            return 1
        }

        // Temporarily store the element at position i to avoid three assignments per swap
        const curr = this.data[i]

        do {
            // Parent position
            const parent = i >> 1

            if (this.isMax && this.data[parent].key >= curr.key || !this.isMax && this.data[parent].key <= curr.key) {
                // Condition met, assign curr to this position, done
                this.data[i] = curr
                return i
            }

            // Element at position i violates heap property, move parent element down to position i, continue upward
            this.data[i] = this.data[parent]
            i = parent
        } while (i > 1)

        // If we reach here (root), all elements in the parent chain are greater/less than (depending on max/min heap) element i, so set element i as root
        this.data[1] = curr
        return 1
    }

    /**
     * Build heap
     * Building a heap means heapifying each subtree bottom-up, right-to-left
     * The first subtree to heapify is TREE[size/2] (the first non-leaf node from right to left on the second-to-last level)
     * The last subtree to heapify is TREE[0] (the root of the entire tree)
     * 
     * The reason for bottom-up heapification: as explained in the heapify function, before heapifying TREE(i),
     * the subtrees formed by LEFT(i) and RIGHT(i) must already be heapified.
     */
    protected build() {
        for (let i = this._size >> 1; i > 0; i--) {
            this.heapify(i)
        }
    }

    /**
     * Heapify subtree TREE(i)
     * Prerequisite: Before heapifying TREE(i), the subtrees formed by i's two children LEFT(i) and RIGHT(i) must already be heapified,
     * meaning only the root element violates the heap condition before heapification.
     * 
     * Steps (for max-heap):
     *  1. Find the largest value among current node (parent), left child, and right child, let its index be j;
     *  2. If j != i, the parent violates max-heap property, swap j and i values. Now the parent is the largest of the three, satisfying the condition;
     *  3. However, after swapping j and i, the new value at position j (swapped from position i) may violate the max-heap property for TREE[j], so continue heapify(j).
     * 
     * @param i - Position of the subtree root
     * @returns The new position j where the original element at i ends up
     */
    protected heapify(i: number): number {
        // Termination condition: i is a leaf node
        if (i > this._size >> 1) {
            return i
        }

        // Get the max/min of data[i], LEFT(i), RIGHT(i)
        const left = i << 1
        const right = (i << 1) + 1
        // Get the position of the max/min among the three
        const peak = this.getPeak(i, left, right)

        // If i is the max/min, heapification is done
        if (peak === i) {
            return i
        }

        // Need to swap
        const tmp = this.data[peak]
        this.data[peak] = this.data[i]
        this.data[i] = tmp

        // After swapping, continue heapifying the subtree rooted at peak
        return this.heapify(peak)
    }

    /**
     * Get and return the index of the max/min value
     * @param p Parent index
     * @param l Left child index
     * @param r Right child index
     */
    private getPeak(p: number, l: number, r: number): number {
        if (l > this._size) {
            return p
        }

        const data = this.data
        const isMax = this.isMax

        let peak = p
        // First get the max/min between parent and left child
        if (isMax && data[peak].key < data[l].key || !isMax && data[peak].key > data[l].key) {
            peak = l
        }

        // After selecting the max/min node above, compare with right child to select the overall max/min, thus selecting the max/min of all three
        if (r <= this._size && (isMax && data[peak].key < data[r].key || !isMax && data[peak].key > data[r].key)) {
            peak = r
        }

        return peak
    }
}

export { Heap, Value }