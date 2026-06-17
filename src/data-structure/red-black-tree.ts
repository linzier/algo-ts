/**
 * Red-Black Tree
 * A red-black tree is a self-balancing binary search tree
 * Specifically, it borrows from the idea of 2-3 trees (or 2-3-4 trees), essentially implementing a 2-3 tree using a binary tree.
 * The red-black tree implemented here follows "Algorithms" (not "Introduction to Algorithms"), and is a left-leaning red-black tree (red nodes can only be on the left), which is essentially an implementation of a 2-3 tree.
 * It has the following properties:
 *  1. Every node is either red or black;
 *  2. The root is black;
 *  3. All leaf nodes are black (note: "leaf nodes" here are not actual leaf nodes but null nodes, explained separately below);
 *  4. If a node is red, both its children must be black (no two consecutive red nodes allowed; in 2-3 tree terms, no 4-nodes);
 *  5. For every node, all simple paths from that node to its descendant leaf nodes contain the same number of black nodes (corresponding to equal path lengths from root to all leaves in a 2-3 tree);
 *  6. For left-leaning red-black trees, red nodes can only be on the left;
 * 
 * In code comments we use (a) for red nodes, <a> for black nodes, [a] for nodes of unknown color, where a represents a subtree (a may be null).
 * 
 * Explanation of property 3:
 *  Leaf nodes in red-black trees are not what we typically understand as leaf nodes, but specifically refer to null nodes (or nil nodes), for the following reason.
 *  For example, a node = { key: 123, val: 'abc', left: null, right: null },
 *  In a red-black tree, this node is not a leaf node; node.left and node.right are the leaf nodes (both null).
 *  That is, leaf nodes in a red-black tree serve only as sentinels.
 *  Why this definition?
 *  As shown:
 *                      |
 *                     <a>
 *                  /       \
 *                (b)        <c>
 *               /   \      /   \
 *             <d>    <e>  nil  nil
 *            /   \   /  \
 *          nil  nil nil nil
 * In the figure above, all simple paths from node a to all nil nodes contain the same number of black nodes (nil nodes are also black).
 * What if we don't add nil nodes and instead treat the tree's terminal nodes as leaf nodes?
 * In this case, if we delete node <e>, the simple path a->e disappears entirely. The remaining paths still have the same black node count, so we could say we
 * deleted a black node <e> without violating red-black tree properties -- but this is clearly wrong (comparing with 2-3 trees makes this more apparent).
 * After adding null (nil in the figure) nodes, when we delete <e>, we find that the two paths through e have one fewer black node than other paths, violating the red-black property.
 * 
 * Red-black tree properties are maintained primarily through left/right rotations and color flips.
 * The three core operations defined below: rotateLeft, rotateRight, flipColors, do not change the red-black properties of subtree h (except possibly h's own color).
 * The restriction that only left children can be red (left-leaning), as seen in the implementation below (especially deletion), greatly simplifies the problem complexity by keeping right children always black.
 * 
 * In a left-leaning red-black tree, the minimum node never has any children, because if it had children, it would only have a right child, but whenever we add a new red
 * right child, a left rotation is immediately needed to make it left-leaning.
 * The maximum node has at most one red left child.
 * 
 * Order statistics:
 * Order statistics can be implemented with O(logn) complexity using a red-black tree; see osSelect and osRank methods.
 * Additionally, O(n) complexity order statistics can be implemented via quicksort; see sort/order-statistic.ts
 */

import assert from "assert"

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
    color: 'RED' | 'BLACK';
    // Number of nodes in the subtree rooted at this node (including itself), used for order statistics
    // Formula: node.size = node.left.size + node.right.size + 1
    size: number;
}

/**
 * Red-Black Tree
 * For convenience, key is restricted to number type, and search/delete only operate on the first matching node
 */
class RedBlackTree {
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

        // Calculate heights of left and right subtrees, take the maximum
        const leftDepth = this.innerDepth(root.left, currDepth + 1)
        const rightDepth = this.innerDepth(root.right, currDepth + 1)

        return Math.max(leftDepth, rightDepth)
    }

    /**
     * Left rotate node h relative to h.right
     * Left rotation does not change the number of black nodes on any path
     * This operation ensures all nodes' size properties in subtree h are correctly updated
     * Before rotation: h may be red or black; h.right (let it be x) is red;
     *                   |
     *                  [h]
     *                 /   \
     *                a     (x)
     *                     /   \
     *                    b     c
     * 
     * After rotation: x takes h's original color (since it takes h's position), h becomes red;
     *                   |
     *                  [x]
     *                 /   \
     *               (h)    c
     *              /   \
     *             a     b
     * Note: The implementation does not update p's parent's left/right pointer to x, since we don't maintain parent pointers; the code uses recursion (iterative implementation would need parent pointers)
     * @param h - Node to left-rotate
     * @returns The upper node x after left rotation for further recursive processing
     */
    protected rotateLeft(h: Node): Node {
        assert(h && h.right)

        const x = h.right
        h.right = x.left
        x.left = h

        x.color = h.color
        h.color = 'RED'

        // Update size
        this.updateSize(h)
        this.updateSize(x)

        return x
    }

    /**
     * Right rotate node h relative to h.left
     * Right rotation does not change the number of black nodes on any path
     * This operation ensures all nodes' size properties in subtree h are correctly updated
     * Before rotation: h may be red or black, h.left (x) is red.
     *                |
     *               [h]
     *              /   \
     *            (x)    c
     *           /   \
     *          a     b
     * 
     * After rotation: x takes h's color, h becomes red;
     *                |
     *               [x]
     *              /   \
     *             a    (h)
     *                 /   \
     *                b     c   
     * 
     * @param h - Node to right-rotate
     * @returns The upper node x
     */
    protected rotateRight(h: Node): Node {
        assert(h && h.left)

        const x = h.left
        h.left = x.right
        x.right = h

        x.color = h.color
        h.color = 'RED'

        // Update size
        this.updateSize(h)
        this.updateSize(x)

        return x
    }

    /**
     * Flip colors
     * Flipping colors does not change black height, thus requiring: x and y must have the same color, opposite to h's color.
     * 
     * (Below uses x, y as red and h as black as an example)
     * Before flip: h.color = 'BLACK'; h.left.color = 'RED'; h.right.color = 'RED';
     *                   |
     *                  <h>
     *                 /   \
     *               (x)    (y)
     *              /   \  /   \
     * 
     * After flip: h.color = 'RED'; h.left.color = 'BLACK'; h.right.color = 'BLACK';
     *                   |
     *                  (h)
     *                 /   \
     *               <x>    <y>
     *              /   \  /   \
     * @param h
     */
    protected flipColors(h: Node) {
        assert(h && h.left && h.right)
        assert(h.left.color === h.right.color && h.left.color !== h.color)

        const hColor = h.color
        h.color = h.left.color
        h.left.color = hColor
        h.right.color = hColor
    }

    protected updateSize(x: Node) {
        x.size = (x.left ? x.left.size : 0) + (x.right ? x.right.size : 0) + 1
    }

    /**
     * Check if node is red
     * null nodes are defined as black
     */
    protected isRed(node: Node | null): boolean {
        if (!node) {
            return false
        }

        return node.color === 'RED'
    }

    /**
     * Insert element
     * Search from root downward until finding the right position
     * 
     * @param key - the key
     * @param val - satellite data
     */
    public insert(key: number, val: unknown) {
        this.root = this.innerInsert(this.root, { key, val })
        this.root.color = 'BLACK'
        this._size++
    }

    /**
     * Recursively insert element value into subtree p, maintaining red-black properties
     * Red-black property maintenance:
     * We examine subtree p in three cases:
     * (Note: when examining subtree p, we don't consider p's own color, because when we examine p's parent, p will naturally be examined)
     *  We use curr to point to the node currently being examined.
     *  1. curr's right node is red, left node is black, violating the “left-leaning” principle: execute left rotation to make it left-leaning;
     *              |                             |
     *     curr -> [p]                   curr -> [y]
     *           /     \                       /     \
     *         <x>     (y)       -->         (p)      d
     *         / \     / \                  /  \      
     *        a   b   c   d               <x>   c
     *                                   /   \
     *                                  a     b
     *     After processing, curr pointer points to the new subtree root.
     *     Note: In this case, we don't know y's color after rotation. If it's black, it's fine; otherwise it will be handled in the next recursion, so no worries.
     *  2. After examining and handling case 1, if curr.left and curr.left.left are both red: execute right rotation on curr, converting to case 3;
     *                      |                               |
     *             curr -> [p]                     curr -> [x]
     *                    /   \                          /     \
     *                  (x)    c                       (y)     (p)
     *                 /   \            -->           /       /   \
     *               (y)    b                        a       b     c
     *              /
     *             a
     *      
     *      Note: After case 2 transformation (right rotation), it becomes case 3, which executes color flip. The flip operation requires x and p, y to have different colors. Here
     *           y and p are red, so x must be black. We first need to prove x cannot be red (otherwise there would be three red nodes and flip would be impossible).
     *           Let's examine the subtree state before this operation (left figure):
     *           Since our operations are processed bottom-up recursively, before this round, no operation could have changed curr's (i.e., p's) color, meaning
     *           p's current color conforms to red-black tree rules before inserting the new element (since the entire tree was a valid red-black tree before inserting value);
     *           Also, x and y are both red now, which violates red-black rules, meaning x or y's color must have been caused by the previous operation. The question is: did the previous
     *           operation turn both x and y red, or only one of them?
     *           Our operations are only left rotation, right rotation, and color flip (each at most once per round), and none of these can make a node and its left child both red simultaneously.
     *           Therefore, before the previous transformation, p's left child must have been red, so p must have been black (because before the transformation, p and its left child's colors
     *           conformed to red-black tree rules).
     *  3. After examining and handling case 2, curr.color is black, curr.left.color and curr.right.color are both red: execute color flip;
     *                 |                               |
     *        curr -> <p>                     curr -> (p)
     *              /     \                         /     \
     *           (x)       (y)      -->           <x>      <y>
     *          /   \     /   \                  /   \    /   \
     *         a     b   c     d                a     b  c     d
     * 
     * @param p 
     * @param value
     * @returns Returns the new root of subtree p (after insertion and red-black property maintenance, the new root may not be the same node)
     */
    private innerInsert(p: Node | null, value: Value): Node {
        if (p === null) {
            // Subtree p is a null pointer (empty tree), create and return a new node
            return this.newNode(value.key, value.val)
        }

        // Subtree p is non-empty, insert value into p's left or right subtree as appropriate
        if (value.key < p.key) {
            p.left = this.innerInsert(p.left, value)
        } else {
            p.right = this.innerInsert(p.right, value)
        }

        // Update size
        this.updateSize(p)

        // Fix red-black properties
        return this.balance(p)
    }

    /**
     * Perform red-black balancing on subtree rooted at p to restore red-black properties
     * @param p
     * @returns The new root after balancing
     */
    private balance(p: Node): Node {
        // Case 1 (right-leaning), execute left rotation
        if (!this.isRed(p.left) && this.isRed(p.right)) {
            p = this.rotateLeft(p)
        }

        // Case 2: two consecutive left-leaning red nodes
        if (this.isRed(p.left) && this.isRed(p.left.left)) {
            p = this.rotateRight(p)
        }

        // Case 3: A black node has two red children, the right red node violates the “left-leaning” principle, resolved by flipping colors
        if (this.isRed(p.left) && this.isRed(p.right)) {
            this.flipColors(p)
        }

        return p
    }

    protected newNode(key: number, val: unknown): Node {
        return { key, val, left: null, right: null, color: 'RED', size: 1 }
    }

    /**
     * Delete the minimum node from the tree
     * 
     * Deletion logic:
     * For a left-leaning red-black tree, the minimum node has no children (any right child would have been left-rotated away), so if the node is red, simply delete it without changing
     * the number of black nodes on that path, maintaining red-black properties.
     * But if the deleted node is black, it reduces the black node count on related paths by 1, violating red-black properties.
     * For black nodes, there are two approaches:
     *  1. Delete the black node, then fix the entire tree. This process would be very complex;
     *  2. Find a way to turn the node red before deleting. This is the approach used here;
     * 
     * How to turn a black node at the end of a path into a red node?
     * For the following simple path from root to leaf:
     * (Other nodes on the tree are omitted)
     *                  h
     *                /
     *               a
     *                 \
     *                   b
     *                  /
     *                 c
     *                 .
     *                 .
     *                /
     *               x
     * To turn x from black to red while keeping the total black node count on this path unchanged, we can use a color transfer strategy: pass the color of some red node on this path
     * downward, ultimately to x. Now x becomes red, the original red node becomes black, and the total black node count remains unchanged.
     * There are several questions:
     *  1. How to transfer color? Just execute color flip (flipColors), which we know doesn't break the red-black node count on any path;
     *  2. Color flip modifies both children's colors simultaneously, potentially creating right-leaning red nodes. We can fix this by running balance bottom-up after deleting x;
     *  3. Since nodes on this path also form other paths, transferring colors may break black node counts on other paths. After flipping, perform rotations as needed
     *     to fix damage to other paths;
     *  4. What if there are no red nodes on this path? We can make the root red. Making the root red is equivalent to reducing the black node count
     *     on all simple paths from root to leaves by 1, without violating red-black properties. In practice, when we start from the root, we don't know if there will be red nodes later on the path, so when we determine
     *     root.left is black, we change root's color to red to ensure at least one red node is available;
     */
    public deleteMin() {
        if (!this.root) {
            return
        }

        // When root's left child is not red, make root red so there's a red node to push down
        //(Strictly speaking, we should also check if the left grandchild is red, but it's fine without this check -- even if root's red doesn't sink down, we just change it back to black at the end)
        if (!this.isRed(this.root.left)) {
            this.root.color = 'RED'
        }

        this.root = this.innerDeleteMin(this.root)

        if (this.root) {
            this.root.color = 'BLACK'
        }

        this._size--
    }

    /**
     * Delete the minimum node from subtree x and restore red-black properties
     * @returns After deletion and restoration, return the new root of the subtree (may be null if subtree is empty)
     */
    private innerDeleteMin(x: Node): Node | null {
        // When x has no left node (and thus definitely no right node either), it is the minimum node; delete it by returning null to the parent
        // When processing reaches the minimum node, it must already be red (either originally red, or made red via moveRedLeft on the parent)
        if (!x.left) {
            return null
        }

        /**
         * Otherwise continue processing the left subtree (i.e., delete the minimum node from the left subtree, recursively)
         * Before recursion, we try to pass a red node down to the next node to process
         * Note: The prerequisite for passing red downward is: the node's left child and left grandchild must both be black; otherwise, since there's already a red node below,
         * there's no need to pass red from above, and passing it down in this case would violate red-black rules (causing two adjacent red nodes)
         */
        if (!this.isRed(x.left) && !this.isRed(x.left.left)) {
            x = this.moveRedLeft(x)
        }

        // Recursively process x.left
        x.left = this.innerDeleteMin(x.left)

        // Update x.size
        this.updateSize(x)

        // After deleting x, execute balance (because moveRedLeft may create right-leaning red nodes)
        // The first backtrack is to x's parent (not x itself)
        return this.balance(x)
    }

    /**
     * Transfer x's red color to x's left child, may need to restore red-black properties
     * Prerequisite for calling this function: x must be red
     * After this function executes, x.left is guaranteed to be red
     * Note: This operation may create right-leaning red nodes due to the flip, which cannot be resolved here (unless we flip again, but then red can't propagate downward),
     * this issue is left to the backtracking phase to resolve
     * 
     * Note: moveRedLeft does not modify the structure of x's left subtree (but may modify the right subtree), this is important
     * This operation ensures all nodes' size in subtree x can be correctly updated
     * 
     * @returns Return the new root of the subtree after transfer and restoration (may be different from the original)
     */
    private moveRedLeft(x: Node): Node {
        assert(x.left)
        assert(this.isRed(x) && !this.isRed(x.left) && !this.isRed(x.left.left))

        // Since x is red, both its children must be black, execute flip
        this.flipColors(x)

        /**
         * After flipping, two consecutive red nodes may appear:
         *               |                                 |
         *              (x)                               <x>
         *            /     \                           /     \
         *          <y>      <z>                      (y)      (z)
         *         /  \     /    \       -->         /   \    /   \ 
         *       <a>      (b)     <c>              <a>      (b)    <z>
         *      /   \    /  \    /   \            /   \    /   \  /   \
         * As above, after flipping both z and b are red.
         * Can be resolved via z = rotateRight(z) -> x = rotateLeft(x) -> flipColors(x).
         */
        if (x.right && this.isRed(x.right.left)) {
            x.right = this.rotateRight(x.right)
            // Update x.size first
            this.updateSize(x)
            x = this.rotateLeft(x)
            this.flipColors(x)
        }

        return x
    }

    /**
     * Delete the maximum node from the tree
     * The maximum node must be black (otherwise it would violate the left-leaning principle), and it has at most one red left child (can be verified by adding children to a maximum node with no children
     * and simulating -- after the three fix operations, if a left child exists, it cannot be black.)
     * The approach is similar to deleting the minimum node: pass red nodes downward from the root, ultimately turning the target node red before deleting it, so the black node count on paths is unaffected
     * The difference is that the maximum node is on the right and may have a left child. In a left-leaning red-black tree, all red nodes are on the left. So to pass red along the rightmost path, we must
     * right-rotate the relevant left-leaning red nodes.
     */
    public deleteMax() {
        if (!this.root) {
            return
        }

        if (!this.isRed(this.root.left)) {
            // If root's left child is black, make root red so there's a red node to pass down
            this.root.color = 'RED'
        }

        this.root = this.innerDeleteMax(this.root)

        if (this.root) {
            this.root.color = 'BLACK'
        }

        this._size--
    }

    /**
     * Delete the maximum node from subtree x, return the new root after deletion and restoration
     */
    private innerDeleteMax(x: Node): Node | null {
        // If the left child is red, right-rotate first to transfer the red to the right
        // This operation also serves another purpose: when the maximum node has a left child (which must be red), right-rotating removes that left child, making the node to delete childless and simplifying deletion
        if (this.isRed(x.left)) {
            x = this.rotateRight(x)
        }

        // When x has no right child, it is the maximum, execute deletion
        // When operating on x, this node must already be red (either originally red, or made red via moveRedRight on the parent)
        if (!x.right) {
            return null
        }

        // x has a right child, recursively process right subtree
        // Before recursion, transfer x's red to the right child
        if (!this.isRed(x.right) && !this.isRed(x.right.left)) {
            x = this.moveRedRight(x)
        }

        // Recursively process right child
        x.right = this.innerDeleteMax(x.right)

        // Update x.size
        this.updateSize(x)

        // After deletion, execute balance to restore red-black properties
        // Because moveRedRight may create right-leaning red nodes
        return this.balance(x)
    }

    /**
     * Transfer node x's red to its right child
     * Prerequisites: 1. x is red; 2. x.right and x.right.left are both black
     * (And x.left must also be black, because if x.left were red, a right rotation would have been performed earlier to make it black)
     * After operation, x.right is red.
     * 
     * This operation does not modify the structure of x's right subtree.
     * 
     * @returns The new root of the subtree after transfer
     */
    private moveRedRight(x: Node): Node {
        assert(x.right)
        assert(this.isRed(x))
        assert(!this.isRed(x.right) && !this.isRed(x.right.left))

        // Flip colors
        this.flipColors(x)

        /**
         * After flipping, the following case creates two consecutive red nodes (a and c), violating red-black properties and needing correction:
         *              |                                    |
         *             (x)                                  <x>
         *           /     \                              /     \
         *         <a>      <y>       -->               (a)      (y)
         *        /   \     /  \                       /   \    /   \
         *      (c)   <d> <z>   <b>                  (c)   <d> <z>   <b>
         *     /  \   /  \                          /   \  /  \
         * Fix operation: x = rotateRight(x) -> flipColors(x)
         */
        if (this.isRed(x.left.left)) {
            x = this.rotateRight(x)
            this.flipColors(x)
        }

        return x
    }

    /**
     * Delete the (first) node with the given key
     * If the node to delete has no children, turn it red then delete directly;
     * Otherwise, like a regular BST, copy the successor's value to this node, then delete the successor;
     * 
     * Same idea as deleteMin and deleteMax: probe downward from root, passing red downward until it reaches the node to be deleted.
     * 
     * @param key
     */
    public delete(key: number) {
        // First check if the tree contains key
        if (!this.root || !this.searchNode(key)) {
            return
        }

        // If root.left is not red, change root to red to ensure a red node can be passed down during probing
        if (!this.isRed(this.root.left)) {
            this.root.color = 'RED'
        }

        this.root = this.innerDelete(this.root, key)
        
        if (this.root) {
            this.root.color = 'BLACK'
        }

        this._size--
    }

    /**
     * Delete the first node equal to key in subtree x, restore red-black properties, return the new root of the subtree
     */
    private innerDelete(x: Node, key: number): Node {
        if (key < x.key) {
            /**
             * The node to delete is in x's left subtree. Since we already verified key exists, x.left must exist
             * Before going left, pass red downward (safe because moveRedLeft doesn't modify left subtree structure)
             * It can be proven that if x.left and x.left.left are both black, then x must be red
             */
            if (!this.isRed(x.left) && !this.isRed(x.left.left)) {
                x = this.moveRedLeft(x)
            }

            x.left = this.innerDelete(x.left, key)
        } else {
            // key >= x.key
            // Regardless of whether we ultimately go right, first check: if the left child is red, right-rotate to transfer red to the right
            if (this.isRed(x.left)) {
                x = this.rotateRight(x)
            }

            // As long as right child exists, pass red down first
            // Safe because moveRedRight doesn't modify right subtree structure
            if (x.right && !this.isRed(x.right) && !this.isRed(x.right.left)) {
                x = this.moveRedRight(x)
            }
            
            if (key === x.key) {
                /**
                 * Current node is the one to delete, two cases:
                 * Case 1: Current node has no right child. It can be proven it also has no left child. Delete directly (current node must already be red at this point).
                 * (
                 *  In a left-leaning red-black tree, if a node has no right child and has a left child, that left child must be red,
                 *  and that left child cannot have any children, otherwise red-black tree requirements are violated.
                 *  And for a red left child, a right rotation was performed earlier, moving it to the right.
                 * Case 2: Current node has a right child. Find the successor in the right subtree, copy its content here, then delete the successor.
                 * )
                 */
                if (!x.right) {
                    return null
                }

                // Has right child, find successor, copy its content
                const postNode = this.minimum(x.right)
                x.key = postNode.key
                x.val = postNode.val

                // Delete successor (the minimum node in right subtree)
                x.right = this.innerDeleteMin(x.right)
            } else {
                // key is larger than current node, continue searching in right subtree
                x.right = this.innerDelete(x.right, key)
            }
        }

        this.updateSize(x)

        // Deletion complete, execute balance bottom-up (backtracking)
        return this.balance(x)
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

    protected inorder(x: Node | null, arr: Node[]): Node[] {
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

    protected preorder(x: Node | null, arr: Node[]): Node[] {
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

    protected postorder(x: Node | null, arr: Node[]): Node[] {
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
     * Order statistic: return the i-th smallest node in the tree
     * @param i - Starting from 1
     */
    public osSelect(i: number): Node | null {
        if (i > this._size) {
            return null
        }

        return this.innerOsSelect(this.root, i)
    }

    /**
     * Return the i-th smallest node in subtree x
     * Node x is the (x.left.size + 1)-th smallest node in subtree x
     */
    private innerOsSelect(x: Node, i: number): Node {
        if (!x) {
            return null
        }

        // Position of node x in the subtree
        const pos = x.left ? x.left.size + 1 : 1

        if (i === pos) {
            return x
        }

        if (i < pos) {
            // x's position is greater than i, search in x's left subtree
            return this.innerOsSelect(x.left, i)
        }

        // Search in the right subtree; note that in the right subtree, we search for the (i - pos)-th smallest node
        return this.innerOsSelect(x.right, i - pos)
    }

    /**
     * Order statistic: return the in-order position of node x in the tree (starting from 1). Returns -1 if not found
     * We unfold the tree structure into a sorted array: ...... | ...... | ...x...|......, composed of subarrays. To find x's position,
     * we first find x's position in its subarray (subtree), then add the subarray's offset in the overall array.
     * @param x - the node
     */
    public osRank(x: Node): number {
        if (!this.root) {
            return -1
        }

        return this.innerOsRank(this.root, x)
    }

    /**
     * Find the position of node x in subtree rooted at root
     */
    private innerOsRank(root: Node, x: Node): number {
        if (root === x) {
            // root is x itself, return directly
            return root.left ? root.left.size + 1 : 1
        }

        if (x.key < root.key) {
            // x is smaller than root, search in root's left subtree
            return this.innerOsRank(root.left, x)
        }

        // x >= root, search on the right
        // When searching right, add root's position in the tree (since positions in the right subtree are relative to root)
        return (root.left ? root.left.size + 1 : 1) + this.innerOsRank(root.right, x)
    }
}

export { RedBlackTree, Node }