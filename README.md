TypeScript 语言实现的算法集。

第一期目标：实现《算法导论》中的全部算法。

### 环境：
1. 下载并安装 [node.js](https://nodejs.org/en/download/)；
2. 全局安装 TypeScript: `npm i -g typescript`；
3. 全局安装 ts-node: `npm i -g ts-node`；
4. 下载本项目：`git clone https://github.com/linzier/algo-ts.git`；
5. 进入项目根目录并安装依赖：`cd $proj_dir & npm i`；
6. 运行相关算法的单元测试文件，如：`ts-node test/sort/insertsort.ts`；

**相关算法和数据结构持续更新中，欢迎参与。**

目录
------

### 数据结构:
- [链表](./src/data-structure/link.ts)
- [栈](./src/data-structure/stack.ts)
- [队列](./src/data-structure/queue.ts)
- [堆](./src/data-structure/heap.ts)
- [斐波那契堆](./src/data-structure/fibonacci-heap.ts)
- [散列表](./src/data-structure/hashtable.ts)
- [二叉搜索树](./src/data-structure/bsearch-tree.ts)
- [B+ 树](./src/data-structure/bplus-tree.ts)
- [红黑树](./src/data-structure/red-black-tree.ts)
- [van Emde Boas 树](./src/data-structure/van-emde-boas-tree.ts)
  
### 排序：
- [插入排序](./src/sort/insertsort.ts)
- [选择排序](./src/sort/selectsort.ts)
- [希尔排序](./src/sort/shellsort.ts)
- [堆排序](./src/sort/heapsort.ts)
- [归并排序](./src/sort/mergesort.ts)
- [快速排序](./src/sort/quicksort.ts)
- [基数排序](./src/sort/basesort.ts)
- [桶排序](./src/sort/bucketsort.ts)
- [计数排序](./src/sort/countsort.ts)

### 动态规划：
- [背包问题](./src/dp/knapsack.ts)

### 贪心算法：
- [赫夫曼编码](./src/greedy/huffmancode.ts)
