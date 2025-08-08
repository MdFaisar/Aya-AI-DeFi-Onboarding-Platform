'use client'

import { motion } from 'framer-motion'

const stats = [
  { name: 'Total Learning Time', value: '47h 32m', change: '+12%', trend: 'up' },
  { name: 'Lessons Completed', value: '18', change: '+3', trend: 'up' },
  { name: 'Quiz Average', value: '87%', change: '+5%', trend: 'up' },
  { name: 'Simulation Success', value: '92%', change: '-2%', trend: 'down' }
]

export function AnalyticsOverview() {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Performance Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-600 mb-2">{stat.name}</div>
            <div className={`text-xs font-medium ${
              stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {stat.change} from last month
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
