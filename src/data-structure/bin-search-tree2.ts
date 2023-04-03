/**
 * 二叉搜索树（递归法实现）
 * 二叉搜索树是一个二叉树，具备如下特点：
 *  1. 每个节点有两个指针：left(指向左孩子)、right(指向右孩子)；
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
    left: Node | null;
    right: Node | null;
}

/**
 * 二叉搜索树
 * 为方便起见，这里限制 key 是 number 类型，另外对于查找和删除仅操作第一个匹配的节点
 */
class BinSearchTree {
    protected root: Node | null
    // 树节点数量
    protected _size: number

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
    protected innerDepth(root: Node | null, currDepth: number): number {
        if (!root || !root.left && !root.right) {
            return currDepth
        }

        // 分别计算左右子树的高度，取最大的
        const leftDepth = this.innerDepth(root.left, currDepth + 1)
        const rightDepth = this.innerDepth(root.right, currDepth + 1)

        return Math.max(leftDepth, rightDepth)
    }

    /**
     * 将元素 data 插入到树中
     */
    public insert(key: number, val: unknown) {
        // 从根节点开始处理（即将 val 插入到整个二叉树中）
        // 插入完成后，将新子树（这里是整棵二叉树）的根赋值给 root
        this.root = this.innerInsert({ key, val }, this.root)
        this._size++
    }
    
    /**
     * 将元素 data 插入到以 node 为根的子树中
     * 返回插入元素后的子树的根节点
     */
    private innerInsert(data: Value, node: Node): Node {
        if (node === null) {
            // 遇到了 null 节点，说明需要插入到该位置
            return { ...data, left: null, right: null }
        }
        
        // 比较 data 和 node 的值，视情况做处理
        if (data.key < node.key) {
            // 待插入的元素小于当前节点，需要插入到当前节点的左子树中
            node.left = this.innerInsert(data, node.left)
        } else {
            // 插入到右子树中
            node.right = this.innerInsert(data, node.right)
        }
        
        // 插入完成后，需返回当前节点
        return node
    }

    /**
     * 删除 key 对应的节点
     */
    delete(key: number) {
        const node = this.searchNode(key)
        if (!node) {
            // key 不存在
            return
        }
        
        this.root = this.innerDelete(this.root, node)
        this._size--
    }
    
     /**
     * 删除子树 current 中 del 节点，并返回操作完成后的子树根节点
     */
    innerDelete(current: Node, del: Node): Node {
        /**
         * 当前节点即为待删除节点
         */
        if (current === del) {
            // 情况一：当前节点没有任何子节点，直接删除
            if (!current.left && !current.right) {
                return null
            }
            
            // 情况二：只有一个子节点
            if (current.left && !current.right) {
                // 只有左子节点，用左子节点替换当前节点
                return current.left
            }
            
            if (current.right && !current.left) {
                // 只有右子节点，用右子节点替换当前节点
                return current.right
            }
            
            // 情况三：有两个子节点
            // 取右子树的最小节点
            const minNode = this.minimum(current.right)
            // 用最小节点的值替换当前节点的
            current.key = minNode?.key
            current.val = minNode?.val
            // 删除右子树中的最小节点
            current.right = this.innerDelete(current.right, minNode)

            return current
        }
        
        /**
         * 当前节点不是待删除节点，视情况递归从左或右子树中删除
         */
        if (del.key < current.key) {
            // 待删除节点小于当前节点，从左子树删除
            current.left = this.innerDelete(current.left, del)
        } else {
            // 待删除节点大于当前节点，继续从右子树删除
            current.right = this.innerDelete(current.right, del)
        }
        
        return current
    }

    /**
     * 根据关键字 key 查找第一个匹配的元素，返回对应的 val。如果没找到则返回 undefined 
     */
    public search(key: number): unknown {
        const node = this.searchNode(key)

        return node ? node.val : undefined
    }

    /**
     * 在以 node 为根的子树中搜索关键字为 key 的节点并返回该节点
     * 如果没有找到则返回 null
     */
    public searchNode(key: number, node: Node = undefined): Node | null {
        // 默认取根
        node = node === undefined ? this.root : node
        
        // 遇到 null 节点，说明没搜到，返回 null
        if (!node) {
            return null
        }
        
        // 先判断当前节点
        if (node.key === key) {
            // 找到，即可返回
            return node
        }
        
        // 没有找到，则视情况继续搜索左右子树
        if (key < node.key) {
            // 目标值小于当前节点，到左子树中搜索
            return this.searchNode(key, node.left)
        }
        
        // 目标值大于等于当前节点，到右子树中搜索
        return this.searchNode(key, node.right)
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

    protected inorder(x: Node | null, arr: Node[]) {
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

    protected preorder(x: Node | null, arr: Node[]) {
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

    protected postorder(x: Node | null, arr: Node[]) {
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
     * 获取以 node 为根的子树中最小元素
     * 不断获取左孩子节点，直到某个元素没有左孩子节点为止
     * 示例树的最小值是 2
     */
    public minimum(node?: Node): Node | null {
        // 默认取根节点
        node = node === undefined ? this.root : node
        
        if (node === null || !node.left) {
            // 如果是空子树，或者 node.left 是空节点，则返回
            return node
        }
        
        // 存在左子树，继续往左子树中找
        return this.minimum(node.left)
    }

    /**
     * 获取以 node 为根的子树中最大元素
     * 不断获取右孩子节点，直到某个元素没有右孩子节点为止
     * 示例树的最大值是 20
     */
    public maximum(node?: Node): Node | null {
        // 默认取根节点
        node = node === undefined ? this.root : node
        
        if (node === null || !node.right) {
            // 如果是空子树，或者 node.right 是空节点，则返回
            return node
        }
        
        // 存在左子树，继续往左子树中找
        return this.maximum(node.right)
    }

    /**
     * 按序返回所有大于等于 start 且小于等于 end 的节点集合
     */
    public range(start: number, end: number): Node[] {
        const arr: Node[] = []
        this.innerRange(this.root, start, end, arr)
        return arr
    }
    
    /**
     * 在 x 子树中查找所有大于等于 start 且小于等于 end 的节点并放入 arr 中
     */
    private innerRange(x: Node, start: number, end: number, arr: Node[]) {
        if (!x) {
            return
        }
        
        // 比较节点 x 和 start、end 之间的大小关系
        const greaterThanStart = x.key >= start
        const smallerThanEnd = x.key <= end

        // 如果当前节点大于等于 start，则需要搜索其左子树
        if (greaterThanStart) {
            this.innerRange(x.left, start, end, arr)
        }
        
        // 如果 x 在 start 和 end 之间，则符合条件，存入 arr
        if (greaterThanStart && smallerThanEnd) {
            arr.push(x)
        }
        
        // 如果当前节点小于等于 end，则需要搜索其右子树
        if (smallerThanEnd) {
            this.innerRange(x.right, start, end, arr)   
        }
    }
}

export { BinSearchTree }