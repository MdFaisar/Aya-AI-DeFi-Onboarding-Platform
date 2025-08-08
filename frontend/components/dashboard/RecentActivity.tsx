'use client'

import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  BeakerIcon,
  TrophyIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

// Mock data - in production, this would come from API
const activities = [
  {
    id: 1,
    type: 'lesson_completed',
    title: 'Completed "Understanding Liquidity Pools"',
    description: 'Learned about AMM mechanics and impermanent loss',
    timestamp: '2 hours ago',
    icon: AcademicCapIcon,
    iconColor: 'text-primary-500',
    iconBg: 'bg-primary-50'
  },
  {
    id: 2,
    type: 'quiz_passed',
    title: 'Passed DeFi Basics Quiz',
    description: 'Scored 85% on fundamental concepts',
    timestamp: '1 day ago',
    icon: CheckCircleIcon,
    iconColor: 'text-success-500',
    iconBg: 'bg-success-50'
  },
  {
    id: 3,
    type: 'simulation_completed',
    title: 'Simulated Uniswap Token Swap',
    description: 'Successfully swapped ETH for USDC on testnet',
    timestamp: '2 days ago',
    icon: BeakerIcon,
    iconColor: 'text-secondary-500',
    iconBg: 'bg-secondary-50'
  },
  {
    id: 4,
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked: First Steps',
    description: 'Completed your first DeFi lesson',
    timestamp: '3 days ago',
    icon: TrophyIcon,
    iconColor: 'text-warning-500',
    iconBg: 'bg-warning-50'
  },
  {
    id: 5,
    type: 'lesson_started',
    title: 'Started "Yield Farming Strategies"',
    description: 'Currently in progress',
    timestamp: '3 days ago',
    icon: ClockIcon,
    iconColor: 'text-neutral-500',
    iconBg: 'bg-neutral-50'
  }
]

export function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${activity.iconBg} flex items-center justify-center`}>
              <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-neutral-900">
                {activity.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                {activity.timestamp}
              </p>
            </div>

            {activity.type === 'lesson_completed' && (
              <div className="flex-shrink-0">
                <span className="badge badge-success text-xs">+10 XP</span>
              </div>
            )}
            
            {activity.type === 'quiz_passed' && (
              <div className="flex-shrink-0">
                <span className="badge badge-success text-xs">+15 XP</span>
              </div>
            )}
            
            {activity.type === 'simulation_completed' && (
              <div className="flex-shrink-0">
                <span className="badge badge-success text-xs">+20 XP</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Activity summary */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-neutral-900">12</div>
            <div className="text-xs text-neutral-600">This Week</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-neutral-900">45</div>
            <div className="text-xs text-neutral-600">This Month</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-neutral-900">156</div>
            <div className="text-xs text-neutral-600">Total XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}
