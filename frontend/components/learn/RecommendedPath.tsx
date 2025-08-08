'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const recommendedLessons = [
  {
    id: 'liquidity-pools',
    title: 'Liquidity Pools',
    description: 'Continue your current lesson',
    progress: 65,
    isNext: true
  },
  {
    id: 'yield-farming',
    title: 'Yield Farming Strategies',
    description: 'Recommended next topic',
    progress: 0,
    isNext: false
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Advanced concepts',
    progress: 0,
    isNext: false
  }
]

export function RecommendedPath() {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <SparklesIcon className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-neutral-900">Recommended Learning Path</h2>
      </div>

      <div className="space-y-4">
        {recommendedLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            {/* Step Number */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              lesson.isNext 
                ? 'bg-primary-500 text-white' 
                : index === 0 
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-neutral-100 text-neutral-500'
            }`}>
              {index + 1}
            </div>

            {/* Lesson Info */}
            <div className="flex-1">
              <h3 className="font-medium text-neutral-900">{lesson.title}</h3>
              <p className="text-sm text-neutral-600">{lesson.description}</p>
              {lesson.progress > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-500">Progress</span>
                    <span className="text-neutral-700">{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-1">
                    <div 
                      className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {lesson.isNext ? (
                <Link
                  href={`/dashboard/learn/${lesson.id}`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Continue
                </Link>
              ) : (
                <Link
                  href={`/dashboard/learn/${lesson.id}`}
                  className="btn-ghost text-sm px-4 py-2"
                >
                  Preview
                </Link>
              )}
            </div>

            {/* Arrow */}
            {index < recommendedLessons.length - 1 && (
              <div className="absolute left-4 mt-12">
                <ArrowRightIcon className="w-4 h-4 text-neutral-300 transform rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">
              Complete your learning path to unlock advanced features
            </p>
          </div>
          <Link
            href="/dashboard/learn/liquidity-pools"
            className="btn-primary text-sm"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  )
}
