import assert from "assert"
import { RedBlackTree, Node } from '../../src/data-structure/red-black-tree'

/**
 * Create a test class to verify correctness of the Red-Black Tree
 * 1. Same number of black nodes on all paths from root to leaf nodes (null nodes)
 * 2. No two consecutive red nodes
 * 3. Root node is black
 * 4. Right child cannot be black
 * 5. Height at most 2*lg(n+1)
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
        // Left subtree
        rst &&= this.dontHaveRightBlack(node.left)
        // Right subtree
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

        // check left and right subtree
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

        // check if current node's size is correct
        const ok = node.size === ((node.left ? node.left.size : 0) + (node.right ? node.right.size : 0) + 1)
        if (!ok) {
            console.log('curr:', node.size,'; left:', (node.left ? node.left.size : 0), '; right:', (node.right ? node.right.size : 0))
        }

        // need current node, left subtree, and right subtree all OK
        return ok && this.doesNodeSizeOK(node.left) && this.doesNodeSizeOK(node.right)
    }

    /**
     * Calculate the number of black nodes on each path from subtree node to leaf nodes and write to results
     * currCnt represents the count of black nodes already accumulated before reaching the current subtree
     */
    private countBlackNodes(node: Node | null, currCnt: number, results: number[]) {
        if (node === null) {
            // reached null node (leaf node), end
            results.push(currCnt + 1)
            return
        }

        // left and right subtree
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
        // Generate numbers 1~500
        const a1 = []
        for (let i = 1; i <= 500; i++) {
            a1.push(i)
        }
        list.push(a1)

        // Generate numbers 500~1
        const a2 = []
        for (let i = 500; i >= 1; i--) {
            a2.push(i)
        }
        list.push(a2)

        // Generate random numbers
        const a3 = []
        for (let i = 0; i < 500; i++) {
            a3.push(Math.floor(Math.random() * 1000000))
        }
        list.push(a3)

        for (const arr of list) {
            const tree = new TestTree()
            assert.equal(tree.size(), 0)

            // Step-by-step insertion maintains red-black properties
            for (const key of arr) {
                tree.insert(key, key)
                commonAssert(tree)
            }

            console.log('tree size:', tree.size(), ';tree height:', tree.height())

            assert.equal(tree.size(), arr.length)
            commonAssert(tree)

            // inorder traversal
            const seqs = tree.inorderWalk()
            for (let i = 1; i < seqs.length; i++) {
                assert.ok(seqs[i-1].key <= seqs[i].key)
            }

            // Step-by-step deletion maintains red-black properties
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

        // Order Statistics
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