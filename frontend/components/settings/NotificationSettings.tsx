'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    riskAlerts: true,
    learningReminders: true,
    achievementNotifications: true,
    weeklyProgress: true,
    marketUpdates: false,
    protocolUpdates: true
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = () => {
    console.log('Notification settings saved:', settings)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Notification Preferences</h3>
      
      <div className="space-y-6">
        {/* General Notifications */}
        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">General</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Email Notifications</label>
                <p className="text-xs text-neutral-500">Receive notifications via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Push Notifications</label>
                <p className="text-xs text-neutral-500">Receive browser push notifications</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Learning Notifications */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Learning</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Learning Reminders</label>
                <p className="text-xs text-neutral-500">Daily reminders to continue learning</p>
              </div>
              <button
                onClick={() => handleToggle('learningReminders')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.learningReminders ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.learningReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Achievement Notifications</label>
                <p className="text-xs text-neutral-500">Get notified when you unlock achievements</p>
              </div>
              <button
                onClick={() => handleToggle('achievementNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.achievementNotifications ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.achievementNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Weekly Progress</label>
                <p className="text-xs text-neutral-500">Weekly summary of your learning progress</p>
              </div>
              <button
                onClick={() => handleToggle('weeklyProgress')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyProgress ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyProgress ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Risk & Security */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Risk & Security</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Risk Alerts</label>
                <p className="text-xs text-neutral-500">Important risk warnings and alerts</p>
              </div>
              <button
                onClick={() => handleToggle('riskAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.riskAlerts ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.riskAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Protocol Updates</label>
                <p className="text-xs text-neutral-500">Updates about DeFi protocols you use</p>
              </div>
              <button
                onClick={() => handleToggle('protocolUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.protocolUpdates ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.protocolUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Market Updates */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Market & News</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Market Updates</label>
                <p className="text-xs text-neutral-500">Daily market summaries and trends</p>
              </div>
              <button
                onClick={() => handleToggle('marketUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.marketUpdates ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.marketUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-neutral-200">
          <button onClick={handleSave} className="btn-primary">
            Save Notification Settings
          </button>
        </div>
      </div>
    </motion.div>
  )
}
