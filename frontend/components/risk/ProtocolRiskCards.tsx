'use client'

import { motion } from 'framer-motion'

const protocols = [
  { name: 'Uniswap V3', risk: 25, category: 'DEX', tvl: '$4.2B', status: 'Low Risk' },
  { name: 'Aave V3', risk: 30, category: 'Lending', tvl: '$6.8B', status: 'Low Risk' },
  { name: 'Compound', risk: 45, category: 'Lending', tvl: '$2.1B', status: 'Medium Risk' },
  { name: 'Curve', risk: 35, category: 'DEX', tvl: '$3.5B', status: 'Medium Risk' }
]

export function ProtocolRiskCards() {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Protocol Risk Assessment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map((protocol, index) => (
          <motion.div
            key={protocol.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-neutral-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-neutral-900">{protocol.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                protocol.risk < 30 ? 'bg-success-50 text-success-600' :
                protocol.risk < 50 ? 'bg-warning-50 text-warning-600' :
                'bg-danger-50 text-danger-600'
              }`}>
                {protocol.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>{protocol.category}</span>
              <span>TVL: {protocol.tvl}</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Risk Score</span>
                <span>{protocol.risk}/100</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    protocol.risk < 30 ? 'bg-success-500' :
                    protocol.risk < 50 ? 'bg-warning-500' :
                    'bg-danger-500'
                  }`}
                  style={{ width: `${protocol.risk}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
