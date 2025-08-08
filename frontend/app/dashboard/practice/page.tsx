import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { SimulationCard } from '@/components/practice/SimulationCard'
import { PracticeStats } from '@/components/practice/PracticeStats'
import { RecentSimulations } from '@/components/practice/RecentSimulations'

// Mock simulations data
const simulations = [
  {
    id: 'uniswap-swap',
    title: 'Uniswap Token Swap',
    description: 'Practice swapping tokens on Uniswap V3',
    protocol: 'Uniswap',
    type: 'swap',
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    isCompleted: true,
    successRate: 95,
    icon: '🔄'
  },
  {
    id: 'aave-lending',
    title: 'Aave Lending',
    description: 'Learn to lend tokens and earn interest',
    protocol: 'Aave',
    type: 'lending',
    difficulty: 'beginner',
    estimatedTime: '20 minutes',
    isCompleted: true,
    successRate: 88,
    icon: '💰'
  },
  {
    id: 'compound-borrowing',
    title: 'Compound Borrowing',
    description: 'Practice borrowing against collateral',
    protocol: 'Compound',
    type: 'borrowing',
    difficulty: 'intermediate',
    estimatedTime: '25 minutes',
    isCompleted: false,
    successRate: 0,
    icon: '🏦'
  },
  {
    id: 'uniswap-liquidity',
    title: 'Liquidity Provision',
    description: 'Provide liquidity to earn trading fees',
    protocol: 'Uniswap',
    type: 'liquidity',
    difficulty: 'advanced',
    estimatedTime: '30 minutes',
    isCompleted: false,
    successRate: 0,
    icon: '🌊'
  },
  {
    id: 'curve-stableswap',
    title: 'Curve Stablecoin Swap',
    description: 'Efficient swapping of stablecoins',
    protocol: 'Curve',
    type: 'swap',
    difficulty: 'intermediate',
    estimatedTime: '18 minutes',
    isCompleted: false,
    successRate: 0,
    icon: '📈'
  },
  {
    id: 'lido-staking',
    title: 'Ethereum Staking',
    description: 'Stake ETH and receive stETH tokens',
    protocol: 'Lido',
    type: 'staking',
    difficulty: 'beginner',
    estimatedTime: '12 minutes',
    isCompleted: false,
    successRate: 0,
    icon: '⚡'
  }
]

export default function PracticePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Practice DeFi</h1>
            <p className="text-neutral-600 mt-1">
              Safe simulations on testnet - practice without risk
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="input">
              <option>All Protocols</option>
              <option>Uniswap</option>
              <option>Aave</option>
              <option>Compound</option>
              <option>Curve</option>
              <option>Lido</option>
            </select>
            <select className="input">
              <option>All Types</option>
              <option>Swapping</option>
              <option>Lending</option>
              <option>Borrowing</option>
              <option>Staking</option>
              <option>Liquidity</option>
            </select>
          </div>
        </div>

        {/* Practice Stats */}
        <PracticeStats />

        {/* Recent Simulations */}
        <RecentSimulations />

        {/* Simulations Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Available Simulations</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-600">Difficulty:</span>
              <div className="flex space-x-2">
                <span className="badge badge-success text-xs">Beginner</span>
                <span className="badge badge-warning text-xs">Intermediate</span>
                <span className="badge badge-danger text-xs">Advanced</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulations.map((simulation) => (
              <SimulationCard key={simulation.id} simulation={simulation} />
            ))}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">ℹ️</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Safe Practice Environment</h3>
              <p className="text-sm text-blue-700 mt-1">
                All simulations run on testnet with fake tokens. No real money is at risk. 
                Practice as much as you want to build confidence before using real protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Get Started CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to practice?</h3>
              <p className="text-primary-100 mt-1">
                Start with a simple token swap to get familiar with DeFi interfaces
              </p>
            </div>
            <button className="btn-ghost text-white border-white hover:bg-white hover:text-primary-600">
              Start First Simulation
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
