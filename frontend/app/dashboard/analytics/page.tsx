import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview'
import { LearningChart } from '@/components/analytics/LearningChart'
import { PerformanceMetrics } from '@/components/analytics/PerformanceMetrics'
import { SkillRadar } from '@/components/analytics/SkillRadar'

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
            <p className="text-neutral-600 mt-1">
              Track your learning progress and performance insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="input">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
            <button className="btn-ghost">
              Export Data
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <AnalyticsOverview />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LearningChart />
          <SkillRadar />
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics />

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Learning Velocity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Lessons per week</span>
                <span className="text-sm font-medium text-neutral-900">2.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Quizzes per week</span>
                <span className="text-sm font-medium text-neutral-900">1.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Simulations per week</span>
                <span className="text-sm font-medium text-neutral-900">1.2</span>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Trend</span>
                  <span className="text-sm font-medium text-success-600">↗ Increasing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Engagement Patterns</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Peak learning hour</span>
                <span className="text-sm font-medium text-neutral-900">2:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Avg session duration</span>
                <span className="text-sm font-medium text-neutral-900">35 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Active days (30d)</span>
                <span className="text-sm font-medium text-neutral-900">22/30</span>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Consistency</span>
                  <span className="text-sm font-medium text-success-600">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Achievement Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Achievements unlocked</span>
                <span className="text-sm font-medium text-neutral-900">7/20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Rare achievements</span>
                <span className="text-sm font-medium text-neutral-900">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Points earned</span>
                <span className="text-sm font-medium text-neutral-900">450</span>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Next milestone</span>
                  <span className="text-sm font-medium text-primary-600">Expert Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📚 Learning Focus</h4>
              <p className="text-sm text-blue-700">
                Your yield farming knowledge is lagging behind other areas. 
                Consider completing the "Advanced Yield Strategies" lesson.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">🎯 Practice Suggestion</h4>
              <p className="text-sm text-green-700">
                You excel at basic swaps! Try the advanced liquidity provision 
                simulation to challenge yourself.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">⏰ Optimal Schedule</h4>
              <p className="text-sm text-yellow-700">
                Your peak performance is at 2 PM. Consider scheduling 
                challenging lessons during this time.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-purple-900 mb-2">🏆 Achievement Goal</h4>
              <p className="text-sm text-purple-700">
                You're 3 lessons away from the "DeFi Scholar" achievement. 
                Complete them to unlock exclusive content!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
