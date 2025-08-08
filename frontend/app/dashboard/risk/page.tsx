import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { PortfolioRiskOverview } from '@/components/risk/PortfolioRiskOverview'
import { ProtocolRiskCards } from '@/components/risk/ProtocolRiskCards'
import { RiskAlerts } from '@/components/dashboard/RiskAlerts'
import { RiskEducation } from '@/components/risk/RiskEducation'
import { AIRiskAssessment } from '@/components/ai/AIRiskAssessment'

export default function RiskPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Risk Assessment</h1>
            <p className="text-neutral-600 mt-1">
              Monitor and manage your DeFi risk exposure
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-ghost">
              Connect Wallet
            </button>
            <button className="btn-primary">
              Analyze Portfolio
            </button>
          </div>
        </div>

        {/* Portfolio Risk Overview */}
        <PortfolioRiskOverview />

        {/* AI Risk Assessment */}
        <AIRiskAssessment autoAssess={true} />

        {/* Risk Alerts */}
        <RiskAlerts />

        {/* Protocol Risk Assessment */}
        <ProtocolRiskCards />

        {/* Risk Education */}
        <RiskEducation />

        {/* Risk Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <span className="text-primary-600">📊</span>
              </div>
              <h3 className="font-semibold text-neutral-900">Portfolio Analyzer</h3>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              Get detailed risk analysis of your entire DeFi portfolio
            </p>
            <button className="btn-primary w-full text-sm">
              Analyze Portfolio
            </button>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                <span className="text-warning-600">⚠️</span>
              </div>
              <h3 className="font-semibold text-neutral-900">Risk Simulator</h3>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              Simulate different market scenarios and their impact
            </p>
            <button className="btn-ghost w-full text-sm">
              Run Simulation
            </button>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                <span className="text-success-600">🛡️</span>
              </div>
              <h3 className="font-semibold text-neutral-900">Risk Monitor</h3>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              Set up automated alerts for risk threshold breaches
            </p>
            <button className="btn-ghost w-full text-sm">
              Setup Alerts
            </button>
          </div>
        </div>

        {/* Risk Methodology */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Risk Assessment Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-semibold">SC</span>
              </div>
              <h4 className="text-sm font-medium text-neutral-900">Smart Contract</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Audit history, code complexity, upgrade mechanisms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-semibold">LQ</span>
              </div>
              <h4 className="text-sm font-medium text-neutral-900">Liquidity</h4>
              <p className="text-xs text-neutral-600 mt-1">
                TVL, trading volume, market depth analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-600 font-semibold">VL</span>
              </div>
              <h4 className="text-sm font-medium text-neutral-900">Volatility</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Price volatility, impermanent loss potential
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-semibold">RG</span>
              </div>
              <h4 className="text-sm font-medium text-neutral-900">Regulatory</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Compliance status, regulatory clarity
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-semibold">TM</span>
              </div>
              <h4 className="text-sm font-medium text-neutral-900">Team</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Team reputation, governance structure
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600">
              <strong>Risk Score Calculation:</strong> Our proprietary algorithm combines these five factors 
              with real-time market data to provide comprehensive risk scores from 0-100, where 0 represents 
              the lowest risk and 100 represents the highest risk.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
