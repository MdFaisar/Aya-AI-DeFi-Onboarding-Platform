'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AcademicCapIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'Continue Learning',
    description: 'Resume your current lesson',
    href: '/dashboard/learn/current',
    icon: AcademicCapIcon,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
    hoverColor: 'hover:bg-primary-100'
  },
  {
    name: 'Practice Simulation',
    description: 'Try a safe transaction',
    href: '/dashboard/practice',
    icon: BeakerIcon,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
    hoverColor: 'hover:bg-secondary-100'
  },
  {
    name: 'Risk Assessment',
    description: 'Check your portfolio',
    href: '/dashboard/risk',
    icon: ShieldCheckIcon,
    color: 'text-danger-500',
    bgColor: 'bg-danger-50',
    hoverColor: 'hover:bg-danger-100'
  },
  {
    name: 'Ask AI Assistant',
    description: 'Get instant help',
    href: '/dashboard/chat',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-success-500',
    bgColor: 'bg-success-50',
    hoverColor: 'hover:bg-success-100'
  },
  {
    name: 'View Analytics',
    description: 'Track your progress',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50',
    hoverColor: 'hover:bg-warning-100'
  },
  {
    name: 'Take Quiz',
    description: 'Test your knowledge',
    href: '/dashboard/quiz',
    icon: PlayIcon,
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-50',
    hoverColor: 'hover:bg-neutral-100'
  }
]

export function QuickActions() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={action.href}
              className={`block p-4 rounded-lg border border-neutral-200 transition-all duration-200 ${action.hoverColor} hover:border-neutral-300 hover:shadow-sm group`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-700">
                    {action.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Featured action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">🎯 Recommended Next Step</h3>
            <p className="text-xs text-primary-100 mt-1">
              Based on your progress, we recommend learning about yield farming
            </p>
          </div>
          <Link
            href="/dashboard/learn/yield-farming"
            className="btn-ghost text-white border-white hover:bg-white hover:text-primary-600 text-sm px-4 py-2"
          >
            Start Lesson
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
