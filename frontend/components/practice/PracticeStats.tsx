'use client'

import { motion } from 'framer-motion'
import {
  BeakerIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Simulations Completed',
    value: '5',
    total: '12',
    percentage: 42,
    icon: BeakerIcon,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50'
  },
  {
    name: 'Success Rate',
    value: '92%',
    description: 'Average across all simulations',
    icon: CheckCircleIcon,
    color: 'text-success-500',
    bgColor: 'bg-success-50'
  },
  {
    name: 'Protocols Practiced',
    value: '3',
    total: '6',
    percentage: 50,
    icon: ChartBarIcon,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50'
  },
  {
    name: 'Practice Streak',
    value: '4 days',
    description: 'Keep practicing daily!',
    icon: TrophyIcon,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50'
  }
]

export function PracticeStats() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Practice Statistics</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Detailed Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {stat.value}
              {stat.total && (
                <span className="text-lg text-neutral-500 font-normal">/{stat.total}</span>
              )}
            </div>
            
            <div className="text-sm text-neutral-600 mb-2">{stat.name}</div>
            
            {stat.description && (
              <div className="text-xs text-neutral-500">{stat.description}</div>
            )}
            
            {stat.percentage && (
              <div className="mt-3">
                <div className="w-full bg-neutral-200 rounded-full h-1">
                  <motion.div
                    className={`h-1 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-1">{stat.percentage}% complete</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-neutral-900">Ready for your next challenge?</h3>
            <p className="text-xs text-neutral-600 mt-1">
              Try borrowing on Compound to learn about collateralized lending
            </p>
          </div>
          <button className="btn-primary text-sm">
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  )
}
