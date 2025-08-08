'use client'

export function PerformanceMetrics() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">4.2</div>
          <div className="text-sm text-blue-700">Avg Session (hours)</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">89%</div>
          <div className="text-sm text-green-700">Completion Rate</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 mb-1">7</div>
          <div className="text-sm text-yellow-700">Day Streak</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
          <div className="text-sm text-purple-700">Quiz Average</div>
        </div>
      </div>
    </div>
  )
}
