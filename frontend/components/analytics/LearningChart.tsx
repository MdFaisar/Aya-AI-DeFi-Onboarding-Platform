'use client'

export function LearningChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Learning Progress Over Time</h3>
      
      <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-neutral-600">Chart visualization would go here</p>
          <p className="text-sm text-neutral-500 mt-1">
            Integration with Chart.js or similar library
          </p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-neutral-900">12</div>
          <div className="text-xs text-neutral-600">This Week</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-neutral-900">45</div>
          <div className="text-xs text-neutral-600">This Month</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-neutral-900">180</div>
          <div className="text-xs text-neutral-600">All Time</div>
        </div>
      </div>
    </div>
  )
}
