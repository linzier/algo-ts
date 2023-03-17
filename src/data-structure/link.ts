/**
 * 链表
 * 此处实现带哨兵的双向链表
 * 
 * 哨兵是一个特殊的 Node，用来简化链表的操作（特别是删除操作）。
 * 加入哨兵后，哨兵扮演了 head 和 tail 的角色（Link 不再需要 head 和 tail 指针），整个 Link 构成了循环链表，
 * 第一个 Node 的 prev 指向哨兵，最后一个 Node 的 next 也指向哨兵；
 * 哨兵的 next 指向第一个 Node，哨兵的 pre 指向最后一个 Node；
 * 初始化时，哨兵的 pre 和 next 指向自己。
 */

/**
 * 节点定义
 */
interface Node {
    data: unknown;
    prev: Node;
    next: Node;
}

/**
 * 双向链表
 */
class Link {
    // 链表中元素数量
    protected _size: number
    // 哨兵节点
    protected sentinel: Node

    public constructor() {
        this._size = 0
        
        // 初始化哨兵，其 prev 和 next 都指向自身
        const sentinel = { data: null, prev: null, next: null } as Node
        // prev 和 next 指向自身
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
     * 向链表（头）插入数据 data
     * 
     * @param data - 待插入元素
     * @returns 生成的新节点 Node
     */
    public insert(data: unknown): Node {
        this._size++

        // 将 data 包装成 Node
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
     * 查找 data
     * @param data 
     * @returns 如果找到，则返回对应的 Node，否则返回 null
     */
    public search(data: unknown): Node | null {
        // 从 sentinel.next 往后找
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
     * 删除节点
     * 删除前：nodePrev -> node -> nodeNext
     * 删除后：nodePrev -> nodeNext，且 node 不再引用 nodePrev 和 nodeNext
     */
    public delete(node: Node) {
        // 判断 node 是否已经被删除了
        if (node.prev === null || node.next === null) {
            return
        }

        node.prev.next = node.next
        node.next.prev = node.prev

        // 清理前后指针
        node.prev = node.next = null
        this._size--
    }

    /**
     * 取出表头节点并从链表中删除
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
     * 取出表尾元素，并从链表中删除
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