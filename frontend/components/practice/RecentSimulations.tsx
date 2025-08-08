'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const recentSimulations = [
  {
    id: 'sim_001',
    title: 'Uniswap ETH → USDC Swap',
    protocol: 'Uniswap',
    status: 'completed',
    result: 'Success',
    timestamp: '2 hours ago',
    successRate: 95,
    gasUsed: '150,000',
    value: '1.0 ETH → 1,850 USDC'
  },
  {
    id: 'sim_002',
    title: 'Aave USDC Lending',
    protocol: 'Aave',
    status: 'completed',
    result: 'Success',
    timestamp: '1 day ago',
    successRate: 88,
    gasUsed: '180,000',
    value: '1,000 USDC @ 3.5% APY'
  },
  {
    id: 'sim_003',
    title: 'Compound DAI Borrowing',
    protocol: 'Compound',
    status: 'failed',
    result: 'Failed',
    timestamp: '2 days ago',
    successRate: 0,
    gasUsed: '0',
    value: 'Insufficient collateral',
    error: 'Liquidation threshold exceeded'
  },
  {
    id: 'sim_004',
    title: 'Curve USDC → USDT Swap',
    protocol: 'Curve',
    status: 'completed',
    result: 'Success',
    timestamp: '3 days ago',
    successRate: 92,
    gasUsed: '120,000',
    value: '500 USDC → 499.8 USDT'
  }
]

const statusConfig = {
  completed: {
    icon: CheckCircleIcon,
    color: 'text-success-500',
    bgColor: 'bg-success-50'
  },
  failed: {
    icon: ExclamationTriangleIcon,
    color: 'text-danger-500',
    bgColor: 'bg-danger-50'
  },
  pending: {
    icon: ClockIcon,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50'
  }
}

export function RecentSimulations() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Recent Simulations</h2>
        <Link
          href="/dashboard/practice/history"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All History
        </Link>
      </div>

      <div className="space-y-4">
        {recentSimulations.map((simulation, index) => {
          const config = statusConfig[simulation.status as keyof typeof statusConfig]
          
          return (
            <motion.div
              key={simulation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {/* Status Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                <config.icon className={`w-5 h-5 ${config.color}`} />
              </div>

              {/* Simulation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-900 truncate">
                    {simulation.title}
                  </h3>
                  <span className="text-xs text-neutral-500 ml-2">
                    {simulation.timestamp}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-neutral-600">{simulation.protocol}</span>
                  <span className={`text-xs font-medium ${
                    simulation.status === 'completed' ? 'text-success-600' : 
                    simulation.status === 'failed' ? 'text-danger-600' : 'text-warning-600'
                  }`}>
                    {simulation.result}
                  </span>
                  {simulation.status === 'completed' && (
                    <span className="text-xs text-neutral-500">
                      {simulation.successRate}% success rate
                    </span>
                  )}
                </div>

                <div className="text-xs text-neutral-600 mt-1">
                  {simulation.value}
                  {simulation.error && (
                    <span className="text-danger-600 ml-2">• {simulation.error}</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                <Link
                  href={`/dashboard/practice/${simulation.id.split('_')[1]}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {simulation.status === 'failed' ? 'Retry' : 'View Details'}
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-neutral-900">12</div>
            <div className="text-xs text-neutral-600">Total Simulations</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success-600">89%</div>
            <div className="text-xs text-neutral-600">Success Rate</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-neutral-900">4.2M</div>
            <div className="text-xs text-neutral-600">Total Gas Saved</div>
          </div>
        </div>
      </div>
    </div>
  )
}
