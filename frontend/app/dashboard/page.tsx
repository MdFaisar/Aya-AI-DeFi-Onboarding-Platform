'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { RiskAlerts } from '@/components/dashboard/RiskAlerts'
import { LearningPath } from '@/components/dashboard/LearningPath'
import { AIChat } from '@/components/ai/AIChat'

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back to your DeFi journey! 🚀</h1>
          <p className="mt-2 text-primary-100">
            Continue learning and practicing DeFi safely with AI guidance
          </p>
        </div>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Progress and actions */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressOverview />
            <QuickActions />
            <RecentActivity />
          </div>

          {/* Right column - Alerts and learning path */}
          <div className="space-y-6">
            <RiskAlerts />
            <LearningPath />
          </div>
        </div>
      </div>

      {/* AI Chat Component */}
      <AIChat
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </DashboardLayout>
  )
}
