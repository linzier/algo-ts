/**
 * Linked List
 * This implements a doubly linked list with sentinel
 * 
 * A sentinel is a special Node used to simplify linked list operations (especially deletion).
 * With a sentinel, it plays the roles of both head and tail (Link no longer needs separate head and tail pointers). The entire Link forms a circular linked list,
 * where the first Node's prev points to the sentinel, and the last Node's next also points to the sentinel;
 * the sentinel's next points to the first Node, and the sentinel's prev points to the last Node;
 * during initialization, the sentinel's prev and next point to itself.
 */

/**
 * Node definition
 */
interface Node {
    data: unknown;
    prev: Node;
    next: Node;
}

/**
 * Doubly linked list
 */
class Link {
    // Number of elements in the list
    protected _size: number
    // Sentinel node
    protected sentinel: Node

    public constructor() {
        this._size = 0
        
        // Initialize sentinel, its prev and next both point to itself
        const sentinel = { data: null, prev: null, next: null } as Node
        // prev and next point to self
        sentinel.prev = sentinel.next = sentinel
        this.sentinel = sentinel
    }

    public isEmpty(): boolean {
        return this._size == 0
    }

    public size(): number {
        return this._size
    }

    /**
     * Insert data at the head of the linked list
     * 
     * @param data - Element to insert
     * @returns The newly created Node
     */
    public insert(data: unknown): Node {
        this._size++

        // Wrap data as a Node
        const node = {
            data,
            prev: this.sentinel,
            next: this.sentinel.next,
        }

        this.sentinel.next.prev = node
        this.sentinel.next = node

        return node
    }

    /**
     * Search for data
     * @param data
     * @returns The corresponding Node if found, otherwise null
     */
    public search(data: unknown): Node | null {
        // Search forward from sentinel.next
        let curr = this.sentinel.next
        while (curr !== this.sentinel) {
            if (curr.data === data) {
                return curr
            }

            curr = curr.next
        }

        return null
    }

    /**
     * Search for data using a custom function
     * @param data
     * @returns The corresponding Node if found, otherwise null
     */
    public searchByFunc(compareFunc: (data: unknown) => boolean): Node | null {
        let curr = this.sentinel.next
        while (curr !== this.sentinel) {
            if (compareFunc(curr.data)) {
                return curr
            }

            curr = curr.next
        }

        return null
    }

    /**
     * Delete node
     * Before: nodePrev -> node -> nodeNext
     * After: nodePrev -> nodeNext, and node no longer references nodePrev and nodeNext
     */
    public delete(node: Node) {
        // Check if node has already been deleted
        if (node.prev === null || node.next === null) {
            return
        }

        node.prev.next = node.next
        node.next.prev = node.prev

        // Clear forward and backward pointers
        node.prev = node.next = null
        this._size--
    }

    /**
     * Remove and return the head node from the linked list
     */
    public shift(): Node | null {
        if (!this._size) {
            return null
        }

        const node = this.sentinel.next
        this.delete(node)

        return node
    }

    /**
     * Remove and return the tail element from the linked list
     */
    public pop(): Node | null {
        if (!this._size) {
            return null
        }

        const node = this.sentinel.prev
        this.delete(node)

        return node
    }
}

export { Link }