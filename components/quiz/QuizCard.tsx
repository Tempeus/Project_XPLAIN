'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, RefreshCw, ChevronRight, X, Trophy } from 'lucide-react'
import { cn, getCategoryAccentColor } from '@/lib/utils'
import type { Topic, QuizQuestion } from '@/lib/types'

interface QuizCardProps {
  topic: Topic
  onXP?: (amount: number) => void
  onClose?: () => void
  inline?: boolean
}

export default function QuizCard({ topic, onXP, onClose, inline = false }: QuizCardProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  const accentColor = getCategoryAccentColor(topic.category)

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicId: topic.id,
            topicName: topic.name,
            topicDescription: topic.description,
            count: 3,
          }),
        })
        const data = await res.json()
        setQuestions(data)
      } catch {
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [topic])

  function handleSelect(optionIndex: number) {
    if (answered) return
    setSelectedOption(optionIndex)
    setAnswered(true)

    const isCorrect = optionIndex === questions[currentIndex].correctIndex
    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
      onXP?.(20)
    } else {
      onXP?.(5)
    }

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: topic.id,
        action: isCorrect ? 'quiz_correct' : 'quiz_wrong',
      }),
    }).catch(() => {})
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setAnswered(false)
    } else {
      setDone(true)
    }
  }

  function handleRetry() {
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswered(false)
    setCorrectCount(0)
    setDone(false)
  }

  if (loading) {
    return (
      <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="shimmer-card h-12 rounded-xl" />
        ))}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 rounded-xl text-center text-sm" style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
        Could not load quiz questions. Try again later.
      </div>
    )
  }

  const question = questions[currentIndex]
  const scorePercent = Math.round((correctCount / questions.length) * 100)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-elevated)', border: `1px solid ${accentColor}25` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <span className="text-xs font-bold" style={{ color: accentColor }}>
          🧠 Quick Quiz
        </span>
        <div className="flex items-center gap-2">
          {!done && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {currentIndex + 1} / {questions.length}
            </span>
          )}
          {onClose && (
            <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="px-4 mb-3">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-4"
          >
            {/* Question */}
            <p className="font-display font-bold text-base mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {question.options.map((option, i) => {
                const isSelected = selectedOption === i
                const isCorrect = i === question.correctIndex
                let state: 'default' | 'correct' | 'wrong' | 'reveal' = 'default'

                if (answered) {
                  if (isCorrect) state = 'correct'
                  else if (isSelected && !isCorrect) state = 'wrong'
                  else state = 'reveal'
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3',
                      !answered && 'hover:border-opacity-60 cursor-pointer',
                      answered && 'cursor-default'
                    )}
                    style={{
                      background:
                        state === 'correct' ? 'rgba(34, 197, 94, 0.15)' :
                        state === 'wrong' ? 'rgba(239, 68, 68, 0.15)' :
                        state === 'reveal' ? 'transparent' :
                        'var(--bg-card)',
                      border:
                        state === 'correct' ? '1px solid rgba(34, 197, 94, 0.5)' :
                        state === 'wrong' ? '1px solid rgba(239, 68, 68, 0.5)' :
                        '1px solid var(--border)',
                      color:
                        state === 'correct' ? '#86EFAC' :
                        state === 'wrong' ? '#FCA5A5' :
                        state === 'reveal' ? 'var(--text-muted)' :
                        'var(--text-secondary)',
                    }}
                  >
                    {state === 'correct' && <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />}
                    {state === 'wrong' && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                    {(state === 'default' || state === 'reveal') && (
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                    )}
                    {option}
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation + Next */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div
                    className="p-3 rounded-xl text-xs leading-relaxed"
                    style={{
                      background: selectedOption === question.correctIndex ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${selectedOption === question.correctIndex ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span className="font-bold" style={{ color: selectedOption === question.correctIndex ? '#86EFAC' : '#FCA5A5' }}>
                      {selectedOption === question.correctIndex ? '✓ Correct! ' : '✗ Not quite. '}
                    </span>
                    {question.explanation}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                    style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30`, color: accentColor }}
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>Next question <ChevronRight size={14} /></>
                    ) : (
                      <>See results <Trophy size={14} /></>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 pb-6 text-center"
          >
            <motion.div
              className="text-5xl mb-3 mt-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {scorePercent === 100 ? '🏆' : scorePercent >= 67 ? '🎯' : '💪'}
            </motion.div>
            <h3 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
              {scorePercent === 100 ? 'Perfect!' : scorePercent >= 67 ? 'Great job!' : 'Keep going!'}
            </h3>
            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
              {correctCount} / {questions.length} correct
            </p>
            <p className="text-xs mb-5" style={{ color: '#A78BFA' }}>
              +{correctCount * 20 + (questions.length - correctCount) * 5} XP earned
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                <RefreshCw size={14} />
                Try again
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30`, color: accentColor }}
                >
                  Done ✓
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
