/**
 * Binary Search Tree
 * A binary search tree is a binary tree with the following properties:
 *  1. Each node has three pointers: parent (pointing to parent), left (pointing to left child), right (pointing to right child);
 *  2. Each node has two additional attributes: key - the key; val - satellite data;
 *  3. For any node x:
 *     x.key >= x.left.key;
 *     x.key <= x.right.key;
 *  4. Extending point 3:
 *     4.1 For any node x, x.key is greater than or equal to the key of any node in the subtree rooted at x.left;
 *     4.2 For any node x, x.key is less than or equal to the key of any node in the subtree rooted at x.right;
 *     4.3 Any two connected nodes (e.g., 15 and 6, 6 and 7 in the figure below), regardless of their parent-child relationship, the left one is always less than or equal to the right one;
 * 
 * Example:
 *                           15
 *                       /        \ 
 *                     6            18
 *                  /     \        /  \
 *                 3       7     17    20
 *               /  \       \
 *              2    4       13
 *                          /
 *                         9
 * The operations below are all illustrated using this binary tree.
 * 
 * @see {@link https://www.cnblogs.com/linvanda/p/17283480.html} This article provides a detailed introduction to the implementation principles of binary search trees.
 */

interface Value {
    key: number;
    val: unknown;
}

/**
 * Define tree node
 */
interface Node extends Value {
    parent: Node | null;
    left: Node | null;
    right: Node | null;
    // Special flag, used during insert
    // insert: When keys are equal, if flag = true insert to left child, otherwise insert to right child
    flag: boolean;
}

/**
 * Binary Search Tree
 * For convenience, key is restricted to number type, and search/delete only operate on the first matching node
 */
class BinSearchTree {
    protected root: Node | null
    // Number of tree nodes
    protected _size: number

    public constructor() {
        this.root = null
        this._size = 0
    }

    public size(): number {
        return this._size
    }

    /**
     * Tree height
     * Calculate height by finding maximum depth
     */
    public height(): number {
        return this.innerDepth(this.root, 0)
    }

    /**
     * Calculate the maximum depth of the subtree rooted at root
     * currDepth represents the depth at which root is located
     */
    protected innerDepth(root: Node | null, currDepth: number): number {
        if (!root || !root.left && !root.right) {
            return currDepth
        }

        // Calculate the height of left and right subtrees respectively, take the maximum
        const leftDepth = this.innerDepth(root.left, currDepth + 1)
        const rightDepth = this.innerDepth(root.right, currDepth + 1)

        return Math.max(leftDepth, rightDepth)
    }

    /**
     * Insert element
     * Search from the root node downward until finding the appropriate position to insert
     * For example, inserting key 5 into the example tree follows the path 15->6->3->4, ending up as the right child of 4
     * 
     * @param key - the key
     * @param val - satellite data
     * @returns the tree node generated for the inserted element
     */
    public insert(key: number, val: unknown): Node {
        if (!this.root) {
            this._size++
            return this.root = this.newNode(key, val)
        }

        // Start from root node, keep going down as long as curr is not null
        let curr = this.root
        let parent = curr.parent
        while (curr) {
            // Before descending into curr, record the current value as parent
            parent = curr

            if (key === curr.key) {
                // Flip flag so that the next same key will be inserted to the other side, preventing skew
                curr.flag = !curr.flag
                // Keys are equal, insert to left or right depending on flag
                curr = !curr.flag ? curr.left : curr.right
            } else if (key < curr.key) {
                // Less than current node's key, place to the left (left subtree)
                curr = curr.left
            } else {
                curr = curr.right
            }
        }

        // At this point, curr = null. Note parent cannot be null (empty tree case handled at the beginning)
        // Insert new node as left or right child of parent
        const node = this.newNode(key, val)
        if (key == parent.key) {
            // Note: parent.flag was flipped, so flip it back to the original value here
            !parent.flag ? (parent.left = node) : (parent.right = node)
        } else if (key < parent.key) {
            // Place to the left
            parent.left = node
        } else {
            parent.right = node
        }

        node.parent = parent
        this._size++
    }

    protected newNode(key: number, val: unknown): Node {
        return { key, val, parent: null, left: null, right: null, flag: true }
    }

    /**
     * Delete the (first) node with the given key (let it be x), and return that node
     * Three cases:
     *  1. x has no children, simply delete x (e.g., deleting 4 from the example tree);
     *  2. x has one child (left or right), replace x with that child (e.g., deleting 7 or 13 from the example tree);
     *  3. x has two children. We need to find a node (y) to replace x, where y is larger than any element in x's left subtree
     *     and smaller than any element in x's right subtree. Two nodes can satisfy this: the maximum node in x's left subtree, or the minimum node in x's right subtree.
     *     We use the minimum node from the right subtree to replace x.
     *     (e.g., after deleting 6 from the example tree, replace with 7)
     * 
     * @param key
     */
    public delete(key: number): Node | null {
        const node = this.searchNode(key)
        if (!node) {
            return null
        }

        // If node has no left child, replace with its right subtree; and vice versa
        // This includes the case of having neither left nor right child
        if (!node.left) {
            this.transplant(node, node.right)
        } else if (!node.right) {
            this.transplant(node, node.left)
        } else {
            // node has both left and right children
            // Find the minimum node from the right subtree
            const sub = this.minimum(node.right)

            if (sub.parent != node) {
                // When sub is not node's right child, first swap sub's right subtree with sub (note sub has no left child)
                this.transplant(sub, sub.right)
                // Update sub's right
                sub.right = node.right
                sub.right.parent = sub
            }

            // Swap sub and node
            this.transplant(node, sub)
            // Update sub's left
            sub.left = node.left
            sub.left.parent = sub
        }

        // Clear node's pointers
        node.parent = node.left = node.right = null
        this._size--

        return node
    }

    /**
     * Replace subtree x with subtree y
     */
    protected transplant(x: Node, y: Node | null) {
        // Update x.parent
        if (!x.parent) {
            // x is the root
            this.root = y
        } else if (x.parent.left == x) {
            // x is left child
            x.parent.left = y
        } else {
            // x is right child
            x.parent.right = y
        }

        if (y) {
            // Update y.parent
            y.parent = x.parent
        }
    }

    /**
     * Search for the first matching element by key, return its val. Returns undefined if not found
     */
    public search(key: number): unknown {
        const node = this.searchNode(key)

        return node ? node.val : undefined
    }

    /**
     * Search for the first matching element by key, return the corresponding Node. Returns null if not found
     * Uses iterative approach here
     */
    public searchNode(key: number): Node | null {
        let curr = this.root
        while (curr && curr.key !== key) {
            // curr exists and key does not match, search in left or right subtree accordingly
            if (key < curr.key) {
                curr = curr.left
            } else {
                curr = curr.right
            }
        }

        return curr
    }

    /**
     * In-order traversal
     * Print left subtree first, then self, then right subtree (so-called “in” means self is printed in the middle)
     * In-order traversal can implement sorting
     * In-order traversal of example tree: 2, 3, 4, 6, 7, 9, 13, 15, 17, 18, 20
     */
    public inorderWalk(): Node[] {
        const arr: Node[] = []
        this.inorder(this.root, arr)

        return arr
    }

    protected inorder(x: Node | null, arr: Node[]) {
        if (!x) {
            return
        }

        // Output left subtree first
        this.inorder(x.left, arr)
        // Self
        arr.push(x)
        // Right subtree
        this.inorder(x.right, arr)
    }

    /**
     * Pre-order traversal
     * Print self first, then left node, then right subtree
     * Pre-order traversal reflects an insertion order that constructs this tree structure
     * Pre-order traversal of example tree: 15, 6, 3, 2, 4, 7, 13, 9, 18, 17, 20
     */
    public preorderWalk(): Node[] {
        const arr: Node[] = []
        this.preorder(this.root, arr)

        return arr
    }

    protected preorder(x: Node | null, arr: Node[]) {
        if (!x) {
            return
        }

        // Self
        arr.push(x)
        // Left subtree
        this.preorder(x.left, arr)
        // Right subtree
        this.preorder(x.right, arr)
    }

    /**
     * Post-order traversal
     * Print left subtree first, then right subtree, then self
     * Post-order traversal of example tree: 2, 4, 3, 9, 13, 7, 6, 17, 20, 18, 15
     */
    public postorderWalk(): Node[] {
        const arr: Node[] = []
        this.postorder(this.root, arr)

        return arr
    }

    protected postorder(x: Node | null, arr: Node[]) {
        if (!x) {
            return
        }

        // Left subtree
        this.postorder(x.left, arr)
        // Right subtree
        this.postorder(x.right, arr)
        // Self
        arr.push(x)
    }

    /**
     * Get the minimum element in the subtree rooted at root
     * Keep getting the left child until a node has no left child
     * The minimum of the example tree is 2
     */
    public minimum(root?: Node): Node | null {
        let curr = root || this.root
        while (curr && curr.left) {
            curr = curr.left
        }

        return curr
    }

    /**
     * Get the maximum element in the subtree rooted at root
     * Keep getting the right child until a node has no right child
     * The maximum of the example tree is 20
     */
    public maximum(root?: Node): Node | null {
        let curr = root || this.root
        while (curr && curr.right) {
            curr = curr.right
        }

        return curr
    }

    /**
     * Get the successor of node x, i.e., the smallest node greater than x
     * Two cases:
     *  1. x has a right child (right subtree), take the minimum value in the right subtree. E.g., the successor of 15 in the example tree is 17;
     *  2. x has no right child, traverse upward through x's ancestors until finding the nearest p1 where p1 is the left child of p2, then p2 is x's successor.
     *     Because if all nodes along the way are right children (i.e., in the path x -> x.p -> x.p.p, x.p == x.p.p.left, x == x.p.left, meaning
     *     x > x.p > x.p.p), these nodes do not qualify; when we find an x.p.p.p where x.p.p.p.left = x.p.p, meaning x.p.p belongs to x.p.p.p's
     *     left subtree, and any node in the left subtree (including x) is less than its value, thus x < x.p.p.p, meaning we found the nearest node greater than x, i.e., x's successor.
     *     (In the above, x.p denotes x's parent)
     *     E.g., the successor of 13 in the example tree is 15.
     */
    public successor(x?: Node): Node | null {
        x = x || this.root

        if (!x) {
            return null
        }

        // Has right child, take the minimum from the right subtree
        if (x.right) {
            return this.minimum(x.right)
        }

        // No right child, search upward through parent
        let curr = x
        while (curr) {
            if (curr.parent && curr.parent.left == curr) {
                // curr is the left child of its parent, so the parent is the successor
                return curr.parent
            }

            // Recursively search upward
            curr = curr.parent
        }

        return curr
    }

    /**
     * Get the predecessor of node x, i.e., the largest node less than x
     * Two cases:
     *  1. x has a left child, its predecessor is the maximum node in the left subtree;
     *  2. x has no left child, traverse upward through x's ancestors until finding the nearest p1 where p1 is the right child of p2, then p2 is x's predecessor.
     *     Reasoning is the same as above.
     *     The predecessor of 17 in the example tree is 15.
     */
    public predecessor(x?: Node): Node | null {
        x = x || this.root

        if (!x) {
            return null
        }

        // Has left child, take the maximum from the left subtree
        if (x.left) {
            return this.maximum(x.left)
        }

        // No left child, search upward through parent
        let curr = x
        while (curr) {
            if (curr.parent && curr.parent.right == curr) {
                // curr is the right child of its parent, so the parent is the predecessor
                return curr.parent
            }

            // Recursively search upward
            curr = curr.parent
        }

        return curr
    }

    /**
     * Build a balanced binary search tree from a sorted (by key) array
     * For an already sorted array, if we call insert sequentially, we would get a linear linked list. To avoid this,
     * we use a binary search approach: split the array in half, then recursively build left and right subtrees
     * from the left and right subarrays respectively, resulting in a balanced binary tree
     * @param arr
     */
    public static buildFromOrderdArray(arr: Value[]): BinSearchTree {
        if (!arr.length) {
            return new BinSearchTree()
        }

        const tree = new BinSearchTree()
        tree.root = BinSearchTree.innerBuildFromOrderdArray(arr, 0, arr.length - 1)
        tree._size = arr.length

        return tree
    }

    /**
     * Build a binary tree rooted at node from subarray arr[start:end], return the root node
     */
    protected static innerBuildFromOrderdArray(arr: Value[], start: number, end: number): Node | null {
        if (start > end) {
            // Empty
            return null
        } else if (start == end) {
            // Only one element left, return a node directly
            return { ...arr[start], parent: null, left: null, right: null, flag: true }
        }

        const mid = start + Math.floor((end - start) / 2)
        // Current node
        const curr: Node = { ...arr[mid], parent: null, left: null, right: null, flag: true }
        // Left subtree
        const left = this.innerBuildFromOrderdArray(arr, start, mid - 1)
        // Right subtree
        const right = this.innerBuildFromOrderdArray(arr, mid + 1, end)

        curr.left = left
        curr.right = right

        if (left) {
            left.parent = curr
        }
        if (right) {
            right.parent = curr
        }

        return curr
    }
}

export { BinSearchTree }