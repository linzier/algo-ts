import assert from "assert"
import { BinSearchTree } from '../../src/data-structure/bin-search-tree2'

function commonAssertTree(tree: BinSearchTree, total: number) {
    assert.equal(tree.size(), total)
    assert.equal(tree.height(), 3)
    assert.equal(tree.search(9), 9)
    assert.equal(tree.search(20), 20)
    assert.equal(tree.search(100), undefined)
    
    // 中序
    const inOrders4 = tree.inorderWalk()
    assert.equal(inOrders4.length, total)
    for (let i = 1; i < inOrders4.length; i++) {
        assert.ok(inOrders4[i - 1].key <= inOrders4[i].key)
    }
    
    // 先序
    const preOrders4 = tree.preorderWalk()
    assert.equal(tree.preorderWalk().length, total)
    const preArr4 = [9, 4, 2, 3, 6, 7, 17, 13, 15, 18, 20]
    for (let i = 0; i < preOrders4.length; i++) {
        assert.equal(preOrders4[i].key, preArr4[i])
    }

    // 后序
    const postOrders4 = tree.postorderWalk()
    assert.equal(postOrders4.length, total)
    const postArr4 = [3, 2, 7, 6, 4, 15, 13, 20, 18, 17, 9]
    for (let i = 0; i < postOrders4.length; i++) {
        assert.equal(postOrders4[i].key, postArr4[i])
    }

    assert.equal(tree.minimum().key, 2)
    assert.equal(tree.maximum().key, 20)

    // 范围查询
    const start = 6
    const end = 13
    const arr = tree.range(start, end)
    
    assert.ok(arr.length == 4)
    assert.ok(arr[0].key >= start)
    assert.ok(arr[0].key <= end)
    for (let i = 1; i < arr.length; i++) {
        assert.ok(arr[i - 1].key <= arr[i].key)
        assert.ok(arr[i].key >= start)
        assert.ok(arr[i].key <= end)
    }
}

describe('bin search tree(recurrence)', () => {
    it('insert、delete、search on tree', () => {
        const tree = new BinSearchTree()

        assert.equal(tree.size(), 0)
        assert.equal(tree.height(), 0)

        // 9, 4, 2, 3, 6, 7, 17, 13, 15, 18, 20
        tree.insert(9, 9)
        assert.equal(tree.size(), 1)
        assert.equal(tree.height(), 0)

        tree.insert(4, 4)
        assert.equal(tree.size(), 2)
        assert.equal(tree.height(), 1)

        tree.insert(2, 2)
        assert.equal(tree.size(), 3)
        assert.equal(tree.height(), 2)

        tree.insert(3, 3)
        assert.equal(tree.size(), 4)
        assert.equal(tree.height(), 3)

        tree.insert(6, 6)
        assert.equal(tree.size(), 5)
        assert.equal(tree.height(), 3)

        tree.insert(7, 7)
        assert.equal(tree.size(), 6)
        assert.equal(tree.height(), 3)

        tree.insert(17, 17)
        assert.equal(tree.size(), 7)
        assert.equal(tree.height(), 3)

        tree.insert(13, 13)
        assert.equal(tree.size(), 8)
        assert.equal(tree.height(), 3)

        tree.insert(15, 15)
        tree.insert(18, 18)
        tree.insert(20, 20)

        commonAssertTree(tree, 11)

        const node = tree.searchNode(17)

        assert.ok(node != null)
        assert.equal(tree.maximum(node).key, 20)
        assert.equal(tree.minimum(node).key, 13)

        // 删除
        tree.delete(3)
        assert.equal(tree.size(), 10)
        assert.equal(tree.searchNode(3), null)
        const node2 = tree.searchNode(2)
        assert.equal(node2.left, null)
        assert.equal(node2.right, null)

        tree.delete(6)
        assert.equal(tree.size(), 9)
        const node3 = tree.searchNode(4)
        assert.equal(node3.left.key, 2)
        assert.equal(node3.right.key, 7)

        tree.delete(17)
        assert.equal(tree.size(), 8)
        const node5 = tree.searchNode(9)
        const node6 = tree.searchNode(18)
        assert.equal(node5.right, node6)
        assert.equal(node6.left.key, 13)
        assert.equal(node6.right.key, 20)

        tree.delete(9)
        assert.equal(tree.size(), 7)
        const node7 = tree.searchNode(13)
        const node8 = tree.searchNode(18)
        const node9 = tree.searchNode(15)
        assert.equal(node7.left.key, 4)
        assert.equal(node7.right, node8)
        assert.equal(node8.left, node9)
        assert.equal(tree.height(), 2)

        tree.delete(2)
        tree.delete(4)
        tree.delete(7)
        tree.delete(13)
        tree.delete(15)
        tree.delete(18)
        tree.delete(20)
        tree.delete(20)

        assert.equal(tree.size(), 0)
        assert.equal(tree.height(), 0)
    })
})