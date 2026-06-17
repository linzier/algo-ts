/**
 * Skip List
 * A balanced tree based on multi-level linked lists，with average O(lgn) time complexity for search, insertion, and update.
 * Compared to other balanced trees like red-black trees, it has the following characteristics:
 *  1. Simple implementation;
 *  2. More friendly range queries;
 * 
 * Skip List detailed introduction document: https://mp.weixin.qq.com/s/HoEfIy2jZbhNsXY99Bm1LA
 * 
 * For simplicity, we restrict key to number type and assume node keys are unique (duplicates are overwritten on insertion).
 */

class SkipList {
    // Skip List maximum level count limit
    protected static readonly MAX_LEVEL = 32
    // Upper level element count is 1/N of lower level (like an N-ary tree)
    protected static readonly N = 4

    // Head pointer. For convenience, the head is a sentinel, not a real node
    protected head: Node
    // Tail pointer. Points to null when list is empty
    protected tail: Node | null
    // Number of elements in Skip List
    protected length: number
    // Skip Listlevel count
    protected level: number
    
    public constructor() {
        // Create head
        this.head = new Node(-Infinity, undefined)
        this.length = 0
        this.level = 0
    }

    public size(): number {
        return this.length
    }

    /**
     * Search for value by key, return undefined if not found
     * @param key
     */
    public search(key: number): unknown {
        if (!this.length) {
            return
        }

        let node = this.head

        // Search from the highest level downward until reaching level 0
        for (let i = this.level - 1; i >= 0; i--) {
            // If the current node has a successor at this level and its key <= key, jump to it
            while (node.nexts[i] && node.nexts[i].key <= key) {
                node = node.nexts[i]
            }
        }

        return node.key === key ? node.val : undefined
    }

    /**
     * Insert { key, val } into the Skip List. If it already exists, overwrite the val value
     * @param key
     * @param val
     */
    public insert(key: number, val: unknown) {
        // Get predecessor nodes at each level along the search path
        const prevNodes = this.searchPrevNodes(key)
        // Level 0 predecessor node
        const prev = prevNodes[0]

        // Check the level 0 predecessor's next to see if it has the key
        // If it is the key node, it already exists, overwrite val and return
        if (prev.nexts[0] && prev.nexts[0].key === key) {
            prev.nexts[0].val = val
            return
        }

        // The node to insert is new, need to insert and rebuild indices (possibly)
        const newNode: Node = { key, val, prev: null, nexts: [] }

        // Calculate the index level count for the new node
        const level = this.randomLevel()

        // Handle tail pointer
        if (!this.tail || this.tail === prev) {
            this.tail = newNode
        }

        // Handle prev pointer
        if (prev !== this.head) {
            // Point newNode's prev to node (provided node != head, we don't let prev point to the head sentinel)
            newNode.prev = prev
        }
        if (prev.nexts[0]) {
            prev.nexts[0].prev = newNode
        }

        // Process next pointers level by level
        for (let i = 0; i < level; i++) {
            // prevNodes only contains the rightmost nodes at the original this.level levels, while the new level may be higher than the original,
            // in which case the extra levels have no corresponding node in prevNodes, so use head directly
            const leftNode = prevNodes[i] ?? this.head

            // Update next pointer
            newNode.nexts[i] = leftNode.nexts[i]
            leftNode.nexts[i] = newNode
        }

        if (level > this.level) {
            this.level = level
        }

        this.length++
    }

    /**
     * Delete node
     * @param key
     */
    public delete(key: number) {
        // Get predecessor nodes at each level along the search path
        const prevNodes = this.searchPrevNodes(key)
        // The node to delete is the one pointed to by the level 0 predecessor's next pointer
        const current = prevNodes[0].nexts[0]

        if (!current || current.key !== key) {
            return
        }

        // Handle tail pointer
        if (this.tail === current) {
            this.tail = current.prev
        }

        // Handle prev pointer
        if (current.nexts[0]) {
            current.nexts[0].prev = current.prev
        }
        current.prev = null

        // Process next pointers at each level
        for (let i = 0; i < current.nexts.length; i++) {
            prevNodes[i].nexts[i] = current.nexts[i]
            current.nexts[i] = null

            // If the predecessor at this level is head and its next points to null/undefined after adjustment, this level no longer has valid nodes, decrement level count
            if (!this.head.nexts[i]) {
                this.level--
            }
        }

        this.length--
    }

    /**
     * Search for key, return an array of predecessor nodes at each level along the search path
     * i.e., return the left adjacent node at each level
     * @param key - the key
     * @returns Array of predecessor nodes for key at each level
     */
    private searchPrevNodes(key: number): Node[] {
        // Record the rightmost position reached at each level (i.e., the predecessor of the target node)
        const prevNodes: Node[] = []
        // Start from head
        let node = this.head

        // Search from the top level downward
        for (let i = this.level - 1; i >= 0; i--) {
            // If the current node has a successor at this level with key < key, jump to it
            while (node.nexts[i] && node.nexts[i].key < key) {
                node = node.nexts[i]
            }

            // Record this node as the rightmost node visited at this level before descending
            prevNodes[i] = node
        }

        // If none exist (empty list, when this.level = 0), add head
        if (!prevNodes.length) {
            prevNodes[0] = this.head
        }

        return prevNodes
    }

    /**
     * Randomly generate the level count
     * Starting from the bottom level, each additional level has probability 1/N
     */
    protected randomLevel(): number {
        let level = 1

        while (Math.round(Math.random()*10000000) % SkipList.N === 0) {
            level++
        }

        return Math.min(level, SkipList.MAX_LEVEL)
    }
}

/**
 * Skip List node
 * Doubly linked list node, has prev and next pointers
 */
class Node {
    // Key. Sorted by key
    // For simplicity, we assume node keys are unique (duplicates are overwritten on insertion)
    public key: number
    // Satellite data
    public val: unknown
    // Pointer to this node's predecessor
    public prev: Node | null
    // Array of successor pointers at each level for this node
    public nexts: (Node | null)[]

    public constructor(key: number, val: unknown) {
        this.key = key
        this.val = val
        this.prev = null
        this.nexts = []
    }
}

export { SkipList }