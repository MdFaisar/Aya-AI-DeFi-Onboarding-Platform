'use client'

import Link from 'next/link'

export function RiskEducation() {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Risk Education</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">📚 Smart Contract Risk</h3>
          <p className="text-sm text-blue-700 mb-3">
            Learn about code audits, upgrade mechanisms, and how to assess smart contract security.
          </p>
          <Link href="/dashboard/learn/smart-contract-risk" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Learn More →
          </Link>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-900 mb-2">💧 Liquidity Risk</h3>
          <p className="text-sm text-green-700 mb-3">
            Understand how liquidity affects your ability to exit positions and manage slippage.
          </p>
          <Link href="/dashboard/learn/liquidity-risk" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Learn More →
          </Link>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-900 mb-2">⚡ Impermanent Loss</h3>
          <p className="text-sm text-purple-700 mb-3">
            Master the concept of impermanent loss in liquidity provision and how to minimize it.
          </p>
          <Link href="/dashboard/learn/impermanent-loss" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  )
}
