'use client'

import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Lessons Completed',
    value: '12/20',
    percentage: 60,
    icon: AcademicCapIcon,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50'
  },
  {
    name: 'Current Streak',
    value: '7 days',
    percentage: 100,
    icon: FireIcon,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50'
  },
  {
    name: 'Achievements',
    value: '8/15',
    percentage: 53,
    icon: TrophyIcon,
    color: 'text-success-500',
    bgColor: 'bg-success-50'
  },
  {
    name: 'Skill Level',
    value: 'Intermediate',
    percentage: 75,
    icon: ChartBarIcon,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50'
  }
]

export function LearningProgress() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Your Learning Progress</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Details
        </button>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Overall Progress</span>
          <span className="text-sm text-neutral-600">65%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          You're doing great! Keep up the momentum to reach Expert level.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-lg font-semibold text-neutral-900">{stat.value}</div>
            <div className="text-xs text-neutral-600">{stat.name}</div>
            {stat.percentage < 100 && (
              <div className="mt-2">
                <div className="w-full bg-neutral-200 rounded-full h-1">
                  <motion.div
                    className={`h-1 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
