/**
 * 跳表
 * 基于多层链表实现的平衡树，其查询、插入和更新的平均时间复杂度都是 O(lgn)。
 * 相较于红黑树等其他平衡树，有如下特点：
 *  1. 实现简单；
 *  2. 范围查询更加友好；
 * 
 * 为简单起见，我们限制 key 是 number 类型，且假设节点关键字是不会重复的（插入的时候如果重复则覆盖）。
 */

class SkipList {
    // 跳表最大层数限制
    protected static readonly MAX_LEVEL = 32
    // 上层元素数是下层数量的 1/N（相当于 N 叉树）
    protected static readonly N = 4

    // 表头指针。为方便处理，表头不表示实际节点， 作为哨兵存在
    protected head: Node
    // 表尾指针。空链表的时候指向 null
    protected tail: Node | null
    // 跳表中元素个数
    protected length: number
    // 跳表层数
    protected level: number
    
    public constructor() {
        // 创建表头
        this.head = new Node(-Infinity, undefined)
        this.length = 0
        this.level = 0
    }

    public size(): number {
        return this.length
    }

    /**
     * 根据 key 查找 value 并返回，如果没找到则返回 undefined
     * @param key
     */
    public search(key: number): unknown {
        if (!this.length) {
            return
        }

        let node = this.head

        // 从最高层开始往下搜索，直到搜到第一层
        for (let i = this.level - 1; i >= 0; i--) {
            // 如果当前节点该层存在后继节点，且该后继节点的 key 小于等于 key，则跳到该后继节点
            while (node.nexts[i] && node.nexts[i].key <= key) {
                node = node.nexts[i]
            }
        }

        return node.key === key ? node.val : undefined
    }

    /**
     * 将 { key, val } 插入到跳表中。如果已经存在则覆盖 val 的值
     * @param key 
     * @param val 
     */
    public insert(key: number, val: unknown) {
        // 获取搜索路径上的各层前驱节点
        const prevNodes = this.searchPrevNodes(key)
        // 第一层的前驱节点
        const prev = prevNodes[0]

        // 取第一层前驱的 next，看看该值是不是 key
        // 如果是 key Node，说明节点已经存在，覆盖 val 后结束
        if (prev.nexts[0] && prev.nexts[0].key === key) {
            prev.nexts[0].val = val
            return
        }

        // 待插入的节点是新节点，需插入节点并重建索引（可能）
        const newNode: Node = { key, val, prev: null, nexts: [] }

        // 计算新节点的索引层数
        const level = this.randomLevel()

        // 先处理 prev 指针
        if (prev !== this.head) {
            // 将 newNode 的 prev 指针指向 node（前提是 node != head，我们不让 prev 指向 head 哨兵）
            newNode.prev = prev
        }
        if (prev.nexts[0]) {
            prev.nexts[0].prev = newNode
        }

        // 逐层处理 next 指针
        for (let i = 0; i < level; i++) {
            // prevNodes 里面仅有原先 this.level 层的最右 node，而新 level 可能高于原 level，
            // 该情况下，超出的层在 prevNodes 里面没有对应节点，则直接取 head
            const leftNode = prevNodes[i] ?? this.head

            // 变更 next 指针
            newNode.nexts[i] = leftNode.nexts[i]
            leftNode.nexts[i] = newNode
        }

        if (level > this.level) {
            this.level = level
        }

        this.length++
    }

    /**
     * 删除节点
     * @param key
     */
    public delete(key: number) {
        // 获取搜索路径上的各层前驱节点
        const prevNodes = this.searchPrevNodes(key)
        const current = prevNodes[0].nexts[0]

        if (!current || current.key !== key) {
            return
        }

        // 先处理 prev 指针
        if (current.nexts[0]) {
            current.nexts[0].prev = current.prev
        }
        current.prev = null

        // 处理各层的 next 指针
        for (let i = 0; i < current.nexts.length; i++) {
            prevNodes[i].nexts[i] = current.nexts[i]
            current.nexts[i] = null

            // 如果该层的前驱节点是 head，且调整后其 next 指向 null/undefined，说明该层不再有有效节点，需要将层数减 1
            if (!this.head.nexts[i]) {
                this.level--
            }
        }

        this.length--
    }

    /**
     * 搜索关键字 key，返回其搜索路径上经过的每层的前驱节点数组
     * 即每层返回其左边相邻节点
     * @param key - 关键字
     * @returns 关键字 key 在每层的前驱节点数组
     */
    private searchPrevNodes(key: number): Node[] {
        // 记录每层走到的最右边的位置（也就是目标节点的前驱节点）
        const prevNodes: Node[] = []
        // 从 head 开始
        let node = this.head

        // 从最上层开始往下找
        for (let i = this.level - 1; i >= 0; i--) {
            // 如果当前节点该层存在后继节点，且该后继节点的 key 小于 key，则跳到该后继节点
            while (node.nexts[i] && node.nexts[i].key < key) {
                node = node.nexts[i]
            }

            // 下沉之前记录该节点作为本层访问到的最右节点
            prevNodes[i] = node
        }

        // 如果一个都没有（列表为空，this.level = 0 时），将 head 加入进去
        if (!prevNodes.length) {
            prevNodes[0] = this.head
        }

        return prevNodes
    }

    /**
     * 随机生成 level 层数
     * 从最底层开始，每增加一层的概率为 1/N
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
 * 跳表节点
 * 双向链表节点，拥有 prev 和 next 指针
 */
class Node {
    // 关键字。根据 key 排序
    // 为简单起见，我们假设节点关键字是不会重复的（插入的时候如果重复则覆盖）
    public key: number
    // 卫星数据
    public val: unknown
    // 该节点的前驱节点指针
    public prev: Node | null
    // 该节点各层的后继节点指针数组
    public nexts: (Node | null)[]

    public constructor(key: number, val: unknown) {
        this.key = key
        this.val = val
        this.prev = null
        this.nexts = []
    }
}

export { SkipList }