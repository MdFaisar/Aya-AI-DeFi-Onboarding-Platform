'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface Simulation {
  id: string
  title: string
  description: string
  protocol: string
  type: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  isCompleted: boolean
  successRate: number
  icon: string
}

interface SimulationCardProps {
  simulation: Simulation
}

const difficultyColors = {
  beginner: 'text-success-600 bg-success-50',
  intermediate: 'text-warning-600 bg-warning-50',
  advanced: 'text-danger-600 bg-danger-50'
}

const typeColors = {
  swap: 'bg-blue-50 text-blue-600',
  lending: 'bg-green-50 text-green-600',
  borrowing: 'bg-purple-50 text-purple-600',
  liquidity: 'bg-cyan-50 text-cyan-600',
  staking: 'bg-yellow-50 text-yellow-600'
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  const {
    id,
    title,
    description,
    protocol,
    type,
    difficulty,
    estimatedTime,
    isCompleted,
    successRate,
    icon
  } = simulation

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-neutral-600">{protocol}</span>
              <span className={clsx(
                'text-xs px-2 py-1 rounded-full font-medium',
                typeColors[type as keyof typeof typeColors] || 'bg-neutral-100 text-neutral-600'
              )}>
                {type}
              </span>
            </div>
          </div>
        </div>
        
        {isCompleted && (
          <CheckCircleIcon className="w-5 h-5 text-success-500" />
        )}
      </div>

      {/* Description */}
      <p className="text-neutral-600 text-sm mb-4">{description}</p>

      {/* Metadata */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-neutral-500">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            difficultyColors[difficulty]
          )}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Success Rate */}
      {isCompleted && successRate > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-neutral-600">Success Rate</span>
            <span className="text-neutral-900 font-medium">{successRate}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div
              className={clsx(
                'h-2 rounded-full',
                successRate >= 80 ? 'bg-success-500' : 
                successRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/practice/${id}`}
          className={clsx(
            'btn text-sm flex items-center space-x-2',
            isCompleted ? 'btn-ghost' : 'btn-primary'
          )}
        >
          <PlayIcon className="w-4 h-4" />
          <span>{isCompleted ? 'Practice Again' : 'Start Simulation'}</span>
        </Link>

        {isCompleted && (
          <Link
            href={`/dashboard/practice/${id}/results`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Results
          </Link>
        )}
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {isCompleted ? (
          <div className="bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full font-medium">
            Completed
          </div>
        ) : (
          <div className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full font-medium">
            New
          </div>
        )}
      </div>
    </motion.div>
  )
}
