TypeScript 语言实现的算法集。

第一期目标：实现《算法导论》中的全部算法。

### 环境：
1. 下载并安装 [node.js](https://nodejs.org/en/download/)；
2. 全局安装 TypeScript: `npm i -g typescript`；
3. 全局安装 ts-node: `npm i -g ts-node`；
4. 下载本项目：`git clone https://github.com/linzier/algo-ts.git`；
5. 进入项目根目录并安装依赖：`cd $proj_dir && npm i`；
6. 运行某个算法的单元测试：`npm run test test/sort/insert-sort.test.ts`；
7. 或者运行所有的单元测试：`npm run test:all`；
8. 单元测试覆盖率：`npm run cover`；

### 开发指南：
- src 目录：存放源码，视情况划分二级目录；
- test 目录：单元测试目录，目录结构同 src；
- 为了让不太熟悉 TypeScript 的同学也能容易看懂算法实现代码，本项目在代码编写上尽量不使用复杂的语法（如大部分时候直接使用基本数据类型，而不是泛型），让大家在阅读代码时将注意力集中在算法实现本身，而不是语言特定语法中；
- 注释：为便于阅读，代码尽可能包含详尽的注释。一般一个文件就是一个特定算法实现，在该文件顶部会包含一段注释，说明算法名称、说明、算法实现思路。另外大部分函数以及函数内部也都会包含详细的注释说明算法实现逻辑；
- 目录与索引：
  - 每个算法都需要加入到下方索引中，方便检阅；
  - 一个算法可能属于多个索引分类，如归并算法同时属于“排序”和“分治算法”；
  - 一般情况下，src 下的目录和索引是对应的，不过对于可归入多个索引分类的算法，在 src 下放入到其中一个目录即可。另外一些不好划分目录的直接放在 src 一级目录下；

**相关算法和数据结构持续更新中，欢迎参与。**

索引
------

### 数据结构:
- [堆](./src/data-structure/heap.ts)
- [优先队列](./src/data-structure/priority-queue.ts)
- [链表](./src/data-structure/link.ts)
- [栈](./src/data-structure/stack.ts)
- [队列、循环队列](./src/data-structure/queue.ts)
- [散列表（链表法）](./src/data-structure/hashtable1.ts)
- [散列表（开放寻址法）](./src/data-structure/hashtable2.ts)
- [二叉搜索树（非递归法实现）](./src/data-structure/bin-search-tree.ts)
- [二叉搜索树（递归法实现）](./src/data-structure/bin-search-tree2.ts)
- [二分搜索](./src/data-structure/bin-search.ts)
- [红黑树](./src/data-structure/red-black-tree.ts)

### 排序：
- [插入排序](./src/sort/insert-sort.ts)
- [选择排序](./src/sort/select-sort.ts)
- [归并排序](./src/sort/merge-sort.ts)
- [堆排序](./src/sort/heap-sort.ts)
- [快速排序](./src/sort/quick-sort.ts)
- [计数排序](./src/sort/count-sort.ts)
- [基数排序](./src/sort/radix-sort.ts)
- [桶排序](./src/sort/bucket-sort.ts)
- [中位数和顺序统计量](./src/sort/order-statistic.ts)

### 动态规划：
- [最大子数组（O(n)复杂度解法）](./src/dp/maximum-subarray.ts)
- [最长公共子序列](./src/dp/longest-common-subsequence.ts)

### 贪心算法：

### 分治算法：
- [归并排序](./src/sort/merge-sort.ts)
- [快速排序](./src/sort/quick-sort.ts)
- [逆序对](./src/divide-and-conquer/inversion-pair.ts)
- [最大子数组（最大子序和）](./src/divide-and-conquer/maximum-subarray.ts)
