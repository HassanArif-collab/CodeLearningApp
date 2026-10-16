export interface AffiliateOffer {
  id: string;
  category: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  url: string;
  estimatedCommissionNote: string; // For site owner reference
}

export const MONETIZATION_CONFIG = {
  ads: {
    enabled: true,
    showPlaceholderInDev: true, // Shows non-intrusive preview banner until AdSense is approved
    googleAdSenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
    slots: {
      topLeaderboard: '1111111111',
      visualizerSidebar: '2222222222',
      belowExplanation: '3333333333',
    },
  },
  affiliates: [
    {
      id: 'dsa-interview',
      category: 'data-structures',
      badge: 'Interactive Lab',
      title: 'Ace Your Data Structures Lab & Coding Interviews',
      description: 'Hands-on text-based coding courses with interactive playgrounds and memory diagrams.',
      ctaText: 'Start Free Trial →',
      url: 'https://www.educative.io/',
      estimatedCommissionNote: '$15-$40 per student referral',
    },
    {
      id: 'cpp-pointers',
      category: 'memory-pointers',
      badge: 'Top University Course',
      title: 'Master C & C++ Pointers, Memory Management & Systems',
      description: 'Step-by-step video courses with certificates for university credit.',
      ctaText: 'View Syllabus →',
      url: 'https://www.coursera.org/',
      estimatedCommissionNote: 'up to 45% recurring commission',
    },
    {
      id: 'fundamentals-pack',
      category: 'fundamentals',
      badge: '$200 Free Credit',
      title: 'Free Cloud Hosting Credits for Student CS Projects',
      description: 'Host your semester web apps, databases, and APIs without paying a cent.',
      ctaText: 'Claim $200 Credit →',
      url: 'https://www.digitalocean.com/',
      estimatedCommissionNote: '$25 per student activation',
    },
    {
      id: 'algorithms-book',
      category: 'algorithms',
      badge: 'Visual Guide',
      title: 'Grokking Algorithms: Illustrated CS Guide',
      description: 'The #1 visual guide to algorithms and data structures for visual learners.',
      ctaText: 'Get the Book →',
      url: 'https://www.amazon.com/',
      estimatedCommissionNote: 'Amazon Associates affiliate fee',
    },
    {
      id: 'oop-design',
      category: 'oop',
      badge: 'Design Patterns',
      title: 'Refactoring Guru: Visual Design Patterns & OOP',
      description: 'Clear visual diagrams for Factory, Singleton, Observer, and SOLID principles.',
      ctaText: 'Explore Patterns →',
      url: 'https://refactoring.guru/',
      estimatedCommissionNote: 'Direct affiliate partner',
    }
  ] as AffiliateOffer[],
};
