'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

// Mock data - in production, this would come from API
const learningPath = [
  {
    id: 1,
    title: 'DeFi Fundamentals',
    description: 'Learn the basics of decentralized finance',
    status: 'completed',
    progress: 100,
    estimatedTime: '2 hours',
    href: '/dashboard/learn/defi-fundamentals'
  },
  {
    id: 2,
    title: 'Understanding Wallets',
    description: 'Master wallet security and management',
    status: 'completed',
    progress: 100,
    estimatedTime: '1 hour',
    href: '/dashboard/learn/wallets'
  },
  {
    id: 3,
    title: 'Liquidity Pools',
    description: 'Deep dive into AMMs and liquidity provision',
    status: 'in_progress',
    progress: 65,
    estimatedTime: '3 hours',
    href: '/dashboard/learn/liquidity-pools'
  },
  {
    id: 4,
    title: 'Yield Farming',
    description: 'Learn advanced yield strategies',
    status: 'available',
    progress: 0,
    estimatedTime: '2.5 hours',
    href: '/dashboard/learn/yield-farming'
  },
  {
    id: 5,
    title: 'Risk Management',
    description: 'Advanced risk assessment techniques',
    status: 'locked',
    progress: 0,
    estimatedTime: '2 hours',
    href: '/dashboard/learn/risk-management'
  }
]

const statusConfig = {
  completed: {
    icon: CheckCircleIcon,
    iconColor: 'text-success-500',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200'
  },
  in_progress: {
    icon: PlayIcon,
    iconColor: 'text-primary-500',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200'
  },
  available: {
    icon: ClockIcon,
    iconColor: 'text-neutral-500',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200'
  },
  locked: {
    icon: LockClosedIcon,
    iconColor: 'text-neutral-400',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200'
  }
}

export function LearningPath() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Learning Path</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Customize
        </button>
      </div>

      <div className="space-y-3">
        {learningPath.map((lesson, index) => {
          const config = statusConfig[lesson.status as keyof typeof statusConfig]
          const isClickable = lesson.status !== 'locked'
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isClickable ? (
                <Link
                  href={lesson.href}
                  className={`block p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${config.bgColor} ${config.borderColor} ${
                    lesson.status === 'locked' ? 'opacity-60 cursor-not-allowed' : 'hover:border-opacity-80'
                  }`}
                >
                  <LessonContent lesson={lesson} config={config} />
                </Link>
              ) : (
                <div className={`p-4 rounded-lg border opacity-60 ${config.bgColor} ${config.borderColor}`}>
                  <LessonContent lesson={lesson} config={config} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress summary */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Overall Progress</span>
          <span className="font-medium text-neutral-900">
            {Math.round(learningPath.reduce((acc, lesson) => acc + lesson.progress, 0) / learningPath.length)}%
          </span>
        </div>
        <div className="mt-2 progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.round(learningPath.reduce((acc, lesson) => acc + lesson.progress, 0) / learningPath.length)}%` 
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Next milestone */}
      <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-neutral-900">Next Milestone</h3>
            <p className="text-xs text-neutral-600">Complete Liquidity Pools to unlock Yield Farming</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-600">35% remaining</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LessonContent({ lesson, config }: { lesson: any, config: any }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <config.icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-neutral-900">
          {lesson.title}
        </h3>
        <p className="text-xs text-neutral-600 mt-1">
          {lesson.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-neutral-500">
            {lesson.estimatedTime}
          </span>
          {lesson.status === 'in_progress' && (
            <span className="text-xs text-primary-600 font-medium">
              {lesson.progress}% complete
            </span>
          )}
        </div>
        
        {lesson.status === 'in_progress' && (
          <div className="mt-2">
            <div className="w-full bg-neutral-200 rounded-full h-1">
              <motion.div
                className="h-1 bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lesson.progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
