export const sampleTopics = [
    {
        id: "topic-arrays",
        title: "Arrays",
        subTopics: [
            {
                id: "sub-arrays-1",
                title: "Easy",
                questions: [
                    {
                        id: "q-two-sum",
                        title: "Two Sum",
                        difficulty: "Easy",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/two-sum/" },
                            { platform: "CodingNinjas", url: "https://www.codingninjas.com/codestudio/problems/two-sum_839653" }
                        ],
                        bookmarked: false,
                        note: null
                    },
                    {
                        id: "q-pascal-triangle",
                        title: "Pascal's Triangle",
                        difficulty: "Easy",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/pascals-triangle/" },
                            { platform: "CodingNinjas", url: "https://www.codingninjas.com/codestudio/problems/pascal-s-triangle_1089580" }
                        ],
                        bookmarked: false,
                        note: null
                    }
                ]
            },
            {
                id: "sub-arrays-2",
                title: "Medium",
                questions: [
                    {
                        id: "q-set-matrix-zeroes",
                        title: "Set Matrix Zeroes",
                        difficulty: "Medium",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
                            { platform: "CodingNinjas", url: "https://www.codingninjas.com/codestudio/problems/set-matrix-zeros_3846774" }
                        ],
                        bookmarked: false,
                        note: null
                    },
                    {
                        id: "q-kadanes-algo",
                        title: "Kadane's Algorithm",
                        difficulty: "Medium",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/maximum-subarray/" },
                            { platform: "CodingNinjas", url: "https://www.codingninjas.com/codestudio/problems/maximum-subarray-sum_630526" }
                        ],
                        bookmarked: true, // Example bookmark
                        note: "Key idea: check if current sum < 0, then reset sum to 0." // Example note
                    },
                    {
                        id: "q-sort-colors",
                        title: "Sort Colors (0s, 1s and 2s)",
                        difficulty: "Medium",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/sort-colors/" }
                        ],
                        bookmarked: false,
                        note: null
                    }
                ]
            }
        ]
    },
    {
        id: "topic-linked-list",
        title: "Linked List",
        subTopics: [
            {
                id: "sub-ll-1",
                title: "Standard Problems",
                questions: [
                    {
                        id: "q-reverse-ll",
                        title: "Reverse Linked List",
                        difficulty: "Easy",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/reverse-linked-list/" },
                            { platform: "CodingNinjas", url: "https://www.codingninjas.com/codestudio/problems/reverse-the-singly-linked-list_799897" }
                        ],
                        bookmarked: false,
                        note: null
                    },
                    {
                        id: "q-middle-ll",
                        title: "Middle of the Linked List",
                        difficulty: "Easy",
                        links: [
                            { platform: "LeetCode", url: "https://leetcode.com/problems/middle-of-the-linked-list/" }
                        ],
                        bookmarked: false,
                        note: null
                    }
                ]
            }
        ]
    },
    {
        id: "topic-recursion",
        title: "Recursion",
        subTopics: [
            {
                id: "sub-recursion-1",
                title: "Basic",
                questions: [
                    {
                        id: "q-subset-sums",
                        title: "Subset Sums",
                        difficulty: "Medium",
                        links: [
                            { platform: "CodingNinjas", url: "https://www.codingninjas.com/codestudio/problems/subset-sum_3843086" }
                        ],
                        bookmarked: false,
                        note: null
                    }
                ]
            }
        ]
    }
];
