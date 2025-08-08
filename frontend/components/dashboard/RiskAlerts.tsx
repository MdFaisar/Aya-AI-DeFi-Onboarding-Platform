'use client'

import { motion } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

// Mock data - in production, this would come from API
const initialAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'High Gas Fees Detected',
    message: 'Current gas fees are 15% above average. Consider waiting for lower fees.',
    timestamp: '5 minutes ago',
    dismissible: true,
    actionText: 'Check Gas Tracker',
    actionHref: '/dashboard/gas-tracker'
  },
  {
    id: 2,
    type: 'info',
    title: 'New Protocol Added',
    message: 'Curve Finance is now available for risk assessment and simulations.',
    timestamp: '2 hours ago',
    dismissible: true,
    actionText: 'Explore Curve',
    actionHref: '/dashboard/protocols/curve'
  },
  {
    id: 3,
    type: 'success',
    title: 'Portfolio Health: Good',
    message: 'Your DeFi positions are well-diversified with low risk exposure.',
    timestamp: '1 day ago',
    dismissible: false,
    actionText: 'View Details',
    actionHref: '/dashboard/risk'
  }
]

const alertStyles = {
  warning: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-warning-500',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-200',
    textColor: 'text-warning-800'
  },
  info: {
    icon: InformationCircleIcon,
    iconColor: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
    borderColor: 'border-secondary-200',
    textColor: 'text-secondary-800'
  },
  success: {
    icon: ShieldCheckIcon,
    iconColor: 'text-success-500',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
    textColor: 'text-success-800'
  }
}

export function RiskAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts)

  const dismissAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Risk Alerts</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Settings
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <ShieldCheckIcon className="w-12 h-12 text-success-500 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-neutral-900 mb-1">All Clear!</h3>
          <p className="text-xs text-neutral-600">No risk alerts at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const style = alertStyles[alert.type as keyof typeof alertStyles]
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${style.bgColor} ${style.borderColor}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <style.icon className={`w-5 h-5 ${style.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${style.textColor}`}>
                          {alert.title}
                        </h3>
                        <p className={`text-xs mt-1 ${style.textColor} opacity-80`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-neutral-500 mt-2">
                          {alert.timestamp}
                        </p>
                      </div>
                      
                      {alert.dismissible && (
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="flex-shrink-0 ml-2 text-neutral-400 hover:text-neutral-600"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {alert.actionText && (
                      <div className="mt-3">
                        <a
                          href={alert.actionHref}
                          className={`text-xs font-medium ${style.iconColor} hover:underline`}
                        >
                          {alert.actionText} →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Risk monitoring status */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-neutral-600">Risk monitoring active</span>
          </div>
          <span className="text-neutral-500">Last check: 2 min ago</span>
        </div>
      </div>
    </div>
  )
}
