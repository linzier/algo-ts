/**
 * 堆（这里指二叉堆）
 * 堆是一棵完全二叉树（除最后一层外，树是满的；最后一层元素从左到右依次排列）。
 * 如图：
 *                               16
 *                            /      \
 *                          14        10
 *                         /   \     /  \
 *                        8      7  9    3
 *                      /  \    /
 *                     2    4  1
 * 
 * 完全二叉树可以用数组表示，父子元素下标之间存在如下关系：
 * （为了方便运算，不使用数组第一个元素，元素下标从 1 开始）
 * 基于父元素下标 p 推算子元素：
 *      左子元素下标：l = 2p;
 *      右子元素下标：r = 2p + 1;
 * 基于子元素下标 c（无论左子元素或者右子元素） 推算父元素下标 p：
 *      p = floor(c/2);
 * 
 * 注：代码中通过左右位移来实现与 2 乘除运算（右移即除 2，左移即乘 2）。
 * 
 * 大顶堆：对于堆中的任意子树，树中父节点值大于等于子节点值（树根是最大的元素）；
 * 小顶堆：对于堆中的任意子树，树中父节点值小于等于子节点值（树根是最小的元素）；
 * 
 * 为方便描述，下面注释中用:
 *  TREE(i) 表示由节点 i 作为根节点构成的子树;
 *  LEFT(i) 表示 i 的左子节点;
 *  RIGHT(i) 表示 i 的右子节点;
 *  PARENT(i) 表示 i 的父节点;
 */
class Heap {
    protected data: number[]
    // 堆中元素数量
    protected _size: number
    // 是否大顶堆
    protected isMax: boolean

    /**
     * 基于 data 数组构建堆
     * 注意：该操作会修改外面的 data 数组，如果不想这样，外面需要传入数组的复制
     * 
     * @param data - 用于构建堆的数组
     * @param isMax - 是否大顶堆
     */
    public constructor(data: number[], isMax: boolean) {
        this.isMax = isMax
        this._size = data.length
        this.data = data
        // 第一个位置不用
        this.data.unshift(0)

        // 构建堆
        this.build()
    }

    public size(): number {
        return this._size
    }

    public isEmpty(): boolean {
        return this._size == 0
    }

    /**
     * 弹出堆顶元素
     * 弹出后，从堆尾拿一个元素放到堆顶，然后对堆顶执行 heapify
     */
    public pop(): number {
        if (this._size == 0) {
            throw new Error('heap is empty')
        }

        // 取出第一个元素（堆顶）
        const ele = this.data[1]
        // 将最后一个元素放到堆顶
        this.data[1] = this.data.pop() as number
        this._size -= 1

        /**
         * 将最后一个元素放到堆顶后，新堆顶可能不再满足堆的性质，需要执行堆化
         * 之所以从堆尾拿一个元素填到堆顶：假设我们从其它地方（如原堆顶的左/右子节点）拿元素填到堆顶，那么就会破坏下方
         * 子树的结构，从而造成连锁反应（需要不断向下拿）。
         * 从堆尾拿元素，因为堆尾节点下面没有子节点（也没有右邻居节点），因而不会产生这种级联影响，能保证整个堆除了根以外
         * 的其他任何子树仍然满足堆的性质，从而我们对堆顶执行 heapify 即可。
         */
        this.heapify(1)

        return ele
    }

    /**
     * 往堆中添加元素
     * 先将元素加到堆尾，然后类似插入排序思想，顺着该元素的父节点递归向上找到适合它的位置插入即可。
     * （对于大顶堆，就是向上找到位置 i，data[i] < ele 且 PARENT(i) >= ele）
     * （一个节点，顺着其父节点递归向上是已经排好序的） 
     * @returns 返回元素 ele 被插入到的节点位置
     */
    public push(ele: number): number {
        // 将元素加到末尾
        this.data.push(ele)
        this._size += 1

        // 让末尾元素向上“冒泡”到合适的位置
        return this.bubble(this._size)
    }

    /**
     * 从 i 位置开始顺着父节点链“冒泡”，找到 data[i] 应插入的合适的位置
     * 思想同插入排序
     * @returns 返回原 i 位置的元素 bubble 后所在的新位置 j
     */
    protected bubble(i: number): number {
        if (i == 1) {
            return 1
        }

        // 将 i 位置的元素暂存起来，避免每次都要执行三次赋值来交换数据
        const curr = this.data[i]

        do {
            // 父节点位置
            const parent = i >> 1

            if (this.isMax && this.data[parent] >= curr || !this.isMax && this.data[parent] <= curr) {
                // 符合条件了，将 curr 赋值到该位置，结束
                this.data[i] = curr
                return i
            }

            // i 位置的元素不符合堆的条件，将 parent 的元素往下挪到 i 的位置，继续向上找
            this.data[i] = this.data[parent]
            i = parent
        } while (i > 1)

        // 如果走到这里（根），说明整个父节点链上元素都大于/小于（取决于是大顶堆还是小顶堆） i 元素，则将 i 元素设置为根
        this.data[1] = curr
        return 1
    }

    /**
     * 建堆
     * 建堆就是自底向上、自右向左依次对每棵子树执行堆化
     * 第一个执行堆化的子树是 TREE[size/2]（倒数第二层自右向左数第一个非叶子节点构成的子树）
     * 最后一个执行堆化的子树是 TREE[0]（也就是整个树的根）
     * 
     * 之所以要自底向上依次堆化，参见堆化函数的说明即可知，对子树 TREE(i) heapify 之前，其左右子节点 LEFT(i) 和 RIGHT(i) 所
     * 构成的子树必须已经完成堆化。
     */
    protected build() {
        for (let i = this._size >> 1; i > 0; i--) {
            this.heapify(i)
        }
    }

    /**
     * 对子树 TREE(i) 执行堆化
     * 前提：在对子树 TREE(i) 执行堆化前，i 的两个子节点 LEFT(i) 和 RIGHT(i) 所构成的子树已经完成了堆化，也就是说
     * 执行堆化前仅仅是树根元素不满足堆条件。
     * 
     * 步骤(以大顶堆为例)：
     *  1. 在当前节点（父节点）、左子节点、右子节点三者之间找出值最大的那个，设下标为 j；
     *  2. 如果 j 不等于 i，说明当前父节点不符合大顶堆条件，将 j 和 i 的值互换，如此父节点变成了三者中最大的，满足条件了；
     *  3. 然而 j 和 i 交换后，j 位置的新值（从 i 位置交换来的）针对 TREE[j] 可能不再满足大顶堆的条件，所以需要继续 heapify(j)。
     * 
     * @param i - 子树根节点所在位置
     * @returns 操作后原 i 元素所在的新位置 j
     */
    protected heapify(i: number): number {
        // 终止条件：i 是叶子节点
        if (i > this._size >> 1) {
            return i
        }

        // 取 data[i]、LEFT(i)、RIGHT(i) 三者最大/小值
        const left = i << 1
        const right = (i << 1) + 1
        // 获取三者中最大/最小值的位置
        const peak = this.getPeak(i, left, right)

        // 如果 i就是最大/最小值，则堆化结束
        if (peak === i) {
            return i
        }

        // 需要交换
        const tmp = this.data[peak]
        this.data[peak] = this.data[i]
        this.data[i] = tmp

        // 交换后需要对 peak 构成的子树继续堆化
        return this.heapify(peak)
    }

    /**
     * 获取并返回最大/最小值的下标
     * @param p 父节点下标
     * @param l 左子节点下标
     * @param r 右子节点下标
     */
    private getPeak(p: number, l: number, r: number): number {
        if (l > this._size) {
            return p
        }

        const data = this.data
        const isMax = this.isMax

        let peak = p
        // 先取父节点与左子节点之间最大/最小的那个
        if (isMax && data[peak] < data[l] || !isMax && data[peak] > data[l]) {
            peak = l
        }

        // 继上面选出最大/最小节点后，再跟右子节点比较，选出最大/最小的那个，如此便选出了三者中最大/最小的那个
        if (r <= this._size && (isMax && data[peak] < data[r] || !isMax && data[peak] > data[r])) {
            peak = r
        }

        return peak
    }
}

export { Heap }