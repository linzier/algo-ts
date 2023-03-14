TypeScript 语言实现的算法集。

第一期目标：实现《算法导论》中的全部算法。

### 环境：
1. 下载并安装 [node.js](https://nodejs.org/en/download/)；
2. 全局安装 TypeScript: `npm i -g typescript`；
3. 全局安装 ts-node: `npm i -g ts-node`；
4. 下载本项目：`git clone https://github.com/linzier/algo-ts.git`；
5. 进入项目根目录并安装依赖：`cd $proj_dir & npm i`；
6. 运行相关算法的单元测试文件，如：`ts-node test/sort/insertsort.ts`；

### 开发指南：
- src 目录：存放源码，里面根据算法类型归类分二级目录；
- test 目录：单元测试目录，目录结构同 src；
- 为了让不太熟悉 TypeScript 的同学也能容易看懂算法实现代码，本项目在代码编写上尽量不使用复杂的语法（如大部分时候直接使用基本数据类型，而不是泛型），让大家在阅读代码时将注意力集中在算法实现本身，而不是语言特定语法中；
- 注释：为便于阅读，代码尽可能包含详尽的注释。一般一个文件就是一个特定算法实现，在该文件顶部会包含一段注释，说明算法名称、说明、算法实现思路。另外大部分函数以及函数内部也都会包含详细的注释说明算法实现逻辑；
- 目录：每个算法都在下方目录中有对应索引，方便快速检阅；

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
