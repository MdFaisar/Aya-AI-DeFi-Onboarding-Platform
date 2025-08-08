'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SparklesIcon,
  LightBulbIcon,
  BookOpenIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { aiService, ConceptExplanation } from '@/lib/ai-service'

interface ConceptExplainerProps {
  concept?: string
  userLevel?: 'beginner' | 'intermediate' | 'advanced'
  onExplanationReceived?: (explanation: ConceptExplanation) => void
}

export function ConceptExplainer({ 
  concept: initialConcept, 
  userLevel = 'beginner',
  onExplanationReceived 
}: ConceptExplainerProps) {
  const [concept, setConcept] = useState(initialConcept || '')
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExplain = async () => {
    if (!concept.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await aiService.explainConcept(concept, userLevel)
      setExplanation(result)
      onExplanationReceived?.(result)
    } catch (err) {
      setError('Failed to get explanation. Please try again.')
      console.error('Error explaining concept:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900'
      case 'intermediate':
        return 'text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-900'
      case 'advanced':
        return 'text-danger-600 bg-danger-50 dark:text-danger-400 dark:bg-danger-900'
      default:
        return 'text-neutral-600 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-800'
    }
  }

  const popularConcepts = [
    'DeFi', 'Liquidity Pools', 'Yield Farming', 'Smart Contracts', 
    'AMM', 'Impermanent Loss', 'Staking', 'Flash Loans'
  ]

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <SparklesIcon className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          AI Concept Explainer
        </h3>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="label">What concept would you like me to explain?</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., Liquidity Pools, Yield Farming, DeFi..."
              className="input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleExplain()}
            />
            <button
              onClick={handleExplain}
              disabled={!concept.trim() || isLoading}
              className="btn-primary px-4 disabled:opacity-50"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <LightBulbIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Popular Concepts */}
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Popular concepts:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularConcepts.map((popularConcept) => (
              <button
                key={popularConcept}
                onClick={() => setConcept(popularConcept)}
                className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              >
                {popularConcept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-700 rounded-lg"
        >
          <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              AI is analyzing and explaining the concept...
            </span>
          </div>
        </motion.div>
      )}

      {/* Explanation Result */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          {/* Concept Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
              {explanation.concept}
            </h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(explanation.difficulty)}`}>
              {explanation.difficulty}
            </span>
          </div>

          {/* Explanation */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {explanation.explanation}
            </p>
          </div>

          {/* Examples */}
          {explanation.examples && explanation.examples.length > 0 && (
            <div>
              <h5 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center">
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Examples
              </h5>
              <ul className="space-y-1">
                {explanation.examples.map((example, index) => (
                  <li key={index} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Concepts */}
          {explanation.relatedConcepts && explanation.relatedConcepts.length > 0 && (
            <div>
              <h5 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Related Concepts
              </h5>
              <div className="flex flex-wrap gap-2">
                {explanation.relatedConcepts.map((relatedConcept, index) => (
                  <button
                    key={index}
                    onClick={() => setConcept(relatedConcept)}
                    className="text-sm bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                  >
                    {relatedConcept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => setConcept('')}
              className="btn-ghost text-sm"
            >
              Explain Another Concept
            </button>
            <button
              onClick={handleExplain}
              className="btn-outline text-sm"
            >
              Regenerate Explanation
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
