/**
 * 散列表
 * 采用开放寻址法解决哈希冲突
 * 
 * 散列表存储 key -> val，如何在 O(1) 的时间复杂度执行查找操作？
 * 1. 散列表对关键字 key 执行 hash 计算，得到 key 的 hash 值（整型），对于大小为 n 的 hash table，该值范围为 0 ~ n-1。
 * 2. 然后根据 key 的 hash 值将 (key,val) 放入相应的桶（bucket）中。
 *    所谓的桶，就是 C 语言层面的数组，特点：可以在 O(1) 时间内根据下标找到数组元素（C 语言中就是根据内存地址偏移量直接取值），散列表
 *    的 O(1) 时间复杂度本质就是这么来的（数组下标就是根据 key 的 hash 值来的）。
 * 3. hash 冲突：hash 函数将 key 转换成整型（数组下标），那么就存在多个不同的 key 被转成同样的 hash 值（映射到同一个数组下标），此
 *    为 hash 冲突。
 *    解决 hash 冲突的方式主要有两种：链表法和开放寻址法。
 *    此处实现开放寻址法，链表法参见 hashtable1.ts。
 * 4. rehash。对于大小为 n 的散列表，存入 m 个元素，那么理论上每个槽位（数组项）存放 m/n 个元素，如果 m 大出 n 很多，对查找性能会有
 *    显著的影响。
 *    如：大小为 100 的散列表，存入 100000 个元素，那么平均每个槽位需要存 1000 个元素，无论采用链表法还是开放寻址法，最坏情况下都需要
 *    查找 1000 次才能找到（或找不到）目标对象。
 *    为了解决此问题，当散列表的装载因子（α=m/n）达到某个阈值时，需要执行 rehash。一般创建一个大小为 2n 的新散列表，然后对旧散列表中的
 *    每个元素针对新散列表重新计算 hash 值，并据此迁移到新散列表中相应的位置。
 * 
 * 开放寻址法：
 *  不同于链表法将元素存放在链表中，开放寻址法直接将元素存放在桶（数组）中。
 *  当遇到 hash 冲突时（hash 函数计算出来的下标对应到同一个桶位置，设为 i），我们依次不断地（根据某种规则）尝试将元素放在 i 后面的第 m 个
 *  桶中————循环查找（至多 n-1 次，n 是散列表数组大小），直到找到一个空位插入。
 *  如：
 *  （简单起见，这里只展示关键字 key，没有展示卫星数据）
 *           值：null  null   key1    key2    null    null    key3
 *      数组下标： 0     1      2       3       4       5       6
 *  现在需要保存 key5。
 *  假设 hash'(key5) = 2，按理应插入到 arr[2]，但此位置已经有值 key1了，所以我们采用某种策略依次往后面找。假设策略是依次往后加 1，则接下来
 *  看 arr[3]，该位置也有值了，所以继续看 arr[4]，该位置空，所以 key5 放在 arr[4]。
 *  查找：现在考虑查找 key5。
 *  hash'(key5) = 2，先查 arr[2] 并比较，发现不是 key5；继续往后找，发现 arr[3] 也不是 key5，直到找到 arr[4] 等于 key5，返回。
 *  查找：key6。
 *  假设 hash'(key6) = 4，检查 arr[4] 并比较，发现不是 key6；继续往后找，发现 arr[5] = null，直接返回不存在。
 *  查找：key7。
 *  假设 hash'(key7) = 1，arr[1] = null，直接返回不存在。
 * 
 * 删除元素：
 *  思考：针对上面的数组，删除 arr[2] 后会怎样？
 *  删除后：
 *           值：null  null   null    key2    key5    null    key3
 *      数组下标： 0     1      2       3       4       5       6 
 *  现在再查找 key5。
 *  hash'(key5) = 2，而 arr[2] = null，按照前面的逻辑会认为 key5 不存在，这是有问题的。
 *  所以删除的时候不能将对应位置置为 null，而是需要放入一个占位符：
 *  删除后：
 *           值：null  null   del    key2    key5    null    key3
 *      数组下标： 0     1      2       3       4       5       6 
 *  查找 key5: hash'(key5) = 2，发现 arr[2] 有占位符，继续往后找，直到找到 arr[4] = key5 并返回。
 *  插入 key8: 假设 hash'(key8) = 2，发现 arr[2] = del，直接插入到此位置。
 */

interface Value {
    key: string;
    val: unknown;
    // 标记该元素是否处于删除态
    isDel: boolean;
}

// 高水位。装载因子大于此则扩展散列表
const HIGH_WATER = 0.75
// 低水位。装载因子低于此则收缩散列表
const LOW_WATER = 0.25
// 散列表初始大小
const INIT_CAP = 16

/**
 * 基于开放寻址法实现的 hash table
 * 为方便，此处限制 key 为 string 类型
 * 
 * 相较于链表法，开放寻址法更节约内存。
 * 不过，因为删除元素后仍然需要用占位符占用相应槽位，所以删除元素后并不会减少查询时的探查次数，
 * 一般在需要频繁删除元素的场景使用链表法更合适。
 */
class HashTable {
    // 桶
    private arr: Value[]
    // 元素数量
    private size: number

    public constructor() {
        this.init(INIT_CAP)
    }

    private init(cap: number) {
        this.size = 0
        this.arr = new Array(cap)
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
        // 因为前面执行了 extend，此处不可能返回 -1
        const slot = this.probeSlot(key, false)
        // 插入到槽位中
        this.arr[slot] = { key, val, isDel: false }

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

        const slot = this.probeSlot(key, true)

        if (slot == -1) {
            return undefined
        }

        const val = this.arr[slot]
        if (!val || val.isDel) {
            // 槽位空（或已被删除）
            return undefined
        }

        return val.val
    }

    /**
     * 删除 key 对应的元素
     */
    public remove(key: string) {
        if (!key || !this.size) {
            return
        }

        // 定位槽位
        const slot = this.probeSlot(key, true)

        if (slot == -1) {
            return
        }

        const val = this.arr[slot]
        if (!val || val.isDel) {
            return
        }

        // 标记删除
        this.arr[slot].val = null
        this.arr[slot].isDel = true
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
        const oldArr = this.arr
        this.init(newCap)

        let val: Value | undefined
        for (let i = 0; i < oldArr.length; i++) {
            val = oldArr[i]
            if (!val || val.isDel) {
                continue
            }

            this.set(val.key, val.val)
        }
    }

    /**
     * 探查 key 所在的槽位
     * 采用双重散列法：用两个 hash 函数，尽量实现均匀散列
     * 当 slot 所在的位置为空或者是占位符则返回
     * 
     * @forExists - true 表示探查存在性（如果不存在则返回 -1），false 表示探查空位（全部位置都满则返回 -1）
     * @returns 探查到的位置，没探查到则返回 -1
     */
    private probeSlot(key: string, forExists: boolean): number {
        const cap = this.arr.length

        // 最多执行 i 次探查
        for (let i = 0; i < cap; i++) {
            // (i * this.hash2(key)) % cap 作为步长执行探查
            const slot = (this.hash1(key) + i * this.hash2(key)) % cap
            if (
                !forExists && (!this.arr[slot] || this.arr[slot].isDel) ||
                forExists && this.arr[slot] && this.arr[slot].key === key
            ) {
                return slot
            }
        }

        return -1
    }

    private hash1(key: string): number {
        return this.string2number(key, 13)
    }

    /**
     * 为了能够探查整个散列表，hash2 返回值必须与散列表大小 n 互素（两者只有 1 这个公约数）
     * 我们约定 m 总是 2 的次方数，则让 hash2 返回奇数即可。
     */
    private hash2(key: string): number {
        return this.string2number(key, 11) | 1
    }

    /**
     * 将字符串转成整型
     */
    private string2number(key: string, factor: number): number {
        let total = 0;
        for (let i = 0; i < key.length; i++) {
            total = (total + factor * total + key.charCodeAt(i)) >>> 0;// 转成正数
        }

        return total
    }
}

export { HashTable }