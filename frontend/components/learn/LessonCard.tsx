'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  progress: number
  isCompleted: boolean
  isLocked: boolean
  topics: string[]
}

interface LessonCardProps {
  lesson: Lesson
}

const difficultyColors = {
  beginner: 'text-success-600 bg-success-50',
  intermediate: 'text-warning-600 bg-warning-50',
  advanced: 'text-danger-600 bg-danger-50'
}

export function LessonCard({ lesson }: LessonCardProps) {
  const {
    id,
    title,
    description,
    difficulty,
    estimatedTime,
    progress,
    isCompleted,
    isLocked,
    topics
  } = lesson

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'card hover:shadow-lg transition-all duration-200',
        isLocked && 'opacity-60'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            isCompleted ? 'bg-success-50' : isLocked ? 'bg-neutral-100' : 'bg-primary-50'
          )}>
            {isCompleted ? (
              <CheckCircleIcon className="w-5 h-5 text-success-500" />
            ) : isLocked ? (
              <LockClosedIcon className="w-5 h-5 text-neutral-400" />
            ) : (
              <AcademicCapIcon className="w-5 h-5 text-primary-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <span className={clsx(
              'text-xs px-2 py-1 rounded-full font-medium',
              difficultyColors[difficulty]
            )}>
              {difficulty}
            </span>
          </div>
        </div>
        
        {!isLocked && (
          <Link
            href={`/dashboard/learn/${id}`}
            className="btn-ghost text-sm px-3 py-1"
          >
            {isCompleted ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
          </Link>
        )}
      </div>

      {/* Description */}
      <p className="text-neutral-600 text-sm mb-4">{description}</p>

      {/* Topics */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded"
            >
              {topic}
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-xs text-neutral-500">
              +{topics.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isLocked && progress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-neutral-600">Progress</span>
            <span className="text-neutral-900 font-medium">{progress}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4" />
          <span>{estimatedTime}</span>
        </div>
        
        {isCompleted && (
          <div className="flex items-center space-x-1 text-success-600">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
        
        {!isCompleted && !isLocked && progress > 0 && (
          <div className="flex items-center space-x-1 text-primary-600">
            <PlayIcon className="w-4 h-4" />
            <span>In Progress</span>
          </div>
        )}
        
        {isLocked && (
          <div className="flex items-center space-x-1 text-neutral-400">
            <LockClosedIcon className="w-4 h-4" />
            <span>Locked</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
