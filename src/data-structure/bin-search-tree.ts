/**
 * 二叉搜索树
 * 二叉搜索树是一个二叉树，具备如下特点：
 *  1. 每个节点有三个指针：parent(指向父节点)、left(指向左孩子)、right(指向右孩子)；
 *  2. 每个节点有额外两个属性：key - 关键字；val - 卫星数据；
 *  3. 对于任意节点 x，有：
 *     x.key >= x.left.key;
 *     x.key <= x.right.key;
 *  4. 对第 3 点引申：
 *     4.1 对于任何节点 x，x.key 大于等于 x.left 所构成的子树上的任何节点的 key; 
 *     4.2 对于任何节点 x，x.key 小于等于 x.right 所构成的子树上的任何节点的 key;
 *     4.3 任何两个相连接的节点（如下图中 15 和 6、6 和 7），无论其父子关系如何，左边的永远小于等于右边的；
 * 
 * 例：
 *                           15
 *                       /        \ 
 *                     6            18
 *                  /     \        /  \
 *                 3       7     17    20
 *               /  \       \
 *              2    4       13
 *                          /
 *                         9
 * 下面的操作皆以此二叉树为例说明。
 */

interface Value {
    key: number;
    val: unknown;
}

/**
 * 定义树的节点
 */
interface Node extends Value {
    parent: Node | null;
    left: Node | null;
    right: Node | null;
    // 特殊标记，insert 时用到
    // insert: 当 key 值相等时，如果 flag = true 则插入到左子节点，否则插入到右子节点
    flag: boolean;
}

/**
 * 二叉搜索树
 * 为方便起见，这里限制 key 是 number 类型，另外对于查找和删除仅操作第一个匹配的节点
 */
class BinSearchTree {
    private root: Node | null
    // 树节点数量
    private _size: number

    public constructor() {
        this.root = null
        this._size = 0
    }

    public size(): number {
        return this._size
    }

    /**
     * 树高度
     * 用求最大深度的方式求高度
     */
    public height(): number {
        return this.innerDepth(this.root, 0)
    }

    /**
     * 计算 root 子树的最大深度
     * currDepth 表示 root 所处的深度
     */
    private innerDepth(root: Node | null, currDepth: number): number {
        if (!root || !root.left && !root.right) {
            return currDepth
        }

        // 分别计算左右子树的高度，取最大的
        const leftDepth = this.innerDepth(root.left, currDepth + 1)
        const rightDepth = this.innerDepth(root.right, currDepth + 1)

        return Math.max(leftDepth, rightDepth)
    }

    /**
     * 插入元素
     * 从根节点往下找，直到找到合适的位置后插入
     * 如在示例树中插入关键字 5，则探查路径是 15->6->3->4，最终作为 4 的右子节点
     * 
     * @param key - 关键字
     * @param val - 卫星数据
     * @returns 为插入的元素生辰的树节点
     */
    public insert(key: number, val: unknown): Node {
        if (!this.root) {
            this._size++
            return this.root = this.newNode(key, val)
        }

        // 从根节点开始，只要 curr 节点不为 null，就往下找
        let curr = this.root
        let parent = curr.parent
        while (curr) {
            // 在深入 curr 之前，记录原本值作为父节点
            parent = curr

            if (key === curr.key) {
                // 反转 flag，这样下次再有同 key 的话就会插入到另一边，防止都插入到一边造成倾斜
                curr.flag = !curr.flag
                // key 相同，则视情况插入到左边或右边
                curr = !curr.flag ? curr.left : curr.right
            } else if (key < curr.key) {
                // 小于当前节点的 key，放到当前节点的左边（左子树）
                curr = curr.left
            } else {
                curr = curr.right
            }
        }

        // 至此，curr = null，注意 parent 不可能是 null（最开始已经处理了空树的情况）
        // 将新 node 作为 parent 的左孩子或者右孩子插入
        const node = this.newNode(key, val)
        if (key == parent.key) {
            // 注意：parent.flag 做了一次翻转，所以这里要再次反转变回原来的值
            !parent.flag ? (parent.left = node) : (parent.right = node)
        } else if (key < parent.key) {
            // 放左边
            parent.left = node
        } else {
            parent.right = node
        }

        node.parent = parent
        this._size++
    }

    private newNode(key: number, val: unknown): Node {
        return { key, val, parent: null, left: null, right: null, flag: true }
    }

    /**
     * 删除关键字 key 所在的（第一个）节点（设为 x），并返回该节点
     * 分三种情况：
     *  1. x 没有任何子节点，则直接删除 x 即可（如删除示例树中的 4）；
     *  2. x 有一个子节点（左或右），则直接用该子节点替代 x 即可（如删除示例树中的 7 或 13）；
     *  3. x 有两个子节点。我们需要从某个地方弄一个节点（y）来替代 x，要求 y 比 x 的任何左子树中元素都要大，
     *     同时比任何右子树中的元素都要小。有两个节点可以满足要求：x 左子树中最大节点，或者 x 右子树中最小节点。
     *     我们用右子树中最大节点替换 x。
     *     （如删除示例树中的 6 后，用 7 替换上）
     * 
     * @param key
     */
    public delete(key: number): Node | null {
        const node = this.searchNode(key)
        if (!node) {
            return null
        }

        // 如果 node 没有左子节点，则用其右子树替代之；反之亦然
        // 这里包括同时没有左节点和右节点的情况
        if (!node.left) {
            this.transplant(node, node.right)
        } else if (!node.right) {
            this.transplant(node, node.left)
        } else {
            // node 同时存在左子节点和右子节点
            // 从右子树找到最小节点
            const sub = this.minimum(node.right)

            if (sub.parent != node) {
                // 当 sub 不是 node 的右子节点时，要先将 sub 的右子树和 sub 交换（注意 sub 没有左子节点）
                this.transplant(sub, sub.right)
                // 更新 sub 的 right
                sub.right = node.right
                sub.right.parent = sub
            }

            // 将 sub 和 node 交换
            this.transplant(node, sub)
            // 更新 sub 的 left
            sub.left = node.left
            sub.left.parent = sub
        }

        // 解除 node 的指针
        node.parent = node.left = node.right = null
        this._size--

        return node
    }

    /**
     * 用 y 子树替换 x 子树
     */
    private transplant(x: Node, y: Node | null) {
        // 更新 x.parent
        if (!x.parent) {
            // x 是根节点
            this.root = y
        } else if (x.parent.left == x) {
            // x 是 左子节点
            x.parent.left = y
        } else {
            // x 是右子节点
            x.parent.right = y
        }

        if (y) {
            // 更新 y.parent
            y.parent = x.parent
        }
    }

    /**
     * 根据关键字 key 查找第一个匹配的元素，返回对应的 val。如果没找到则返回 undefined 
     */
    public search(key: number): unknown {
        const node = this.searchNode(key)

        return node ? node.val : undefined
    }

    /**
     * 根据关键字 key 查找第一个匹配的元素，返回对应的 Node。如果没找到则返回 null
     * 此处采用非递归写法
     */
    public searchNode(key: number): Node | null {
        let curr = this.root
        while (curr && curr.key !== key) {
            // curr 存在且 key 不相同，则视情况去左子树或者右子树找
            if (key < curr.key) {
                curr = curr.left
            } else {
                curr = curr.right
            }
        }

        return curr
    }

    /**
     * 中序遍历
     * 先打印左子树，再打印自己，最后打印右子树（所谓“中”即是在中间打印自己）
     * 中序遍历可以实现排序
     * 示例树的中序遍历：2, 3, 4, 6, 7, 9, 13, 15, 17, 18, 20
     */
    public inorderWalk(): Node[] {
        const arr: Node[] = []
        this.inorder(this.root, arr)

        return arr
    }

    private inorder(x: Node | null, arr: Node[]): Node[] {
        if (!x) {
            return
        }

        // 先输出左子树
        this.inorder(x.left, arr)
        // 自身
        arr.push(x)
        // 右子树
        this.inorder(x.right, arr)
    }

    /**
     * 先序遍历
     * 先打印自身，再打印左节点，最后打印右子树
     * 先序遍历反映了一种构成此树结构的插入顺序
     * 示例树的先序遍历：15, 6, 3, 2, 4, 7, 13, 9, 18, 17, 20
     */
    public preorderWalk(): Node[] {
        const arr: Node[] = []
        this.preorder(this.root, arr)

        return arr
    }

    private preorder(x: Node | null, arr: Node[]): Node[] {
        if (!x) {
            return
        }

        // 自身
        arr.push(x)
        // 左子树
        this.preorder(x.left, arr)
        // 右子树
        this.preorder(x.right, arr)
    }

    /**
     * 后序遍历
     * 先打印左子树，再打印右子树，最后打印自身
     * 示例树的后序遍历：2, 4, 3, 9, 13, 7, 6, 17, 20, 18, 15
     */
    public postorderWalk(): Node[] {
        const arr: Node[] = []
        this.postorder(this.root, arr)

        return arr
    }

    private postorder(x: Node | null, arr: Node[]): Node[] {
        if (!x) {
            return
        }

        // 左子树
        this.postorder(x.left, arr)
        // 右子树
        this.postorder(x.right, arr)
        // 自身
        arr.push(x)
    }

    /**
     * 获取以 root 为根的子树中最小元素
     * 不断获取左孩子节点，直到某个元素没有左孩子节点为止
     * 示例树的最小值是 2
     */
    public minimum(root?: Node): Node | null {
        let curr = root || this.root
        while (curr && curr.left) {
            curr = curr.left
        }

        return curr
    }

    /**
     * 获取以 root 为根的子树中最大元素
     * 不断获取右孩子节点，直到某个元素没有右孩子节点为止
     * 示例树的最大值是 20
     */
    public maximum(root?: Node): Node | null {
        let curr = root || this.root
        while (curr && curr.right) {
            curr = curr.right
        }

        return curr
    }

    /**
     * 获取节点 x 的后继节点，即大于 x 的最小的节点
     * 分两种情况：
     *  1. x 有右子节点（右子树），则取右子树中最小的值，如示例树中 15 的后继节点是 17；
     *  2. x 没有右子节点，则从 x 开始顺着 x 的祖先节点递归向上找，直到找到最近的一个 p1，p1 是 p2 的左子节点，则 p2 就是 x 的后继节点。
     *     因为如果一路找上去都属于右子节点（即 x -> x.p -> x.p.p 这样的路线中，x.p == x.p.p.left，x == x.p.left，说明
     *     x > x.p > x.p.p），这些节点是不符合条件的；当找到一个 x.p.p.p，其 x.p.p.p.left = x.p.p，也就是 x.p.p 属于 x.p.p.p
     *     的左子树，而左子树上任何节点（包括 x）都小于其值，因而 x < x.p.p.p，也就是找到了大于 x 的最近的一个节点，即 x 的后继节点。
     *     （上式中 x.p 表示 x 的父节点）
     *     如示例树中 13 的后继节点是 15。
     */
    public successor(x?: Node): Node | null {
        x = x || this.root

        if (!x) {
            return null
        }

        // 存在右子节点，则取右子树中的最小值
        if (x.right) {
            return this.minimum(x.right)
        }

        // 没有右子节点，往上找 parent
        let curr = x
        while (curr) {
            if (curr.parent && curr.parent.left == curr) {
                // curr 是其父节点的左子节点，则该父节点就是后继
                return curr.parent
            }

            // 递归往上找
            curr = curr.parent
        }

        return curr
    }

    /**
     * 获取节点 x 的前驱节点，即小于 x 的最大的节点
     * 分两种情况：
     *  1. x 有左子节点，则其前驱是左子树中最大值节点；
     *  2. x 没有左子节点，则从 x 开始顺着 x 的祖先节点递归向上找，直到找到最近的一个 p1，p1 是 p2 的右子节点，则 p2 就是 x 的前驱节点。
     *     理由同上。
     *     示例树中 17 的前驱节点是 15。
     */
    public predecessor(x?: Node): Node | null {
        x = x || this.root

        if (!x) {
            return null
        }

        // 存在左子节点，则取左子树中最大值
        if (x.left) {
            return this.maximum(x.left)
        }

        // 没有左子节点，往上找 parent
        let curr = x
        while (curr) {
            if (curr.parent && curr.parent.right == curr) {
                // curr 是其父节点的右子节点，则该父节点就是前驱
                return curr.parent
            }

            // 递归往上找
            curr = curr.parent
        }

        return curr
    }

    /**
     * 基于已排好序（根据 key）的数组 arr 构建平衡的二叉搜索树
     * 对于已经排好序的数组，如果我们按顺序调用 insert，则会得到一个线性链表，为避免这种
     * 情况，我们利用二分思想，对数组从中间一分为二，然后分别利用左子数组和右子数组来递归
     * 地构建左右子树，这样便得到一棵平衡二叉树
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
     * 基于子数组 arr[start:end] 构建一棵以 node 为根节点的二叉树，返回根节点 node
     */
    private static innerBuildFromOrderdArray(arr: Value[], start: number, end: number): Node | null {
        if (start > end) {
            // 空
            return null
        } else if (start == end) {
            // 只剩下一个元素了，则直接返回一个节点
            return { ...arr[start], parent: null, left: null, right: null, flag: true }
        }

        const mid = start + Math.floor((end - start) / 2)
        // 当前节点
        const curr: Node = { ...arr[mid], parent: null, left: null, right: null, flag: true }
        // 左子树
        const left = this.innerBuildFromOrderdArray(arr, start, mid - 1)
        // 右子树
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