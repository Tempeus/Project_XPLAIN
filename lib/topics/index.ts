import type { Topic } from '../types'

export const TOPICS: Topic[] = [
  // Treasury
  {
    id: 'treasury-what-is',
    slug: 'what-is-the-us-treasury',
    name: 'What is the US Treasury?',
    category: 'treasury',
    emoji: '🏦',
    difficulty: 1,
    description: 'The government department that manages all the country\'s money',
  },
  {
    id: 'treasury-bonds',
    slug: 'government-bonds',
    name: 'Government Bonds',
    category: 'treasury',
    emoji: '📜',
    difficulty: 1,
    description: 'IOUs the government sells to borrow money from investors',
  },
  {
    id: 'treasury-bills-notes',
    slug: 't-bills-notes-bonds',
    name: 'T-Bills, T-Notes & T-Bonds',
    category: 'treasury',
    emoji: '⏱️',
    difficulty: 2,
    description: 'Different types of government debt with different time horizons',
  },
  {
    id: 'treasury-fed-vs-treasury',
    slug: 'fed-vs-treasury',
    name: 'Fed vs Treasury',
    category: 'treasury',
    emoji: '⚖️',
    difficulty: 2,
    description: 'Two powerful institutions that manage money — what\'s the difference?',
  },
  {
    id: 'treasury-yield-curve',
    slug: 'yield-curve',
    name: 'The Yield Curve',
    category: 'treasury',
    emoji: '📈',
    difficulty: 3,
    description: 'The secret signal economists watch to predict recessions',
  },
  {
    id: 'treasury-national-debt',
    slug: 'national-debt',
    name: 'National Debt',
    category: 'treasury',
    emoji: '💳',
    difficulty: 1,
    description: 'How much the government owes and why it matters to you',
  },
  {
    id: 'treasury-cash-mgmt',
    slug: 'cash-management',
    name: 'Cash Management',
    category: 'treasury',
    emoji: '💵',
    difficulty: 2,
    description: 'How the government makes sure it always has cash to pay its bills',
  },

  // Risk Management
  {
    id: 'risk-what-is',
    slug: 'what-is-financial-risk',
    name: 'What is Financial Risk?',
    category: 'risk',
    emoji: '🎲',
    difficulty: 1,
    description: 'The chance that something goes wrong with money or investments',
  },
  {
    id: 'risk-credit',
    slug: 'credit-risk',
    name: 'Credit Risk',
    category: 'risk',
    emoji: '🤝',
    difficulty: 1,
    description: 'What happens when someone you lent money to can\'t pay you back',
  },
  {
    id: 'risk-market',
    slug: 'market-risk',
    name: 'Market Risk',
    category: 'risk',
    emoji: '🌊',
    difficulty: 2,
    description: 'The risk that prices will move against you in unexpected ways',
  },
  {
    id: 'risk-liquidity',
    slug: 'liquidity-risk',
    name: 'Liquidity Risk',
    category: 'risk',
    emoji: '💧',
    difficulty: 2,
    description: 'The risk of not being able to get your money when you need it',
  },
  {
    id: 'risk-hedging',
    slug: 'hedging',
    name: 'Hedging',
    category: 'risk',
    emoji: '🛡️',
    difficulty: 2,
    description: 'Using financial instruments as insurance against bad outcomes',
  },
  {
    id: 'risk-var',
    slug: 'value-at-risk',
    name: 'Value at Risk (VaR)',
    category: 'risk',
    emoji: '📊',
    difficulty: 3,
    description: 'A mathematical way to measure how much you could lose on a bad day',
  },
  {
    id: 'risk-stress-test',
    slug: 'stress-testing',
    name: 'Stress Testing',
    category: 'risk',
    emoji: '💪',
    difficulty: 2,
    description: 'How regulators check if banks can survive a financial disaster',
  },

  // Accounting
  {
    id: 'accounting-what-is',
    slug: 'what-is-accounting',
    name: 'What is Accounting?',
    category: 'accounting',
    emoji: '📒',
    difficulty: 1,
    description: 'The language businesses use to keep track of money',
  },
  {
    id: 'accounting-balance-sheet',
    slug: 'balance-sheet',
    name: 'The Balance Sheet',
    category: 'accounting',
    emoji: '⚖️',
    difficulty: 1,
    description: 'A snapshot showing what a company owns and what it owes',
  },
  {
    id: 'accounting-income-statement',
    slug: 'income-statement',
    name: 'Income Statement',
    category: 'accounting',
    emoji: '💰',
    difficulty: 1,
    description: 'The report card that shows if a company made or lost money',
  },
  {
    id: 'accounting-cash-flow',
    slug: 'cash-flow-statement',
    name: 'Cash Flow Statement',
    category: 'accounting',
    emoji: '💸',
    difficulty: 2,
    description: 'Tracking the actual movement of cash in and out of a business',
  },
  {
    id: 'accounting-debits-credits',
    slug: 'debits-and-credits',
    name: 'Debits & Credits',
    category: 'accounting',
    emoji: '↔️',
    difficulty: 2,
    description: 'The two-sided system that keeps all accounting in balance',
  },
  {
    id: 'accounting-ale',
    slug: 'assets-liabilities-equity',
    name: 'Assets, Liabilities & Equity',
    category: 'accounting',
    emoji: '🧩',
    difficulty: 1,
    description: 'The three building blocks that every balance sheet is made of',
  },
]

export const TOPICS_BY_CATEGORY = {
  treasury: TOPICS.filter(t => t.category === 'treasury'),
  risk: TOPICS.filter(t => t.category === 'risk'),
  accounting: TOPICS.filter(t => t.category === 'accounting'),
}

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find(t => t.id === id)
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find(t => t.slug === slug)
}
