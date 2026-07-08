// Seed data containing 30 high-quality DSA questions

export const seedQuestions = [
  {
    id: "q1",
    questionText: "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (BST) of size N?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    explanation: "In a balanced BST (like an AVL or Red-Black tree), the height of the tree is guaranteed to be O(log N). Since searching traverses from root to leaf along a single path, the worst-case time complexity is O(log N)."
  },
  {
    id: "q2",
    questionText: "Which of the following data structures works on the Last In First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Singly Linked List", "Heap"],
    correctAnswer: 1,
    explanation: "A Stack is a linear data structure that follows the LIFO (Last In First Out) principle, where the element added last is the first one to be removed."
  },
  {
    id: "q3",
    questionText: "Which of the following is NOT a linear data structure?",
    options: ["Array", "Linked List", "Graph", "Queue"],
    correctAnswer: 2,
    explanation: "Arrays, Linked Lists, and Queues are linear data structures where elements are arranged sequentially. A Graph is a non-linear data structure consisting of nodes (vertices) connected by edges."
  },
  {
    id: "q4",
    questionText: "What is the worst-case time complexity of the Quick Sort algorithm?",
    options: ["O(N log N)", "O(N)", "O(N^2)", "O(2^N)"],
    correctAnswer: 2,
    explanation: "The worst case for Quick Sort occurs when the pivot consistently partitions the array into highly unbalanced sub-arrays (e.g., when the array is already sorted and the first or last element is chosen as the pivot). This results in a time complexity of O(N^2)."
  },
  {
    id: "q5",
    questionText: "Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?",
    options: ["Stack", "Queue", "Priority Queue", "Tree"],
    correctAnswer: 1,
    explanation: "BFS explores vertices level by level, starting from the source vertex. A Queue (FIFO) is used to track vertices that have been discovered but not yet fully processed, ensuring they are visited in order of their distance from the source."
  },
  {
    id: "q6",
    questionText: "What is the space complexity of the Floyd-Warshall algorithm for finding all-pairs shortest paths in a graph with V vertices?",
    options: ["O(V)", "O(V log V)", "O(V^2)", "O(V^3)"],
    correctAnswer: 2,
    explanation: "Floyd-Warshall is a dynamic programming algorithm that utilizes a V x V matrix to store shortest path distances between all pairs of vertices. Hence, its space complexity is O(V^2)."
  },
  {
    id: "q7",
    questionText: "What is the best-case time complexity of the Bubble Sort algorithm when optimized with a flag to detect if the array is already sorted?",
    options: ["O(1)", "O(N)", "O(N log N)", "O(N^2)"],
    correctAnswer: 1,
    explanation: "An optimized Bubble Sort checks if any swaps were made during a pass. If no swaps occur, the array is sorted, and the algorithm terminates. For an already sorted array, it completes in a single pass of N-1 comparisons, giving O(N) time complexity."
  },
  {
    id: "q8",
    questionText: "In a binary max-heap containing N elements, what is the worst-case time complexity to insert a new element?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    explanation: "Inserting a new element involves appending it to the end of the heap (bottom level) and moving it upward (heapifying up) to restore the max-heap property. Since the height of the heap is O(log N), this takes at most O(log N) operations."
  },
  {
    id: "q9",
    questionText: "Which hash collision resolution technique is also known as closed hashing?",
    options: ["Chaining", "Open Addressing", "Double Hashing", "Separate Chaining"],
    correctAnswer: 1,
    explanation: "Open Addressing is also known as closed hashing. In this technique, all elements are stored directly in the hash table array itself, and collisions are resolved by probing subsequent open slots."
  },
  {
    id: "q10",
    questionText: "What is the maximum height of a Red-Black Tree containing N nodes?",
    options: ["O(log N)", "O(N)", "O(N log N)", "O(sqrt(N))"],
    correctAnswer: 0,
    explanation: "A Red-Black Tree is a self-balancing binary search tree. Due to its balancing properties (e.g., no path from root to leaf is more than twice as long as any other path), its height is mathematically guaranteed to be at most 2 * log_2(N + 1), which is O(log N)."
  },
  {
    id: "q11",
    questionText: "Which pair of data structures is ideal to implement a Least Recently Used (LRU) Cache with O(1) lookup and O(1) insertion/deletion?",
    options: [
      "Stack and Array", 
      "Singly Linked List and Queue", 
      "Doubly Linked List and Hash Map", 
      "Binary Search Tree and Hash Map"
    ],
    correctAnswer: 2,
    explanation: "A Hash Map provides O(1) lookup to find cache nodes. A Doubly Linked List allows O(1) removal and insertion of elements at the head/tail to maintain the recency order."
  },
  {
    id: "q12",
    questionText: "What is the amortized time complexity of inserting an element at the end of a dynamic array (e.g., ArrayList in Java or std::vector in C++)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctAnswer: 0,
    explanation: "Most insertions take O(1) time because there is remaining space. When the array is full, it doubles in size, taking O(N) time to copy elements. However, since resizing happens infrequently, the average (amortized) cost of each insertion is O(1)."
  },
  {
    id: "q13",
    questionText: "Which traversal of a Binary Search Tree (BST) visits the nodes in sorted ascending order?",
    options: ["Pre-order traversal", "In-order traversal", "Post-order traversal", "Level-order traversal"],
    correctAnswer: 1,
    explanation: "In-order traversal visits the left subtree, then the root node, and finally the right subtree. For a BST, this sequence matches the sorting criteria, producing elements in sorted ascending order."
  },
  {
    id: "q14",
    questionText: "Which algorithm finds the shortest path in a weighted graph containing negative edge weights but no negative-weight cycles?",
    options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Kruskal's Algorithm", "Prim's Algorithm"],
    correctAnswer: 1,
    explanation: "Dijkstra's algorithm can fail on negative weight edges because it assumes path lengths are monotonically increasing. The Bellman-Ford algorithm correctly handles graphs with negative edge weights and can also detect negative-weight cycles."
  },
  {
    id: "q15",
    questionText: "What is the time complexity of building a binary heap of size N from an unsorted array using the bottom-up heapify method (Floyd's build-heap)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 2,
    explanation: "While inserting N elements one-by-one into a heap takes O(N log N) time, the bottom-up build-heap algorithm processes elements from the leaves upward, taking advantage of the fact that most nodes are at the bottom where heapify-down is cheap. The sum of work evaluates to O(N)."
  },
  {
    id: "q16",
    questionText: "Which of the following is NOT a self-balancing binary search tree?",
    options: ["AVL Tree", "Red-Black Tree", "Splay Tree", "B-Tree"],
    correctAnswer: 3,
    explanation: "AVL Trees, Red-Black Trees, and Splay Trees are all binary search trees (BSTs) that self-balance. A B-Tree is a self-balancing search tree but is NOT a binary tree, as its nodes can have many more than two child nodes."
  },
  {
    id: "q17",
    questionText: "What is the maximum number of edges in a simple undirected graph containing V vertices?",
    options: ["V", "V * (V - 1)", "V * (V - 1) / 2", "2^V"],
    correctAnswer: 2,
    explanation: "In a complete undirected graph, every pair of vertices is connected by a unique edge. The number of such pairs is given by the combination formula C(V, 2) which is equal to V * (V - 1) / 2."
  },
  {
    id: "q18",
    questionText: "What is the time complexity of Kruskal's algorithm to find the Minimum Spanning Tree of a graph with V vertices and E edges?",
    options: ["O(V^2)", "O(E log E)", "O(E + V)", "O(V log V)"],
    correctAnswer: 1,
    explanation: "Kruskal's algorithm first sorts all edges in ascending order of their weights, which takes O(E log E) time. Then, it uses Union-Find operations to detect cycles, taking O(E * alpha(V)) time. Thus, the sorting step dominates, yielding a time complexity of O(E log E)."
  },
  {
    id: "q19",
    questionText: "What is a 'Trie' (prefix tree) primarily optimized for?",
    options: [
      "Finding the minimum spanning tree of a graph", 
      "Fast prefix-based searching and retrieval of string keys", 
      "Sorting floating-point numbers in linear time", 
      "Balancing highly unbalanced binary trees"
    ],
    correctAnswer: 1,
    explanation: "A Trie is a tree-like data structure used to store a dynamic set of strings, where keys are usually strings. It is optimized for fast search operations based on shared prefixes (e.g., autocomplete, dictionary searches)."
  },
  {
    id: "q20",
    questionText: "Which data structure is implicitly used by the system call stack to manage function execution and recursion?",
    options: ["Queue", "Stack", "Linked List", "Priority Queue"],
    correctAnswer: 1,
    explanation: "The call stack uses the Stack (LIFO) model. Whenever a function is invoked, its execution context is pushed onto the stack, and when the function returns, its context is popped off."
  },
  {
    id: "q21",
    questionText: "What is the average-case time complexity of searching for an element in a Hash Table?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctAnswer: 0,
    explanation: "With a good hash function that distributes keys uniformly, the index of any key can be calculated in O(1) time. Collision resolution chains remain short on average, leading to O(1) search time."
  },
  {
    id: "q22",
    questionText: "Which binary tree traversal visits the nodes in a top-down, level-by-level sequence?",
    options: ["In-order traversal", "Pre-order traversal", "Post-order traversal", "Level-order traversal"],
    correctAnswer: 3,
    explanation: "Level-order traversal visits nodes level by level (breadth-first traversal), starting from the root node (level 0), then its children (level 1), and so on."
  },
  {
    id: "q23",
    questionText: "What is the recurrence relation for the Merge Sort algorithm?",
    options: ["T(N) = T(N-1) + O(N)", "T(N) = 2T(N/2) + O(1)", "T(N) = 2T(N/2) + O(N)", "T(N) = T(N/2) + O(N)"],
    correctAnswer: 2,
    explanation: "Merge Sort recursively divides the array of size N into two halves, which costs 2T(N/2). Then, it merges the two sorted halves, which takes linear time O(N). The recurrence relation is therefore T(N) = 2T(N/2) + O(N)."
  },
  {
    id: "q24",
    questionText: "Given only a pointer to a node 'curr' in the middle of a Singly Linked List, what is the best time complexity to delete this node without traversing from the head?",
    options: ["O(1)", "O(N)", "O(log N)", "It is impossible without the head pointer"],
    correctAnswer: 0,
    explanation: "To delete the node 'curr' in O(1) time: copy the data of the next node (curr.next) into 'curr', and then update curr.next to point to curr.next.next. This effectively deletes the next node's structure while retaining its values in place of 'curr'."
  },
  {
    id: "q25",
    questionText: "Which data structure is typically used in Dijkstra's shortest path algorithm to retrieve the minimum distance vertex efficiently?",
    options: ["Queue", "Stack", "Min-Priority Queue", "Hash Map"],
    correctAnswer: 2,
    explanation: "To find the shortest path efficiently, Dijkstra's algorithm needs to repeatedly extract the vertex with the minimum tentative distance. A Min-Priority Queue (usually implemented via a Min-Heap) allows this extraction in O(log V) time."
  },
  {
    id: "q26",
    questionText: "What is a 'Sparse Matrix'?",
    options: [
      "A matrix filled primarily with diagonal elements",
      "A matrix where a high percentage of elements are zero",
      "A matrix representing a complete graph",
      "A matrix that cannot be represented using arrays"
    ],
    correctAnswer: 1,
    explanation: "A sparse matrix is a matrix in which most of the elements are zero. It is optimized using data structures like Compressed Sparse Row (CSR) to save memory by only storing non-zero values and their indices."
  },
  {
    id: "q27",
    questionText: "What is the time complexity of detecting cycles in an undirected graph using Depth-First Search (DFS), assuming representation by adjacency list?",
    options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
    correctAnswer: 2,
    explanation: "DFS visits every vertex at most once and traverses every edge at most once in an adjacency list. Thus, cycle detection via DFS runs in linear time relative to the size of the graph: O(V + E)."
  },
  {
    id: "q28",
    questionText: "What is the correct prefix notation for the mathematical postfix expression 'A B + C *'?",
    options: ["* + A B C", "+ * A B C", "A B + * C", "* C + A B"],
    correctAnswer: 0,
    explanation: "To convert 'A B + C *' to prefix: first evaluate 'A B +' which is '+ A B'. The expression becomes '(+ A B) C *'. Converting this outer postfix multiplication to prefix gives '* (+ A B) C', or '* + A B C'."
  },
  {
    id: "q29",
    questionText: "In a circular queue implemented using an array of size 'capacity', how is the 'Queue Full' condition determined (where front is the index of the first element and rear is the index of the last element)?",
    options: [
      "rear == front",
      "(rear + 1) % capacity == front",
      "rear == capacity - 1",
      "(front + 1) % capacity == rear"
    ],
    correctAnswer: 1,
    explanation: "A circular queue is full when the slot immediately following the rear index (modulo capacity) is equal to the front index. This leaves one slot empty intentionally to distinguish a full queue from an empty queue (which is rear == front)."
  },
  {
    id: "q30",
    questionText: "What is the worst-case time complexity of the Knuth-Morris-Pratt (KMP) string matching algorithm for a text of length N and pattern of length M?",
    options: ["O(N * M)", "O(N + M)", "O(N^2)", "O(log(N + M))"],
    correctAnswer: 1,
    explanation: "KMP avoids backtracking on the text by precomputing a prefix function (LPS array) for the pattern in O(M) time. The actual text matching takes O(N) time. The total time complexity is therefore linear: O(N + M)."
  }
];
