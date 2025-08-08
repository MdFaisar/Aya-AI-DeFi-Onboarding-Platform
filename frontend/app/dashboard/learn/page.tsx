import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { LessonCard } from '@/components/learn/LessonCard'
import { LearningProgress } from '@/components/learn/LearningProgress'
import { RecommendedPath } from '@/components/learn/RecommendedPath'
import { ConceptExplainer } from '@/components/ai/ConceptExplainer'

// Mock lessons data
const lessons = [
  {
    id: 'defi-fundamentals',
    title: 'DeFi Fundamentals',
    description: 'Learn the basics of decentralized finance',
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    progress: 100,
    isCompleted: true,
    isLocked: false,
    topics: ['What is DeFi', 'Traditional vs DeFi', 'Key Benefits', 'Common Risks']
  },
  {
    id: 'understanding-wallets',
    title: 'Understanding Wallets',
    description: 'Master wallet security and management',
    difficulty: 'beginner',
    estimatedTime: '25 minutes',
    progress: 100,
    isCompleted: true,
    isLocked: false,
    topics: ['Wallet Types', 'Security Best Practices', 'Private Keys', 'Seed Phrases']
  },
  {
    id: 'liquidity-pools',
    title: 'Liquidity Pools',
    description: 'Deep dive into liquidity provision and AMMs',
    difficulty: 'intermediate',
    estimatedTime: '50 minutes',
    progress: 65,
    isCompleted: false,
    isLocked: false,
    topics: ['How LPs Work', 'Impermanent Loss', 'Yield Farming', 'Risk Management']
  },
  {
    id: 'yield-farming',
    title: 'Yield Farming Strategies',
    description: 'Learn advanced yield optimization techniques',
    difficulty: 'advanced',
    estimatedTime: '60 minutes',
    progress: 0,
    isCompleted: false,
    isLocked: false,
    topics: ['Farming Strategies', 'Risk Assessment', 'Protocol Selection', 'Optimization']
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Advanced risk assessment and mitigation strategies',
    difficulty: 'advanced',
    estimatedTime: '55 minutes',
    progress: 0,
    isCompleted: false,
    isLocked: true,
    topics: ['Risk Types', 'Assessment Tools', 'Mitigation Strategies', 'Portfolio Management']
  }
]

export default function LearnPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Learn DeFi</h1>
            <p className="text-neutral-600 mt-1">
              Master decentralized finance with AI-powered lessons
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="input">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <select className="input">
              <option>All Topics</option>
              <option>Fundamentals</option>
              <option>Trading</option>
              <option>Security</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Progress Overview */}
        <LearningProgress />

        {/* Recommended Learning Path */}
        <RecommendedPath />

        {/* AI Concept Explainer */}
        <ConceptExplainer />

        {/* Lessons Grid */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">All Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>

        {/* Continue Learning CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to continue learning?</h3>
              <p className="text-primary-100 mt-1">
                Pick up where you left off with Liquidity Pools
              </p>
            </div>
            <button className="btn-ghost text-white border-white hover:bg-white hover:text-primary-600">
              Continue Lesson
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
