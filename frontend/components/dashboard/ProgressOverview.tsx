'use client'

import { motion } from 'framer-motion'
import { 
  AcademicCapIcon, 
  BeakerIcon, 
  TrophyIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

// Mock data - in production, this would come from API
const progressData = {
  overallProgress: 65,
  currentLevel: 'Intermediate',
  lessonsCompleted: 12,
  totalLessons: 20,
  quizzesPassed: 8,
  totalQuizzes: 15,
  simulationsCompleted: 5,
  totalSimulations: 10,
  achievements: 7,
  streak: 5
}

const stats = [
  {
    name: 'Lessons Completed',
    value: `${progressData.lessonsCompleted}/${progressData.totalLessons}`,
    progress: (progressData.lessonsCompleted / progressData.totalLessons) * 100,
    icon: AcademicCapIcon,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50'
  },
  {
    name: 'Quizzes Passed',
    value: `${progressData.quizzesPassed}/${progressData.totalQuizzes}`,
    progress: (progressData.quizzesPassed / progressData.totalQuizzes) * 100,
    icon: ChartBarIcon,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50'
  },
  {
    name: 'Simulations',
    value: `${progressData.simulationsCompleted}/${progressData.totalSimulations}`,
    progress: (progressData.simulationsCompleted / progressData.totalSimulations) * 100,
    icon: BeakerIcon,
    color: 'text-success-500',
    bgColor: 'bg-success-50'
  },
  {
    name: 'Achievements',
    value: progressData.achievements,
    progress: 100,
    icon: TrophyIcon,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50'
  }
]

export function ProgressOverview() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Learning Progress</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">Current Level:</span>
          <span className="badge badge-success">{progressData.currentLevel}</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Overall Progress</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">{progressData.overallProgress}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressData.overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-lg font-semibold text-neutral-900">{stat.value}</div>
            <div className="text-xs text-neutral-600">{stat.name}</div>
            {stat.progress < 100 && (
              <div className="mt-2">
                <div className="w-full bg-neutral-200 rounded-full h-1">
                  <motion.div
                    className={`h-1 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Learning streak */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-neutral-900">Learning Streak</h3>
            <p className="text-xs text-neutral-600">Keep it up! Consistency is key to mastering DeFi.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">{progressData.streak}</div>
            <div className="text-xs text-neutral-600">days</div>
          </div>
        </div>
      </div>
    </div>
  )
}
