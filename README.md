Algorithm collection implemented in TypeScript.

Phase 1 goal: Implement all algorithms from "Introduction to Algorithms".

### Environment:
1. Download and install [node.js](https://nodejs.org/en/download/);
2. Install TypeScript globally: `npm i -g typescript`;
3. Install ts-node globally: `npm i -g ts-node`;
4. Clone this project: `git clone https://github.com/linzier/algo-ts.git`;
5. Enter the project root directory and install dependencies: `cd $proj_dir && npm i`;
6. Run unit tests for a specific algorithm: `npm run test test/sort/insert-sort.test.ts`;
7. Or run all unit tests: `npm run test:all`;
8. Unit test coverage: `npm run cover`;

### Development guide:
- src directory: Source code, organized into subdirectories as needed;
- test directory: Unit test directory, mirroring the src structure;
- To make the algorithm implementation code easy to understand even for those not very familiar with TypeScript, this project avoids using complex syntax where possible (e.g., using basic data types instead of generics most of the time), so that readers can focus on the algorithm implementation itself rather than language-specific syntax;
- Comments: For ease of reading, the code includes detailed comments wherever possible. Generally, each file contains a specific algorithm implementation, with a comment block at the top describing the algorithm name, explanation, and implementation approach. Additionally, most functions and their internal logic include detailed comments explaining the implementation;
- Directory and index:
  - Each algorithm must be added to the index below for easy reference;
  - An algorithm may belong to multiple index categories, e.g., merge sort belongs to both "Sorting" and "Divide and Conquer";
  - Generally, directories under src correspond to index categories. For algorithms that belong to multiple categories, they are placed in one directory under src. Some algorithms that are hard to categorize are placed directly in the src root directory;

**Related algorithms and data structures are being continuously updated. Contributions are welcome.**

Index
------

### Data Structures:
- [Heap](./src/data-structure/heap.ts)
- [Priority Queue](./src/data-structure/priority-queue.ts)
- [Linked List](./src/data-structure/link.ts)
- [Stack](./src/data-structure/stack.ts)
- [Queue, Circular Queue](./src/data-structure/queue.ts)
- [Hash Table (Chaining)](./src/data-structure/hashtable1.ts)
- [Hash Table (Open Addressing)](./src/data-structure/hashtable2.ts)
- [Binary Search Tree (Iterative)](./src/data-structure/bin-search-tree.ts)
- [Binary Search Tree (Recursive)](./src/data-structure/bin-search-tree2.ts)
- [Binary Search](./src/data-structure/bin-search.ts)
- [Red-Black Tree](./src/data-structure/red-black-tree.ts)
- [Skip List](./src/data-structure/skiplist.ts)

### Sorting:
- [Insertion Sort](./src/sort/insert-sort.ts)
- [Selection Sort](./src/sort/select-sort.ts)
- [Merge Sort](./src/sort/merge-sort.ts)
- [Heap Sort](./src/sort/heap-sort.ts)
- [Quick Sort](./src/sort/quick-sort.ts)
- [Counting Sort](./src/sort/count-sort.ts)
- [Radix Sort](./src/sort/radix-sort.ts)
- [Bucket Sort](./src/sort/bucket-sort.ts)
- [Medians and Order Statistics](./src/sort/order-statistic.ts)

### Dynamic Programming:
- [Maximum Subarray (O(n) solution)](./src/dp/maximum-subarray.ts)
- [Longest Common Subsequence](./src/dp/longest-common-subsequence.ts)
- [Number Triangle](./src/dp/number-triangle.ts)
- [Longest Palindromic Subsequence](./src/dp/longest-palindrome-subseq.ts)
- [Minimum Edit Distance](./src/dp/min-edit-distance.ts)
- [0/1 Knapsack](./src/dp/0-1-knapsack.ts)
- [Complete Knapsack](./src/dp/complete-knapsack.ts)
- [Multi Knapsack](./src/dp/multi-knapsack.ts)

### Greedy Algorithms:
- [Activity Selection](./src/greedy/activity-select.ts)
- [Huffman Coding](./src/greedy/huffman-code.ts)

### Divide and Conquer:
- [Merge Sort](./src/sort/merge-sort.ts)
- [Quick Sort](./src/sort/quick-sort.ts)
- [Inversion Pairs](./src/divide-and-conquer/inversion-pair.ts)
- [Maximum Subarray (Maximum Subarray Sum)](./src/divide-and-conquer/maximum-subarray.ts)
