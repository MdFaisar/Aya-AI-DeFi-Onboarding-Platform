'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldExclamationIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { aiService, RiskAssessment } from '@/lib/ai-service'

interface AIRiskAssessmentProps {
  portfolioData?: any
  autoAssess?: boolean
}

export function AIRiskAssessment({ portfolioData, autoAssess = false }: AIRiskAssessmentProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (autoAssess && portfolioData) {
      handleAssessRisk()
    }
  }, [autoAssess, portfolioData])

  const handleAssessRisk = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await aiService.assessRisk(portfolioData || {
        // Mock portfolio data if none provided
        protocols: ['uniswap', 'aave'],
        totalValue: 15000,
        positions: [
          { protocol: 'uniswap', type: 'liquidity', amount: 8000 },
          { protocol: 'aave', type: 'lending', amount: 7000 }
        ]
      })

      // Ensure the result has the expected structure
      const safeResult = {
        overallRisk: result?.overallRisk || 35,
        riskFactors: result?.riskFactors || [],
        recommendations: result?.recommendations || []
      }

      setAssessment(safeResult)
    } catch (err) {
      setError('Failed to assess risk. Please try again.')
      console.error('Error assessing risk:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900'
    if (score <= 60) return 'text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-900'
    return 'text-danger-600 bg-danger-50 dark:text-danger-400 dark:bg-danger-900'
  }

  const getRiskLevel = (score: number) => {
    if (score <= 30) return 'Low Risk'
    if (score <= 60) return 'Medium Risk'
    return 'High Risk'
  }

  const getRiskIcon = (score: number) => {
    if (score <= 30) return CheckCircleIcon
    if (score <= 60) return ExclamationTriangleIcon
    return ShieldExclamationIcon
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldExclamationIcon className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            AI Risk Assessment
          </h3>
        </div>
        
        {!autoAssess && (
          <button
            onClick={handleAssessRisk}
            disabled={isLoading}
            className="btn-primary text-sm"
          >
            {isLoading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              'Analyze Risk'
            )}
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              AI is analyzing your portfolio risk...
            </span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-700 rounded-lg"
        >
          <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
        </motion.div>
      )}

      {/* Assessment Results */}
      {assessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Risk Score */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-neutral-200 dark:text-neutral-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(assessment.overallRisk / 100) * 314} 314`}
                  className={
                    assessment.overallRisk <= 30 ? 'text-success-500' :
                    assessment.overallRisk <= 60 ? 'text-warning-500' : 'text-danger-500'
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {assessment.overallRisk}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Risk Score
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(assessment.overallRisk)}`}>
              {(() => {
                const Icon = getRiskIcon(assessment.overallRisk)
                return <Icon className="w-4 h-4" />
              })()}
              <span>{getRiskLevel(assessment.overallRisk)}</span>
            </div>
          </div>

          {/* Risk Factors */}
          {assessment.riskFactors && assessment.riskFactors.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Risk Factors
              </h4>
              <div className="space-y-3">
                {assessment.riskFactors.map((factor, index) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {factor.name}
                    </span>
                    <span className={`text-sm font-medium ${
                      factor.score <= 30 ? 'text-success-600 dark:text-success-400' :
                      factor.score <= 60 ? 'text-warning-600 dark:text-warning-400' :
                      'text-danger-600 dark:text-danger-400'
                    }`}>
                      {factor.score}/100
                    </span>
                  </div>
                  
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-2 rounded-full ${
                        factor.score <= 30 ? 'bg-success-500' :
                        factor.score <= 60 ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                    />
                  </div>
                  
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {factor.description}
                  </p>
                </motion.div>
              ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {assessment.recommendations && assessment.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
                AI Recommendations
              </h4>
              <div className="space-y-2">
                {assessment.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg"
                >
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={handleAssessRisk}
              className="btn-outline text-sm"
            >
              Reassess Risk
            </button>
            <button className="btn-ghost text-sm">
              View Detailed Report
            </button>
          </div>
        </motion.div>
      )}

      {/* Initial State */}
      {!assessment && !isLoading && !error && (
        <div className="text-center py-8">
          <ShieldExclamationIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
            Portfolio Risk Assessment
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Get AI-powered insights into your DeFi portfolio risks and personalized recommendations.
          </p>
          <button
            onClick={handleAssessRisk}
            className="btn-primary"
          >
            Start Risk Assessment
          </button>
        </div>
      )}
    </div>
  )
}
