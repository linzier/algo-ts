/**
 * Binary Search Tree (Recursive Implementation)
 * A binary search tree is a binary tree with the following properties:
 *  1. Each node has two pointers: left (pointing to left child), right (pointing to right child);
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
    left: Node | null;
    right: Node | null;
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
     * Insert element data into the tree
     */
    public insert(key: number, val: unknown) {
        // Start from root (i.e., insert val into the entire binary tree)
        // After insertion, assign the root of the new subtree (here the entire tree) to root
        this.root = this.innerInsert({ key, val }, this.root)
        this._size++
    }
    
    /**
     * Insert element data into the subtree rooted at node
     * Return the root of the subtree after insertion
     */
    private innerInsert(data: Value, node: Node): Node {
        if (node === null) {
            // Encountered a null node, meaning we need to insert at this position
            return { ...data, left: null, right: null }
        }
        
        // Compare data and node values, handle accordingly
        if (data.key < node.key) {
            // Element to insert is less than current node, insert into left subtree
            node.left = this.innerInsert(data, node.left)
        } else {
            // Insert into right subtree
            node.right = this.innerInsert(data, node.right)
        }
        
        // After insertion, return the current node
        return node
    }

    /**
     * Delete the node corresponding to key
     */
    delete(key: number) {
        const node = this.searchNode(key)
        if (!node) {
            // key does not exist
            return
        }
        
        this.root = this.innerDelete(this.root, node)
        this._size--
    }
    
     /**
     * Delete node del from subtree current, return the root of the subtree after the operation
     */
    innerDelete(current: Node, del: Node): Node {
        /**
         * Current node is the node to be deleted
         */
        if (current === del) {
            // Case 1: Current node has no children, delete directly
            if (!current.left && !current.right) {
                return null
            }
            
            // Case 2: Has only one child
            if (current.left && !current.right) {
                // Only left child, replace current node with left child
                return current.left
            }
            
            if (current.right && !current.left) {
                // Only right child, replace current node with right child
                return current.right
            }
            
            // Case 3: Has two children
            // Get the minimum node from the right subtree
            const minNode = this.minimum(current.right)
            // Replace current node's value with the minimum node's value
            current.key = minNode?.key
            current.val = minNode?.val
            // Delete the minimum node from the right subtree
            current.right = this.innerDelete(current.right, minNode)

            return current
        }
        
        /**
         * Current node is not the node to delete, recursively delete from left or right subtree as appropriate
         */
        if (del.key < current.key) {
            // Node to delete is less than current node, delete from left subtree
            current.left = this.innerDelete(current.left, del)
        } else {
            // Node to delete is greater than current node, continue deleting from right subtree
            current.right = this.innerDelete(current.right, del)
        }
        
        return current
    }

    /**
     * Search for the first matching element by key, return its val. Returns undefined if not found 
     */
    public search(key: number): unknown {
        const node = this.searchNode(key)

        return node ? node.val : undefined
    }

    /**
     * Search for the node with the given key in the subtree rooted at node and return it
     * Returns null if not found
     */
    public searchNode(key: number, node: Node = undefined): Node | null {
        // Default to root
        node = node === undefined ? this.root : node
        
        // Encountered null node, not found, return null
        if (!node) {
            return null
        }
        
        // Check current node first
        if (node.key === key) {
            // Found, return it
            return node
        }
        
        // Not found, continue searching in left or right subtree as appropriate
        if (key < node.key) {
            // Target is less than current node, search in left subtree
            return this.searchNode(key, node.left)
        }
        
        // Target is greater than or equal to current node, search in right subtree
        return this.searchNode(key, node.right)
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
     * Get the minimum element in the subtree rooted at node
     * Keep getting the left child until a node has no left child
     * The minimum of the example tree is 2
     */
    public minimum(node?: Node): Node | null {
        // Default to root node
        node = node === undefined ? this.root : node
        
        if (node === null || !node.left) {
            // Return if empty subtree or node.left is null
            return node
        }
        
        // Left subtree exists, continue searching in left subtree
        return this.minimum(node.left)
    }

    /**
     * Get the maximum element in the subtree rooted at node
     * Keep getting the right child until a node has no right child
     * The maximum of the example tree is 20
     */
    public maximum(node?: Node): Node | null {
        // Default to root node
        node = node === undefined ? this.root : node
        
        if (node === null || !node.right) {
            // Return if empty subtree or node.right is null
            return node
        }
        
        // Left subtree exists, continue searching in right subtree
        return this.maximum(node.right)
    }

    /**
     * Return all nodes with keys between start and end in order
     */
    public range(start: number, end: number): Node[] {
        const arr: Node[] = []
        this.innerRange(this.root, start, end, arr)
        return arr
    }
    
    /**
     * Find all nodes in subtree x with keys between start and end and put them into arr
     */
    private innerRange(x: Node, start: number, end: number, arr: Node[]) {
        if (!x) {
            return
        }
        
        // Compare node x with start and end
        const greaterThanStart = x.key >= start
        const smallerThanEnd = x.key <= end

        // If current node >= start, need to search its left subtree
        if (greaterThanStart) {
            this.innerRange(x.left, start, end, arr)
        }
        
        // If x is between start and end, it qualifies, add to arr
        if (greaterThanStart && smallerThanEnd) {
            arr.push(x)
        }
        
        // If current node <= end, need to search its right subtree
        if (smallerThanEnd) {
            this.innerRange(x.right, start, end, arr)   
        }
    }
}

export { BinSearchTree }