export type Category = 'treasury' | 'risk' | 'accounting'
export type Difficulty = 1 | 2 | 3

export interface Topic {
  id: string
  slug: string
  name: string
  category: Category
  emoji: string
  difficulty: Difficulty
  description: string
}

export interface CardContent {
  id?: string
  topicId: string
  title: string
  hook: string
  explanation: string
  keyPoints: string[]
  funFact: string
  analogy: string
}

export interface QuizQuestion {
  id?: string
  topicId: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface UserProgress {
  userId: string
  topicId: string
  masteryScore: number
  cardsRead: number
  quizzesTaken: number
  correctAnswers: number
}

export interface UserStreak {
  currentStreak: number
  longestStreak: number
  xp: number
  lastActivityDate: string | null
}

export interface QuizResult {
  questionId: string
  topicId: string
  isCorrect: boolean
  answeredAt: string
}
