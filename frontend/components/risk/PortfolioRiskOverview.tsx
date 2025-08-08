'use client'

import { motion } from 'framer-motion'

export function PortfolioRiskOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Portfolio Risk Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-warning-600">35</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-900">Overall Risk Score</h3>
          <p className="text-xs text-neutral-600 mt-1">Medium Risk</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary-600">$15.7K</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-900">Total Portfolio Value</h3>
          <p className="text-xs text-neutral-600 mt-1">Across 4 protocols</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-success-600">85%</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-900">Liquidity Score</h3>
          <p className="text-xs text-neutral-600 mt-1">High liquidity</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Recommendation:</strong> Consider reducing ETH concentration below 50% to improve diversification.
        </p>
      </div>
    </motion.div>
  )
}
