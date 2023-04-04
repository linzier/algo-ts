/**
 * 红黑树
 * 红黑树是二叉搜索树，是一种用来平衡二叉搜索树的方式
 * 具体来说，它实际上借鉴了 2-3 树（或 2-3-4 树）的思想，或者说是用二叉树来实现 2-3 树。
 * 我们这里实现的红黑树同《算法》中的（而不同于 《算法导论》中的），属于左倾红黑树（红节点只能在左边），其实是对 2-3 树的一种实现。
 * 具备如下性质：
 *  1. 每个节点，要么是红色的，要么是黑色的；
 *  2. 根节点是黑色的；
 *  3. 叶节点都是黑色的（注意这里说的叶节点不是树上真正的叶子节点，而是 null 节点，后面单独说明）；
 *  4. 如果一个节点是红色的，那么它的两个子节点一定都是黑色的（不能出现两个连续的红节点。对应到 2-3 树就是不能出现 4 节点）；
 *  5. 对于每个节点，从该节点到其所有后代叶节点的简单路径上，均包含相同数量的黑节点（对应到 2-3 树就是从根到所有叶节点的简单路径长度相同）；
 *  6. 对于左倾红黑树来说，红色节点只能在左边；
 * 
 * 在代码注释中我们用 (a) 表示红色节点，用 <a> 表示黑色节点，用 [a] 表示不知道是红还是黑的节点，a 表示子树（a 有可能是 null）。
 * 
 * 对性质 3 的说明：
 *  红黑树中所说的叶节点并不是我们通常意义上理解的叶子节点，而是专指 null 节点（或叫 nil 节点），原因如下。
 *  比如有个节点 node = { key: 123, val: 'abc', left: null, right: null }，
 *  在红黑树中，这个 node 并不是叶节点，这里的 node.left 和 node.right 才是叶节点（都是 null）。
 *  也就是说，红黑树中的叶节点仅仅起哨兵的作用。
 *  为何做如此定义？
 *  如图：
 *                      |
 *                     <a>
 *                  /       \
 *                (b)        <c>
 *               /   \      /   \
 *             <d>    <e>  nil  nil
 *            /   \   /  \
 *          nil  nil nil nil
 * 上图中，从节点 a 到所有的 nil 节点构成的简单路径上，黑色节点数量相同（nil 节点也是黑色节点）。
 * 如果我们不加入 nil 节点，而是将树本身的末端节点视为叶子节点，会怎样呢？
 * 此时，我们尝试删掉节点 <e>。删除后，原本 a->e 构成的简单路径直接消失了，那么整棵树剩下的所有路径的黑节点数量仍然相同，所以我们可以说我们
 * 删掉了一棵黑色节点 <e> 却并没有破坏红黑树性质————但这显然是不对的（和 2-3 树比较着看更能发现问题所在）。
 * 加入 null(图中的 nil) 节点后，我们再删 <e>，就会发现 e 所在的两条路径都比别的路径少了一个黑色节点，破坏了红黑树性质。
 * 
 * 红黑树性质的维护主要就是通过左右旋和颜色反转来实现。
 * 在下面定义的三个核心操作方法：rotateLeft、rotateRight、flipColors 都不会改变子树 h 的红黑性质（除了 h 本身的颜色除外）。
 * 之所以限制只有左子节点才能是红色（左倾），从后面的实现（特别是删除）可发现，让右节点永远是黑色能大大简化问题复杂度。
 * 
 * 左倾红黑树中最小节点一定没有任何孩子节点，因为最小节点如果有孩子节点，那一定是只有一个右子节点，但每当我们往右子节点添加一个新的红
 * 节点后，立马需要执行左旋让它变成左倾了。
 * 最大节点最多有一个左红子节点。
 */

import assert from "assert"

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
    color: 'RED' | 'BLACK';
    // 以该节点为根的子树中包含多少个节点（包括该节点），用以实现顺序统计功能
    // 公式：node.size = node.left.size + node.right.size + 1
    size: number;
}

/**
 * 红黑树
 * 为方便起见，这里限制 key 是 number 类型，另外对于查找和删除仅操作第一个匹配的节点
 */
class RedBlackTree {
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
     * 让节点 h 相对于 h.right 执行左旋
     * 左旋不会改变任何路径上黑节点的数量
     * 该操作能保证 h 子树中所有节点的 size 属性能正确更新
     * 左旋之前：h 可能是红色或者黑色；h.right（设为 x） 是红色；
     *                   |
     *                  [h]
     *                 /   \
     *                a     (x)
     *                     /   \
     *                    b     c
     * 
     * 左旋之后：x 变成了原来 h 的颜色（因为站到 h 原来的位置了），h 变成红色；
     *                   |
     *                  [x]
     *                 /   \
     *               (h)    c
     *              /   \
     *             a     b
     * 注意：代码实现中并没有将 p 的父节点的左/右指针指向 x，因为我们没有维护父指针，代码是通过递归实现的（如果用循环实现，则需要父指针）
     * @param h - 需要执行左旋的节点
     * @returns 返回左旋后上面的那个节点 x 以供递归处理
     */
    protected rotateLeft(h: Node): Node {
        assert(h && h.right)

        const x = h.right
        h.right = x.left
        x.left = h

        x.color = h.color
        h.color = 'RED'

        // 更新 size
        this.updateSize(h)
        this.updateSize(x)

        return x
    }

    /**
     * 让节点 h 相对于 h.left 执行右旋
     * 右旋不会改变任何路径上黑节点的数量
     * 该操作能保证 h 子树中所有节点的 size 属性能正确更新
     * 右旋前：h 可能是红色或者黑色，h.left（x）是红色。
     *                |
     *               [h]
     *              /   \
     *            (x)    c
     *           /   \
     *          a     b
     * 
     * 右旋后：x 变成 h 的颜色，h 变成红色；
     *                |
     *               [x]
     *              /   \
     *             a    (h)
     *                 /   \
     *                b     c   
     * 
     * @param h - 需要执行右旋的节点
     * @returns 返回上面的节点 x
     */
    protected rotateRight(h: Node): Node {
        assert(h && h.left)

        const x = h.left
        h.left = x.right
        x.right = h

        x.color = h.color
        h.color = 'RED'

        // 更新 size
        this.updateSize(h)
        this.updateSize(x)

        return x
    }

    /**
     * 翻转颜色
     * 翻转颜色不会改变黑高，因而要求：x 和 y 的颜色必须相同，且和 h 的颜色相反。
     * 
     * （如下以 x、y 是红色、h 是黑色为例）
     * 翻转前：h.color = 'BLACK'; h.left.color = 'RED'; h.right.color = 'RED';
     *                   |
     *                  <h>
     *                 /   \
     *               (x)    (y)
     *              /   \  /   \
     * 
     * 翻转后：h.color = 'RED'; h.left.color = 'BLACK'; h.right.color = 'BLACK';
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
     * 判断节点 node 是否为红色
     * 规定 null 节点是黑色
     */
    protected isRed(node: Node | null): boolean {
        if (!node) {
            return false
        }

        return node.color === 'RED'
    }

    /**
     * 插入元素
     * 从根节点往下找，直到找到合适的位置后插入
     * 
     * @param key - 关键字
     * @param val - 卫星数据
     */
    public insert(key: number, val: unknown) {
        this.root = this.innerInsert(this.root, { key, val })
        this.root.color = 'BLACK'
        this._size++
    }

    /**
     * 递归地往 p 子树插入元素 value，并维护红黑树性质
     * 红黑树的维护：
     * 我们考察子树 p，分三种情况：
     * （注意我们在考察子树 p 时，不用考虑 p 自己的颜色，因为当我们考察 p 的父节点的时候，自然会去考察 p）
     *  我们用 curr 指向当前正在考察的节点。
     *  1. curr 的右节点是红色，左节点是黑色，违反“左倾”原则：执行左旋变成左倾即可；
     *              |                             |
     *     curr -> [p]                   curr -> [y]
     *           /     \                       /     \
     *         <x>     (y)       -->         (p)      d
     *         / \     / \                  /  \      
     *        a   b   c   d               <x>   c
     *                                   /   \
     *                                  a     b
     *     处理结束后，curr 指针指向新子树根。
     *     注意：该场景下，我们不知道旋转后 y 的颜色是什么，如果是黑色则 OK，否则在下一轮递归处理时会继续处理它，所以不用担心。
     *  2. 考察并处理完毕场景 1 后，curr.left 和 curr.left.left 都是红色：此时我们对 curr 执行右旋，转成情况 3;
     *                      |                               |
     *             curr -> [p]                     curr -> [x]
     *                    /   \                          /     \
     *                  (x)    c                       (y)     (p)
     *                 /   \            -->           /       /   \
     *               (y)    b                        a       b     c
     *              /
     *             a
     *      
     *      注意：经过场景 2 的变换（右旋）后，变成场景 3，而场景三会执行颜色翻转操作，而翻转操作要求 x 和 p、y 的颜色不同，这里
     *           y、p 是红色，就要求 x 一定是黑色，所以我们要先证明 x 一定不是红色（否则现在就有三个红色节点，无法执行翻转）。
     *           我们考察一下本轮操作前子树的情况（左边的图）：
     *           由于我们的操作是自下而上递归处理的，所以在我们本轮处理之前，不可能有任何操作变更 curr（也就是 p）的颜色，也就是说，
     *           p 现在的颜色在插入新元素之前是符合红黑树规定的（因为在插入 value 之前整个树一定是合法的红黑树）；
     *           另外，x 和 y 现在都是红色，不符合红黑树规定，说明 x 或者 y 的颜色一定是上一步操作导致的。那么，现在的问题是：上一步
     *           操作是将 x 和 y 都变成了红色呢，还是只将 x 或者 y 中的一个变成了红色？
     *           我们的操作只有左旋、右旋和颜色翻转（而且每轮各操作最多只会执行一次），这三种操作都不可能将一个节点和他的左子节点同时变成红色。
     *           所以，在上一步变换之前，p 位置的左子节点一定是红色的，所以 p 位置一定是黑色的（因为变换之前 p 位置和它的左子节点的颜色
     *           是符合红黑树规定的）。
     *  3. 考察并处理完成场景 2 后，curr.color 是黑色，curr.left.color 和 curr.right.color 都是红色：执行颜色翻转;
     *                 |                               |
     *        curr -> <p>                     curr -> (p)
     *              /     \                         /     \
     *           (x)       (y)      -->           <x>      <y>
     *          /   \     /   \                  /   \    /   \
     *         a     b   c     d                a     b  c     d
     * 
     * @param p 
     * @param value
     * @returns 返回子树 p 新的根（插入并维护红黑性质后，新的根节点不一定还是原来的那个节点了）
     */
    private innerInsert(p: Node | null, value: Value): Node {
        if (p === null) {
            // p 子树是个空指针（空数），创建并返回新节点
            return this.newNode(value.key, value.val)
        }

        // p 是非空子树，则视情况将 value 插入到 p 的左子树或者右子树中
        if (value.key < p.key) {
            p.left = this.innerInsert(p.left, value)
        } else {
            p.right = this.innerInsert(p.right, value)
        }

        // 更新 size
        this.updateSize(p)

        // 修复红黑性质
        return this.balance(p)
    }

    /**
     * 对以 p 为根 的子树执行红黑平衡修复让该子树符合红黑树的性质
     * @param p
     * @returns 修复完成后返回新的根
     */
    private balance(p: Node): Node {
        // 情况一（右倾），执行左旋
        if (!this.isRed(p.left) && this.isRed(p.right)) {
            p = this.rotateLeft(p)
        }

        // 情况二：连续两个左倾的红节点
        if (this.isRed(p.left) && this.isRed(p.left.left)) {
            p = this.rotateRight(p)
        }

        // 情况三：一个黑节点下面挂两个红节点，其中右边的红节点违反了“左倾”原则，通过翻转颜色解决
        if (this.isRed(p.left) && this.isRed(p.right)) {
            this.flipColors(p)
        }

        return p
    }

    protected newNode(key: number, val: unknown): Node {
        return { key, val, left: null, right: null, color: 'RED', size: 1 }
    }

    /**
     * 删除树中最小节点
     * 
     * 删除的逻辑：
     * 对于左倾红黑树来说，最小节点一定没有任何孩子（唯一的右子节点被左旋掉了），所以如果该节点是红色的，那么直接删掉即可，不会改变
     * 该路径上黑色节点数量，红黑树性质仍然保持。
     * 但如果被删除的是黑色节点，则会导致相关路径上黑色节点数量减 1，进而破坏了红黑树的性质。
     * 对于黑节点，有两种解决方案：
     *  1. 删掉该黑节点，然后修复整棵树。该过程会很复杂；
     *  2. 删之前先想办法将该节点变成红节点。此处正是采用此方案；
     * 
     * 如何将某条路径末端的黑节点变成红节点？
     * 对于如下一条从根到叶节点的简单路径：
     * （省略了该树上其他节点）
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
     * 为了将 x 从黑色变成红色，同时让这条路径上黑节点总数不变，可以采用颜色转移的策略：将这条路径上某个红节点的颜色依次
     * 往下传递，最终传给 x，此时 x 变成红节点，原本那个红节点变成黑节点，整体黑节点数量不变。
     * 这里有几个问题：
     *  1. 如何进行颜色传递呢？执行颜色翻转（flipColors）操作即可，我们知道 flipColors 操作不会破坏任何路径上的红黑节点数量；
     *  2. 颜色翻转操作会同时修改左右两个子节点的颜色，会导致右倾的红节点。我们在删除掉 x 节点后再自下而上执行一次 balance 即可；
     *  3. 由于这条路径上的节点还会构建其他路径，在传递颜色的过程中可能会破坏其他路径上黑节点的数量。翻转后，视情况再执行一些旋转
     *     等操作修复对其他路径的破坏；
     *  4. 如果该路径上一个红节点都没有怎么办？可以将根节点变成红色。将根节点变成红色相当于将根到所有叶子节点的简单路径上的黑色节点
     *     树都减 1，并没有破坏红黑树性质。实际上，我们从根开始处理的时候，并不知道这条路径后面到底有没有红色节点，所以当我们判断
     *     root.left 是黑色时，即将 root 的颜色改成红色来保证至少有一个红色可用；
     */
    public deleteMin() {
        if (!this.root) {
            return
        }

        // 当根节点的左子节点不是红色时，将根变成红色，为的是能够有红色节点往下沉
        //（其实严谨点应该还要判断左孙子是否红色，不过不判断也没关系，就算最后根的红色没有下沉，最后再改成黑色即可）
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
     * 删除子树 x 中最小节点，并修复红黑性质
     * @returns 删除并修复后，返回该子树新的根（可能为 null，当子树为空时）
     */
    private innerDeleteMin(x: Node): Node | null {
        // 当 x 没有左节点时（同时肯定也没有右节点），即是最小节点，通过 return null 节点给父节点来实现对该节点的删除
        // 当处理到最小节点的时候，该节点一定已经是红色了（可能自身本来就是红色，可能是通过对父节点执行 moveRedLeft 转移下来的）
        if (!x.left) {
            return null
        }

        /**
         * 否则继续处理左子树（即删除左子树中最小节点，以此递归）
         * 在递归之前，我们要尝试将红色传递给下一个待处理的节点
         * 注意：往下传递红色的前提是：该节点的左儿子和左孙子都必须是黑色的，否则一方面既然下方有红节点，自然没必要传上方
         * 的红色了，另外在这种情况下传递下去会导致破坏红黑树规则（会导致两个相连的红节点出现）
         */
        if (!this.isRed(x.left) && !this.isRed(x.left.left)) {
            x = this.moveRedLeft(x)
        }

        // 递归处理 x.left
        x.left = this.innerDeleteMin(x.left)

        // 更新 x.size
        this.updateSize(x)

        // 删除 x 后，执行 balance 操作（因为 moveRedLeft 可能导致出现右倾的红色节点）
        // 第一次回溯的是 x 的父节点（而不是 x）
        return this.balance(x)
    }

    /**
     * 将顶点 x 的红色传递给 x 的左子节点，可能需要修复红黑性质
     * 能够调此函数的前提是 x 必须是红色
     * 该函数执行后，x.left 一定是红色的
     * 注意：该操作可能会带来右倾的红节点，这是由翻转导致的，在此处无法解决（除非再翻转一遍，但这样的话红色就无法向下传递了），
     * 此处不解决此问题，而是留给回溯阶段解决
     * 
     * 注意：moveRedLeft 不会修改 x 的左子树的结构（但可能会修改右子树的结构），这很重要
     * 该操作能保证 x 子树中所有节点的 size 能正确更新
     * 
     * @returns 传递并修复后返回该子树新的根（可能不是原来那个了）
     */
    private moveRedLeft(x: Node): Node {
        assert(x.left)
        assert(this.isRed(x) && !this.isRed(x.left) && !this.isRed(x.left.left))

        // 既然 x 是红色，那么 x 的左右节点肯定都是黑色，执行翻转
        this.flipColors(x)

        /**
         * 翻转后可能会导致两个连续的红色节点出现：
         *               |                                 |
         *              (x)                               <x>
         *            /     \                           /     \
         *          <y>      <z>                      (y)      (z)
         *         /  \     /    \       -->         /   \    /   \ 
         *       <a>      (b)     <c>              <a>      (b)    <z>
         *      /   \    /  \    /   \            /   \    /   \  /   \
         * 如上，翻转后 z 和 b 都是红色。
         * 可以通过 z = rotateRight(z) -> x = rotateLeft(x) -> flipColors(x) 来解决。
         */
        if (x.right && this.isRed(x.right.left)) {
            x.right = this.rotateRight(x.right)
            // 先更新 x.size
            this.updateSize(x)
            x = this.rotateLeft(x)
            this.flipColors(x)
        }

        return x
    }

    /**
     * 删除数中最大节点
     * 最大节点一定是黑色的（否则就违背了左倾原则），且其最多有一个红色左子节点（可以通过给某个没有任何子节点的最大节点添加子节点
     * 来模拟证明此结论，经过三个修复操作处理后，其如果存在左子节点，则该子节点不可能是黑色的。）
     * 思路和删除最小节点类似，也是从根节点开始向下传递红色节点，最终将待删除的节点变成红色然后删除，从而不影响路径上的黑色节点数
     * 不同的是，最大节点在右侧，而且可能会存在一个左子节点。而左倾红黑树所有红色节点都在左边。所以要想沿最右侧路径传递红色，必须
     * 对相关左倾的红色节点执行右旋。
     */
    public deleteMax() {
        if (!this.root) {
            return
        }

        if (!this.isRed(this.root.left)) {
            // 如果根节点的左子节点是黑色，则将根变成红色，以便有一个红节点可以往下传递
            this.root.color = 'RED'
        }

        this.root = this.innerDeleteMax(this.root)

        if (this.root) {
            this.root.color = 'BLACK'
        }

        this._size--
    }

    /**
     * 删除 x 子树中最大节点，并返回删除并修复后的子树的新根
     */
    private innerDeleteMax(x: Node): Node | null {
        // 如果左子节点是红色，则先执行右旋将该红色转移到右边
        // 该操作还有个作用：当最大节点存在左子节点（一定是红色）时，通过右旋将该左子节点去掉，让要删除的节点无子节点，简化删除操作
        if (this.isRed(x.left)) {
            x = this.rotateRight(x)
        }

        // 当 x 没有右节点时，便是最大的那个，执行删除
        // 当操作 x 时，该节点一定已经是红色了（可能自身本来就是红色，可能是通过对父节点执行 moveRedRight 转移下来的）
        if (!x.right) {
            return null
        }

        // x 存在右子节点，则递归处理右子树
        // 递归之前，要将 x 的红色传递给右子节点
        if (!this.isRed(x.right) && !this.isRed(x.right.left)) {
            x = this.moveRedRight(x)
        }

        // 递归处理右子节点
        x.right = this.innerDeleteMax(x.right)

        // 更新 x.size
        this.updateSize(x)

        // 删除后，执行 balance 恢复红黑树性质
        // 因为 moveRedRight 的过程可能带来右倾的红节点
        return this.balance(x)
    }

    /**
     * 将节点 x 的红色转移给它的右节点
     * 前提：1. x 是红色；2. x.right 和 x.right.left 都是黑色
     * （而且 x.left 也一定是黑色的，因为如果 x.left 是红色的，则前面会执行右旋将其变成黑色）
     * 操作后，x.right 是红色。
     * 
     * 该操作不会修改 x 的右子树的结构。
     * 
     * @returns 转移后子树新根
     */
    private moveRedRight(x: Node): Node {
        assert(x.right)
        assert(this.isRed(x))
        assert(!this.isRed(x.right) && !this.isRed(x.right.left))

        // 翻转颜色
        this.flipColors(x)

        /**
         * 翻转后，下面的情况会带来两个连续的红色节点（a 和 c），不符合红黑树性质，需要修正:
         *              |                                    |
         *             (x)                                  <x>
         *           /     \                              /     \
         *         <a>      <y>       -->               (a)      (y)
         *        /   \     /  \                       /   \    /   \
         *      (c)   <d> <z>   <b>                  (c)   <d> <z>   <b>
         *     /  \   /  \                          /   \  /  \
         * 修复操作：x = rotateRight(x) -> flipColors(x)
         */
        if (this.isRed(x.left.left)) {
            x = this.rotateRight(x)
            this.flipColors(x)
        }

        return x
    }

    /**
     * 删除关键字 key 所在的（第一个）节点
     * 如果待删除的节点没有子节点，则变成红色后直接删除；
     * 否则，和普通二叉搜索树一样，将该节点的后继节点的值复制过来，然后删除后继节点；
     * 
     * 和 deleteMin、deleteMax 的思想一致，也是从根节点开始往下探查，同时将红色往下传递，直到传给待删除的节点。
     * 
     * @param key
     */
    public delete(key: number) {
        // 先看树中是否包含 key
        if (!this.root || !this.searchNode(key)) {
            return
        }

        // 如果root.left 不是红色，则将 root 改成红色，保证下探的过程中有红色节点往下转移
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
     * 删除子树 x 中第一个等于 key 的节点，并修复红黑树性质，返回子树新的根
     */
    private innerDelete(x: Node, key: number): Node {
        if (key < x.key) {
            /**
             * 待删除的节点在 x 的左边，由于前面判断了 key 一定存在，所以此时 x.left 一定存在
             * 往左边下探之前，将红色传递下去（因为 moveRedLeft 不会修改左子树结构，所以是安全的）
             * 可以证明，如果 x.left 和 x.left.left 都是黑色，那么 x 一定是红色
             */
            if (!this.isRed(x.left) && !this.isRed(x.left.left)) {
                x = this.moveRedLeft(x)
            }

            x.left = this.innerDelete(x.left, key)
        } else {
            // key >= x.key
            // 此时无论最终要不要往右边走，先判断一下，如果左子结点是红色，先执行右旋，将红色转到右边
            if (this.isRed(x.left)) {
                x = this.rotateRight(x)
            }

            // 只要存在右子节点，先把红色传下去
            // 因为 moveRedRight 不会修改右子树的结构，所以该操作是安全的
            if (x.right && !this.isRed(x.right) && !this.isRed(x.right.left)) {
                x = this.moveRedRight(x)
            }
            
            if (key === x.key) {
                /**
                 * 当前节点就是要删除的节点，有两种情况
                 * 情况一：当前节点没有右子节点，可以证明该节点也一定没有左子节点，此时直接删除即可（此时当前节点一定已经变成了红色）。
                 * (
                 *  因为在左倾红黑树中，如果一个节点没有右子节点，那么如果它有左子结点，其左子节点一定是红色，
                 *  且该左子结点不能再有任何子节点，否则不满足红黑树要求。
                 *  而对于红色左子节点，前面执行了右旋，会跑到右边。
                 * 情况二：当前节点有右子节点，则要先从右子树中找到当前节点的后继节点，将其内容复制过来，然后删掉该后继节点。
                 * )
                 */
                if (!x.right) {
                    return null
                }

                // 有右子节点，找到后继，将内容复制过来
                const postNode = this.minimum(x.right)
                x.key = postNode.key
                x.val = postNode.val

                // 删除后继节点（也就是右子树中最小节点）
                x.right = this.innerDeleteMin(x.right)
            } else {
                // key 比当前节点大，需要继续到右子树中找
                x.right = this.innerDelete(x.right, key)
            }
        }

        this.updateSize(x)

        // 删除完毕，从下往上（回溯）执行 balance
        return this.balance(x)
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

    protected inorder(x: Node | null, arr: Node[]): Node[] {
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

    protected preorder(x: Node | null, arr: Node[]): Node[] {
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

    protected postorder(x: Node | null, arr: Node[]): Node[] {
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
     * 顺序统计：返回树中第 i 小的节点
     * @param i - 从 1 开始
     */
    public osSelect(i: number): Node | null {
        if (i > this._size) {
            return null
        }

        return this.innerOsSelect(this.root, i)
    }

    /**
     * 返回 x 子树中第 i 小的节点
     * x 节点是 x 子树中第 x.left.size + 1 小的节点
     */
    private innerOsSelect(x: Node, i: number): Node {
        if (!x) {
            return null
        }

        // x 节点在子树中的位置
        const pos = x.left ? x.left.size + 1 : 1

        if (i === pos) {
            return x
        }

        if (i < pos) {
            // x 的位置大于 i，则去 x 的左子树中查找
            return this.innerOsSelect(x.left, i)
        }

        // 到右子树中查找，注意此时在右子树中要查找的是 i - pos 小的节点
        return this.innerOsSelect(x.right, i - pos)
    }

    /**
     * 顺序统计：返回节点 x 在树中按中序遍历所在的位置（从 1 开始计算）。如果不存在，则返回 -1
     * 我们将树形结构展开为有序数组：...... | ...... | ...x...|......，由一系列子数组构成，要求的 x 的位置，
     * 需先求出 x 在其子数组（子树）中的位置，然后加上该子数组在整个数组中的偏移量。
     * @param x - 节点
     */
    public osRank(x: Node): number {
        if (!this.root) {
            return -1
        }

        return this.innerOsRank(this.root, x)
    }

    /**
     * 求节点 x 在 root 子树中的位置
     */
    private innerOsRank(root: Node, x: Node): number {
        if (root === x) {
            // root 就是 x 自身，直接返回
            return root.left ? root.left.size + 1 : 1
        }

        if (x.key < root.key) {
            // x 比 root 小，到 root 的左子树查找
            return this.innerOsRank(root.left, x)
        }

        // x >= root，去右边查
        // 去右边查的时候，需要加上 root 节点在树中的位置（因为右子树中元素的位置是相对于 root 的）
        return (root.left ? root.left.size + 1 : 1) + this.innerOsRank(root.right, x)
    }
}

export { RedBlackTree, Node }