/**
 * 散列表
 * 采用链表法解决哈希冲突
 * 
 * 散列表存储 key -> val，如何在 O(1) 的时间复杂度执行查找操作？
 * 1. 散列表对关键字 key 执行 hash 计算，得到 key 的 hash 值（整型），对于大小为 n 的 hash table，该值范围为 0 ~ n-1。
 * 2. 然后根据 key 的 hash 值将 (key,val) 放入相应的桶（bucket）中。
 *    所谓的桶，就是 C 语言层面的数组，特点：可以在 O(1) 时间内根据下标找到数组元素（C 语言中就是根据内存地址偏移量直接取值），散列表
 *    的 O(1) 时间复杂度本质就是这么来的（数组下标就是根据 key 的 hash 值来的）。
 * 3. hash 冲突：hash 函数将 key 转换成整型（数组下标），那么就存在多个不同的 key 被转成同样的 hash 值（映射到同一个数组下标），此
 *    为 hash 冲突。
 *    解决 hash 冲突的方式主要有两种：链表法和开放寻址法。
 *    此处实现链表法，开放寻址法参见 hashtable2.ts
 * 4. rehash。对于大小为 n 的散列表，存入 m 个元素，那么理论上每个槽位（数组项）存放 m/n 个元素，如果 m 大出 n 很多，对查找性能会有
 *    显著的影响。
 *    如：大小为 100 的散列表，存入 100000 个元素，那么平均每个槽位需要存 1000 个元素，无论采用链表法还是开放寻址法，最坏情况下都需要
 *    查找 1000 次才能找到（或找不到）目标对象。
 *    （对于链表法来说就是从表头遍历到表尾。）
 *    为了解决此问题，当散列表的装载因子（α=m/n）达到某个阈值时，需要执行 rehash。一般创建一个大小为 2n 的新散列表，然后对旧散列表中的
 *    每个元素针对新散列表重新计算 hash 值，并据此迁移到新散列表中相应的位置。
 * 
 * 链表法表示的 hashtable 示意图：
 *  0
 *  1 -> (key1, val1) -> (key2, val2)
 *  2
 *  3 -> (key3, val3)
 *  4 -> (key4, val4) -> (key5, val5) -> (key6, val6)
 *  5
 *  ...
 * 其中纵列表示桶（数组），桶中存放链表。
 * 查找元素的时候，先定位到桶，然后遍历桶中链表。
 */

import { Link } from "./link"

interface Value {
    key: string;
    val: unknown;
}

// 高水位。装载因子大于此则扩展散列表
const HIGH_WATER = 0.75
// 低水位。装载因子低于此则收缩散列表
const LOW_WATER = 0.25
// 散列表初始大小
const INIT_CAP = 17

/**
 * 基于链表法实现的hash table
 * 为方便，此处限制 key 为 string 类型
 */
class HashTable {
    // 桶
    private arr: Link[]
    // 元素数量
    private size: number

    public constructor() {
        this.size = 0
        this.arr = new Array(INIT_CAP)
    }

    /**
     * 元素数量
     */
    public count(): number {
        return this.size
    }

    /**
     * 桶数量（即内部数组大小）
     */
    public capacity(): number {
        return this.arr.length
    }

    /**
     * 设置（存储）
     */
    public set(key: string, val: unknown) {
        if (!key) {
            throw new Error('invalid key')
        }

        // 设置之前尝试执行 extend 扩展散列表
        if (this.size / this.arr.length >= HIGH_WATER) {
            this.extend()
        }

        // 定位槽位
        const slot = this.hash(key)
        if (!this.arr[slot]) {
            // 为该槽位创建新链表
            this.arr[slot] = new Link()
        }

        // 插入到槽位中
        this.arr[slot].insert({ key, val })

        // 调整 size
        this.size++
    }

    /**
     * 根据 key 获取值
     * 如果不存在则返回 undefined
     */
    public get(key: string): unknown {
        if (!key) {
            throw new Error('invalid key')
        }

        if (!this.size) {
            return undefined
        }

        const link = this.arr[this.hash(key)]
        if (!link) {
            // 槽位空
            return undefined
        }

        // 从链表中搜索值
        const node = link.searchByFunc((data: unknown) => {
            return (data as Value)?.key === key
        })

        return node ? (node.data as Value).val : undefined
    }

    /**
     * 删除 key 对应的元素
     */
    public remove(key: string) {
        if (!key || !this.size) {
            return
        }

        // 定位槽位
        const slot = this.hash(key)
        const link = this.arr[slot]
        if (!link) {
            return
        }

        // 找节点
        const node = link.searchByFunc((data: unknown) => {
            return (data as Value)?.key === key
        })

        if (!node) {
            return
        }

        // 删节点
        link.delete(node)

        // 如果链表是空，则将链表删除
        if (link.isEmpty()) {
            this.arr[slot] = null
        }

        this.size--

        // 收缩散列表
        if (this.size / this.arr.length < LOW_WATER && this.arr.length > INIT_CAP) {
            this.shrink()
        }
    }

    /**
     * 扩展散列表
     */
    private extend() {
        // 扩展至两倍
        this.rehash(this.arr.length << 1)
    }

    /**
     * 收缩散列表
     */
    private shrink() {
        // 收缩至一半
        this.rehash(this.arr.length >> 1)
    }

    /**
     * rehash
     * 创建新数组，并将旧数组的元素迁移至新数组（需重新计算 hash）
     * 注：实际中，需要迁移的数据可能非常多，如果一次迁移会导致程序卡顿，一般会采用增量迁移的方式，每次 set/remove 的时候迁移一部分。
     * 增量迁移下，内部需要维护两个数组：oldArr 和 newArr，get、remove 都要先操作 oldArr，如果 oldArr 没找到，则操作 newArr
     */
    private rehash(newCap: number) {
        const newArr = new Array(newCap)

        let link: Link | null | undefined
        for (let i = 0; i < this.arr.length; i++) {
            link = this.arr[i]
            if (!link) {
                continue
            }

            while (!link.isEmpty()) {
                const val = link.shift().data as Value
                // 针对新数组计算 hash
                const slot = this.hash(val.key, newCap)
                // 插入到新数组中
                if (!newArr[slot]) {
                    newArr[slot] = new Link()
                }
                newArr[slot].insert(val)
            }
        }

        this.arr = newArr
    }

    /**
     * 为 key 计算 hash 值，范围 0 ~ cap-1
     */
    private hash(key: string, cap = 0): number {
        cap = cap || this.arr.length

        const num = this.string2number(key)

        // 用取模的将 num 转成 0 ~ size-1 的数
        // 注意 size 不要是 2 的幂(2^p)，否则取模就是取 p 个最低位（即高位根本不会影响结果）
        // 另一种方式是乘法：floor(size * (num*A mod 1))，其中 0 < A < 1。（mod 1 表示取小数部分）
        return num % cap
    }

    /**
     * 将字符串转成整型
     */
    private string2number(key: string): number {
        let total = 0;
        for (let i = 0; i < key.length; i++) {
            total += 37 * total + key.charCodeAt(i);
        }

        return total
    }
}

export { HashTable }