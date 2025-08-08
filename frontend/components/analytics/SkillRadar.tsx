'use client'

export function SkillRadar() {
  const skills = [
    { name: 'DeFi Basics', score: 95 },
    { name: 'Trading', score: 78 },
    { name: 'Lending', score: 85 },
    { name: 'Yield Farming', score: 62 },
    { name: 'Risk Management', score: 71 },
    { name: 'Security', score: 88 }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Skill Assessment</h3>
      
      <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg mb-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-neutral-600">Radar chart would go here</p>
          <p className="text-sm text-neutral-500 mt-1">
            Skill visualization across different DeFi areas
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">{skill.name}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
              <span className="text-sm font-medium text-neutral-900 w-8">{skill.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
