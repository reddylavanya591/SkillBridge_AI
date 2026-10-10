import { DsaProblem } from '../types';

export const DSA_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-01',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Use a HashMap to achieve O(N) time complexity
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in seen:
                return [seen[diff], i]
            seen[n] = i
        return []`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'nums = [2, 7, 11, 15], target = 9',
        expectedDisplay: '[0, 1]',
        inputRaw: { nums: [2, 7, 11, 15], target: 9 },
        expectedRaw: [0, 1]
      },
      {
        id: 'tc-2',
        inputDisplay: 'nums = [3, 2, 4], target = 6',
        expectedDisplay: '[1, 2]',
        inputRaw: { nums: [3, 2, 4], target: 6 },
        expectedRaw: [1, 2]
      },
      {
        id: 'tc-3',
        inputDisplay: 'nums = [3, 3], target = 6',
        expectedDisplay: '[0, 1]',
        inputRaw: { nums: [3, 3], target: 6 },
        expectedRaw: [0, 1]
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #1: Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        problemIdOrSlug: '1'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode 150: Two Sum',
        url: 'https://neetcode.io/problems/two-integer-sum',
        problemIdOrSlug: 'two-integer-sum'
      },
      {
        platform: 'GeeksforGeeks',
        name: 'GFG: Key Pair (Two Sum)',
        url: 'https://www.geeksforgeeks.org/check-if-pair-with-given-sum-exists-in-array/',
        problemIdOrSlug: 'key-pair'
      }
    ],
    hints: [
      'A brute force O(N^2) checks every pair. Can you store visited values in a Hash Map to look up complements in O(1)?',
      'Key is the number value, value is its index in the array.'
    ],
    leetcodeNumber: 1,
    acceptanceRate: '52.4%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50', 'Daily Challenge'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-02',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack & Queue',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    starterCode: {
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      javascript: `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    for (const c of s) {
        if (c === '(' || c === '{' || c === '[') {
            stack.push(c);
        } else {
            if (stack.length === 0 || stack.pop() !== pairs[c]) return false;
        }
    }
    return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 's = "()"',
        expectedDisplay: 'true',
        inputRaw: { s: '()' },
        expectedRaw: true
      },
      {
        id: 'tc-2',
        inputDisplay: 's = "()[]{}"',
        expectedDisplay: 'true',
        inputRaw: { s: '()[]{}' },
        expectedRaw: true
      },
      {
        id: 'tc-3',
        inputDisplay: 's = "(]"',
        expectedDisplay: 'false',
        inputRaw: { s: '(]' },
        expectedRaw: false
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #20: Valid Parentheses',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        problemIdOrSlug: '20'
      },
      {
        platform: 'HackerRank',
        name: 'HackerRank: Balanced Brackets',
        url: 'https://www.hackerrank.com/challenges/balanced-brackets/problem',
        problemIdOrSlug: 'balanced-brackets'
      }
    ],
    hints: [
      'Use a Last-In First-Out (LIFO) Stack data structure.',
      'Whenever you encounter an opening bracket, push its expected closing bracket onto the stack.'
    ],
    leetcodeNumber: 20,
    acceptanceRate: '40.8%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-03',
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    category: 'Two Pointers',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    starterCode: {
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }
}`,
      javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    return maxProfit;
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_p = float('inf')
        max_p = 0
        for p in prices:
            if p < min_p:
                min_p = p
            elif p - min_p > max_p:
                max_p = p - min_p
        return max_p`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'prices = [7, 1, 5, 3, 6, 4]',
        expectedDisplay: '5',
        inputRaw: { prices: [7, 1, 5, 3, 6, 4] },
        expectedRaw: 5
      },
      {
        id: 'tc-2',
        inputDisplay: 'prices = [7, 6, 4, 3, 1]',
        expectedDisplay: '0',
        inputRaw: { prices: [7, 6, 4, 3, 1] },
        expectedRaw: 0
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #121: Stock Buy & Sell',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        problemIdOrSlug: '121'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode: Buy and Sell Stock',
        url: 'https://neetcode.io/problems/buy-and-sell-crypto',
        problemIdOrSlug: 'buy-and-sell-crypto'
      }
    ],
    hints: [
      'Maintain the minimum price seen so far as you iterate through the list.',
      'Calculate the difference between the current price and minimum price to update max profit in a single pass O(N).'
    ],
    leetcodeNumber: 121,
    acceptanceRate: '54.1%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-04',
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.

If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    starterCode: {
      java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
      javascript: `function search(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return -1`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        expectedDisplay: '4',
        inputRaw: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
        expectedRaw: 4
      },
      {
        id: 'tc-2',
        inputDisplay: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        expectedDisplay: '-1',
        inputRaw: { nums: [-1, 0, 3, 5, 9, 12], target: 2 },
        expectedRaw: -1
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #704: Binary Search',
        url: 'https://leetcode.com/problems/binary-search/',
        problemIdOrSlug: '704'
      },
      {
        platform: 'HackerRank',
        name: 'HackerRank: Binary Search',
        url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript',
        problemIdOrSlug: 'binary-search'
      }
    ],
    hints: [
      'Maintain two pointers: left and right.',
      'Compute mid = left + (right - left) / 2 to prevent integer overflow.'
    ],
    leetcodeNumber: 704,
    acceptanceRate: '57.8%',
    curatedLists: ['Blind 75', 'NeetCode 150'],
    frequency: 'High'
  },
  {
    id: 'dsa-05',
    title: 'Subarray Sum Equals K',
    slug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`k\`, return the total number of subarrays whose sum equals to \`k\`.

A subarray is a contiguous **non-empty** sequence of elements within an array.`,
    examples: [
      {
        input: 'nums = [1, 1, 1], k = 2',
        output: '2'
      },
      {
        input: 'nums = [1, 2, 3], k = 3',
        output: '2'
      }
    ],
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7'
    ],
    starterCode: {
      java: `class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0, currentSum = 0;
        Map<Integer, Integer> prefixSumMap = new HashMap<>();
        prefixSumMap.put(0, 1);
        
        for (int n : nums) {
            currentSum += n;
            if (prefixSumMap.containsKey(currentSum - k)) {
                count += prefixSumMap.get(currentSum - k);
            }
            prefixSumMap.put(currentSum, prefixSumMap.getOrDefault(currentSum, 0) + 1);
        }
        return count;
    }
}`,
      javascript: `function subarraySum(nums, k) {
    let count = 0, sum = 0;
    const map = new Map();
    map.set(0, 1);
    for (const n of nums) {
        sum += n;
        if (map.has(sum - k)) count += map.get(sum - k);
        map.set(sum, (map.get(sum) || 0) + 1);
    }
    return count;
}`,
      python: `class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        count = 0
        curr_sum = 0
        prefix_sums = {0: 1}
        for n in nums:
            curr_sum += n
            if (curr_sum - k) in prefix_sums:
                count += prefix_sums[curr_sum - k]
            prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1
        return count`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'nums = [1, 1, 1], k = 2',
        expectedDisplay: '2',
        inputRaw: { nums: [1, 1, 1], k: 2 },
        expectedRaw: 2
      },
      {
        id: 'tc-2',
        inputDisplay: 'nums = [1, 2, 3], k = 3',
        expectedDisplay: '2',
        inputRaw: { nums: [1, 2, 3], k: 3 },
        expectedRaw: 2
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #560: Subarray Sum Equals K',
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        problemIdOrSlug: '560'
      },
      {
        platform: 'GeeksforGeeks',
        name: 'GFG: Subarrays with given sum',
        url: 'https://www.geeksforgeeks.org/number-subarrays-sum-exactly-equal-k/',
        problemIdOrSlug: 'subarray-sum'
      }
    ],
    hints: [
      'Think about prefix sums: prefixSum[j] - prefixSum[i] = k implies prefixSum[i] = prefixSum[j] - k.',
      'Use a HashMap storing prefixSum frequencies to count valid matches in O(N) time.'
    ],
    leetcodeNumber: 560,
    acceptanceRate: '43.2%',
    curatedLists: ['Top Interview 50', 'NeetCode 150'],
    frequency: 'High'
  },
  {
    id: 'dsa-06',
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    category: 'Linked List',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]'
      },
      {
        input: 'head = [1, 2]',
        output: '[2, 1]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: {
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
      javascript: `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      python: `class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'head = [1, 2, 3, 4, 5]',
        expectedDisplay: '[5, 4, 3, 2, 1]',
        inputRaw: { head: [1, 2, 3, 4, 5] },
        expectedRaw: [5, 4, 3, 2, 1]
      },
      {
        id: 'tc-2',
        inputDisplay: 'head = [1, 2]',
        expectedDisplay: '[2, 1]',
        inputRaw: { head: [1, 2] },
        expectedRaw: [2, 1]
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #206: Reverse Linked List',
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        problemIdOrSlug: '206'
      },
      {
        platform: 'GeeksforGeeks',
        name: 'GFG: Reverse a linked list',
        url: 'https://www.geeksforgeeks.org/reverse-a-linked-list/',
        problemIdOrSlug: 'reverse-linked-list'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode: Reverse Linked List',
        url: 'https://neetcode.io/problems/reverse-a-linked-list',
        problemIdOrSlug: 'reverse-a-linked-list'
      }
    ],
    hints: [
      'Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.',
      'Reverse in iterative O(N) time with O(1) extra space.'
    ],
    leetcodeNumber: 206,
    acceptanceRate: '75.6%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-07',
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    category: 'Trees',
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    examples: [
      {
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        output: '[4, 7, 2, 9, 6, 3, 1]'
      },
      {
        input: 'root = [2, 1, 3]',
        output: '[2, 3, 1]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: {
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`,
      javascript: `function invertTree(root) {
    if (!root) return null;
    const temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
}`,
      python: `class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'root = [4, 2, 7, 1, 3, 6, 9]',
        expectedDisplay: '[4, 7, 2, 9, 6, 3, 1]',
        inputRaw: { root: [4, 2, 7, 1, 3, 6, 9] },
        expectedRaw: [4, 7, 2, 9, 6, 3, 1]
      },
      {
        id: 'tc-2',
        inputDisplay: 'root = [2, 1, 3]',
        expectedDisplay: '[2, 3, 1]',
        inputRaw: { root: [2, 1, 3] },
        expectedRaw: [2, 3, 1]
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #226: Invert Binary Tree',
        url: 'https://leetcode.com/problems/invert-binary-tree/',
        problemIdOrSlug: '226'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode: Invert Binary Tree',
        url: 'https://neetcode.io/problems/invert-a-binary-tree',
        problemIdOrSlug: 'invert-a-binary-tree'
      }
    ],
    hints: [
      'Use recursion (DFS) or level-order traversal (BFS) with a queue.',
      'Swap the left and right child pointers at every visited node.'
    ],
    leetcodeNumber: 226,
    acceptanceRate: '77.2%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'High'
  },
  {
    id: 'dsa-08',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length(), maxLen = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int right = 0, left = 0; right < n; right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(map.get(c) + 1, left);
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      javascript: `function lengthOfLongestSubstring(s) {
    let maxLen = 0;
    const map = new Map();
    for (let right = 0, left = 0; right < s.length; right++) {
        const c = s[right];
        if (map.has(c)) {
            left = Math.max(map.get(c) + 1, left);
        }
        map.set(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_len = 0
        for right, char in enumerate(s):
            if char in char_map:
                left = max(char_map[char] + 1, left)
            char_map[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 's = "abcabcbb"',
        expectedDisplay: '3',
        inputRaw: { s: 'abcabcbb' },
        expectedRaw: 3
      },
      {
        id: 'tc-2',
        inputDisplay: 's = "bbbbb"',
        expectedDisplay: '1',
        inputRaw: { s: 'bbbbb' },
        expectedRaw: 1
      },
      {
        id: 'tc-3',
        inputDisplay: 's = "pwwkew"',
        expectedDisplay: '3',
        inputRaw: { s: 'pwwkew' },
        expectedRaw: 3
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #3: Longest Substring Without Repeating Characters',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        problemIdOrSlug: '3'
      },
      {
        platform: 'GeeksforGeeks',
        name: 'GFG: Length of longest substring without repeating characters',
        url: 'https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/',
        problemIdOrSlug: 'longest-substring'
      }
    ],
    hints: [
      'Use a sliding window with two pointers: left and right.',
      'Store each character and its most recent index in a Map to immediately skip duplicate occurrences.'
    ],
    leetcodeNumber: 3,
    acceptanceRate: '34.9%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-09',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total)'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    starterCode: {
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if i - coin >= 0:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'coins = [1, 2, 5], amount = 11',
        expectedDisplay: '3',
        inputRaw: { coins: [1, 2, 5], amount: 11 },
        expectedRaw: 3
      },
      {
        id: 'tc-2',
        inputDisplay: 'coins = [2], amount = 3',
        expectedDisplay: '-1',
        inputRaw: { coins: [2], amount: 3 },
        expectedRaw: -1
      },
      {
        id: 'tc-3',
        inputDisplay: 'coins = [1], amount = 0',
        expectedDisplay: '0',
        inputRaw: { coins: [1], amount: 0 },
        expectedRaw: 0
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #322: Coin Change',
        url: 'https://leetcode.com/problems/coin-change/',
        problemIdOrSlug: '322'
      },
      {
        platform: 'HackerRank',
        name: 'HackerRank: The Coin Change Problem',
        url: 'https://www.hackerrank.com/challenges/coin-change/problem',
        problemIdOrSlug: 'coin-change'
      }
    ],
    hints: [
      'Define dp[i] as the minimum coins needed to make amount i.',
      'Transition: dp[i] = min(dp[i], dp[i - coin] + 1) for each available coin.'
    ],
    leetcodeNumber: 322,
    acceptanceRate: '43.7%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-10',
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    starterCode: {
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int count : counts) {
            if (count != 0) return false;
        }
        return true;
    }
}`,
      javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const count = {};
    for (const char of s) count[char] = (count[char] || 0) + 1;
    for (const char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    return true;
}`,
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = {}
        for c in s:
            count[c] = count.get(c, 0) + 1
        for c in t:
            if c not in count or count[c] == 0:
                return False
            count[c] -= 1
        return True`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 's = "anagram", t = "nagaram"',
        expectedDisplay: 'true',
        inputRaw: { s: 'anagram', t: 'nagaram' },
        expectedRaw: true
      },
      {
        id: 'tc-2',
        inputDisplay: 's = "rat", t = "car"',
        expectedDisplay: 'false',
        inputRaw: { s: 'rat', t: 'car' },
        expectedRaw: false
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #242: Valid Anagram',
        url: 'https://leetcode.com/problems/valid-anagram/',
        problemIdOrSlug: '242'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode: Is Anagram',
        url: 'https://neetcode.io/problems/is-anagram',
        problemIdOrSlug: 'is-anagram'
      }
    ],
    hints: [
      'An anagram requires matching character frequencies.',
      'Use a fixed-size integer array of length 26 or a hash map.'
    ],
    leetcodeNumber: 242,
    acceptanceRate: '64.2%',
    curatedLists: ['Blind 75', 'NeetCode 150'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-11',
    title: '3Sum',
    slug: 'three-sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1, 0, 1, 2, -1, -4]',
        output: '[[-1, -1, 2], [-1, 0, 1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. Notice the solution set must not contain duplicate triplets.'
      },
      {
        input: 'nums = [0, 1, 1]',
        output: '[]'
      }
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    starterCode: {
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`,
      javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const sum = nums[i] + nums[l] + nums[r];
            if (sum === 0) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]:
                        l += 1
                    while l < r and nums[r] == nums[r - 1]:
                        r -= 1
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'nums = [-1, 0, 1, 2, -1, -4]',
        expectedDisplay: '[[-1, -1, 2], [-1, 0, 1]]',
        inputRaw: { nums: [-1, 0, 1, 2, -1, -4] },
        expectedRaw: [[-1, -1, 2], [-1, 0, 1]]
      },
      {
        id: 'tc-2',
        inputDisplay: 'nums = [0, 1, 1]',
        expectedDisplay: '[]',
        inputRaw: { nums: [0, 1, 1] },
        expectedRaw: []
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #15: 3Sum',
        url: 'https://leetcode.com/problems/3sum/',
        problemIdOrSlug: '15'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode: 3Sum',
        url: 'https://neetcode.io/problems/three-integer-sum',
        problemIdOrSlug: 'three-integer-sum'
      }
    ],
    hints: [
      'Sort the array first. Fix one number nums[i], then use two pointers for the remaining pair.',
      'Skip duplicates for both the fixed number and the two pointers to avoid duplicate triplets.'
    ],
    leetcodeNumber: 15,
    acceptanceRate: '34.6%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50'],
    frequency: 'Very High'
  },
  {
    id: 'dsa-12',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.'
      },
      {
        input: 'height = [4, 2, 0, 3, 2, 5]',
        output: '9'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterCode: {
      java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0, trapped = 0;
        while (left < right) {
            if (height[left] <= height[right]) {
                if (height[left] >= maxLeft) maxLeft = height[left];
                else trapped += maxLeft - height[left];
                left++;
            } else {
                if (height[right] >= maxRight) maxRight = height[right];
                else trapped += maxRight - height[right];
                right--;
            }
        }
        return trapped;
    }
}`,
      javascript: `function trap(height) {
    let left = 0, right = height.length - 1;
    let maxLeft = 0, maxRight = 0, trapped = 0;
    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= maxLeft) maxLeft = height[left];
            else trapped += maxLeft - height[left];
            left++;
        } else {
            if (height[right] >= maxRight) maxRight = height[right];
            else trapped += maxRight - height[right];
            right--;
        }
    }
    return trapped;
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        max_l, max_r = 0, 0
        trapped = 0
        while l < r:
            if height[l] <= height[r]:
                if height[l] >= max_l:
                    max_l = height[l]
                else:
                    trapped += max_l - height[l]
                l += 1
            else:
                if height[r] >= max_r:
                    max_r = height[r]
                else:
                    trapped += max_r - height[r]
                r -= 1
        return trapped`
    },
    testCases: [
      {
        id: 'tc-1',
        inputDisplay: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        expectedDisplay: '6',
        inputRaw: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },
        expectedRaw: 6
      },
      {
        id: 'tc-2',
        inputDisplay: 'height = [4, 2, 0, 3, 2, 5]',
        expectedDisplay: '9',
        inputRaw: { height: [4, 2, 0, 3, 2, 5] },
        expectedRaw: 9
      }
    ],
    externalLinks: [
      {
        platform: 'LeetCode',
        name: 'LeetCode #42: Trapping Rain Water',
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        problemIdOrSlug: '42'
      },
      {
        platform: 'NeetCode',
        name: 'NeetCode: Trapping Rain Water',
        url: 'https://neetcode.io/problems/trapping-rain-water',
        problemIdOrSlug: 'trapping-rain-water'
      }
    ],
    hints: [
      'Water trapped above a bar depends on min(maxLeft, maxRight) - height[i].',
      'Use two pointers starting from ends moving towards the center to achieve O(N) time and O(1) space.'
    ],
    leetcodeNumber: 42,
    acceptanceRate: '61.8%',
    curatedLists: ['Blind 75', 'NeetCode 150', 'Top Interview 50', 'Daily Challenge'],
    frequency: 'Very High'
  }
];
