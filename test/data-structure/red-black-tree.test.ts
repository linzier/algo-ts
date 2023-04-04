import assert from "assert"
import { RedBlackTree, Node } from '../../src/data-structure/red-black-tree'

/**
 * 创建一个测试用的类来检测红黑树类的正确性
 * 1. 从根到所有叶节点（null 节点）的路径上黑色节点数量相同
 * 2. 不存在两个连续的红节点
 * 3. 根节点是黑色
 * 4. 右子节点不能是黑色
 * 5. 高度至多为 2*lg(n+1)
 */
class TestTree extends RedBlackTree {
    public isHeightValid(): boolean {
        return this.height() <= 2 * Math.log2(this.size() + 1)
    }

    public isRootBlack(): boolean {
        return !this.isRed(this.root)
    }

    public dontHaveRightBlack(node?: Node): boolean {
        node = node === undefined ? this.root : node

        if (!node) {
            return true
        }

        if (this.isRed(node.right)) {
            return false
        }

        let rst = true
        // 左子树
        rst &&= this.dontHaveRightBlack(node.left)
        // 右子树
        rst &&= this.dontHaveRightBlack(node.right)

        return rst
    }

    public dontHaveContinuousRedNode(node?: Node): boolean {
        node = node === undefined ? this.root : node

        if (!node) {
            return true
        }

        if (this.isRed(node) && (this.isRed(node.left) || this.isRed(node.right))) {
            return false
        }

        // 检查左右子树
        let rst = true
        rst &&= this.dontHaveContinuousRedNode(node.left)
        rst &&= this.dontHaveContinuousRedNode(node.right)

        return rst
    }

    public doesAllPathsHasSameBlackNodes(): boolean {
        if (!this.root) {
            return true
        }

        const results: number[] = []
        this.countBlackNodes(this.root, 0, results)

        if (!results.length) {
            return false
        }

        for (let i = 1; i < results.length; i++) {
            if (results[i - 1] != results[i]) {
                return false
            }
        }

        return true
    }

    public doesNodeSizeOK(node?: Node): boolean {
        node = node === undefined ? this.root : node

        if (!node) {
            return true
        }

        // 当前节点的 size 是否 ok
        const ok = node.size === ((node.left ? node.left.size : 0) + (node.right ? node.right.size : 0) + 1)
        if (!ok) {
            console.log('curr:', node.size,'; left:', (node.left ? node.left.size : 0), '; right:', (node.right ? node.right.size : 0))
        }

        // 需要自身、左子树、右子树都 OK
        return ok && this.doesNodeSizeOK(node.left) && this.doesNodeSizeOK(node.right)
    }

    /**
     * 计算子树 node 中到叶子节点的每条路径上黑色节点的数量并写入到 results 中
     * currCnt 表示走到当前子树之前已经有的黑节点数量
     */
    private countBlackNodes(node: Node | null, currCnt: number, results: number[]) {
        if (node === null) {
            // 走到 null 节点（叶子节点），结束
            results.push(currCnt + 1)
            return
        }

        // 左右子树
        const cnt = node.color == 'BLACK' ? currCnt + 1 : currCnt
        this.countBlackNodes(node.left, cnt, results)
        this.countBlackNodes(node.right, cnt, results)
    }
}

function commonAssert(tree: TestTree) {
    assert.ok(tree.isHeightValid())
    assert.ok(tree.isRootBlack())
    assert.ok(tree.dontHaveRightBlack())
    assert.ok(tree.dontHaveContinuousRedNode())
    assert.ok(tree.doesAllPathsHasSameBlackNodes())
    assert.ok(tree.doesNodeSizeOK())
}

describe('red black tree', () => {
    it('should ok', () => {
        const list = [
            [],
            [0],
            [1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
        // 生成 1~500 的数
        const a1 = []
        for (let i = 1; i <= 500; i++) {
            a1.push(i)
        }
        list.push(a1)

        // 生成 500~1 的数
        const a2 = []
        for (let i = 500; i >= 1; i--) {
            a2.push(i)
        }
        list.push(a2)

        // 生成随机数
        const a3 = []
        for (let i = 0; i < 500; i++) {
            a3.push(Math.floor(Math.random() * 1000000))
        }
        list.push(a3)

        for (const arr of list) {
            const tree = new TestTree()
            assert.equal(tree.size(), 0)

            // 逐步插入，能保证红黑性质
            for (const key of arr) {
                tree.insert(key, key)
                commonAssert(tree)
            }

            console.log('tree size:', tree.size(), ';tree height:', tree.height())

            assert.equal(tree.size(), arr.length)
            commonAssert(tree)

            // 中序遍历
            const seqs = tree.inorderWalk()
            for (let i = 1; i < seqs.length; i++) {
                assert.ok(seqs[i-1].key <= seqs[i].key)
            }

            // 逐步删除，能保证红黑性质
            for (const key of arr) {
                tree.delete(key)
                commonAssert(tree)
            }

            assert.equal(tree.size(), 0)
        }

        // 1, 2, 3, 5, 7, 23, 81, 90, 190
        const arr = [1, 5, 2, 3, 7, 23, 190, 81, 90]
        const tree = new TestTree()

        tree.deleteMin()
        tree.deleteMax()
        tree.delete(123)
        assert.equal(tree.size(), 0)

        for (let i = 0; i < arr.length; i++) {
            tree.insert(arr[i], arr[i])
        }
        assert.equal(tree.searchNode(100), null)
        assert.equal(tree.searchNode(90).key, 90)
        assert.equal(tree.minimum().key, 1)
        assert.equal(tree.maximum().key, 190)

        // 顺序统计量
        assert.equal(tree.osSelect(1).key, 1)
        assert.equal(tree.osSelect(2).key, 2)
        assert.equal(tree.osSelect(4).key, 5)
        assert.equal(tree.osSelect(9).key, 190)
        assert.equal(tree.osRank(tree.searchNode(1)), 1)
        assert.equal(tree.osRank(tree.searchNode(2)), 2)
        assert.equal(tree.osRank(tree.searchNode(5)), 4)
        assert.equal(tree.osRank(tree.searchNode(190)), 9)

        tree.deleteMin()
        assert.equal(tree.minimum().key, 2)

        tree.deleteMax()
        assert.equal(tree.maximum().key, 90)

        commonAssert(tree)
    })
})