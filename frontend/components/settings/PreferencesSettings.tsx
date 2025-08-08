'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'USD',
    gasTracker: true,
    autoSave: true,
    animations: true,
    soundEffects: false,
    compactMode: false,
    showTestnet: true
  })

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelectChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preferences</h3>
      
      <div className="space-y-6">
        {/* Appearance */}
        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Appearance</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Theme
              </label>
              <select
                className="input"
                value={preferences.theme}
                onChange={(e) => handleSelectChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Animations</label>
                <p className="text-xs text-neutral-500">Enable smooth animations and transitions</p>
              </div>
              <button
                onClick={() => handleToggle('animations')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.animations ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.animations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Compact Mode</label>
                <p className="text-xs text-neutral-500">Use a more compact interface layout</p>
              </div>
              <button
                onClick={() => handleToggle('compactMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.compactMode ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Currency & Display */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Currency & Display</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Default Currency
              </label>
              <select
                className="input"
                value={preferences.currency}
                onChange={(e) => handleSelectChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="ETH">ETH (Ξ)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Gas Tracker</label>
                <p className="text-xs text-neutral-500">Show current gas prices in the interface</p>
              </div>
              <button
                onClick={() => handleToggle('gasTracker')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.gasTracker ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.gasTracker ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Show Testnet</label>
                <p className="text-xs text-neutral-500">Display testnet options and data</p>
              </div>
              <button
                onClick={() => handleToggle('showTestnet')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.showTestnet ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.showTestnet ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Behavior */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Behavior</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Auto-save Progress</label>
                <p className="text-xs text-neutral-500">Automatically save your learning progress</p>
              </div>
              <button
                onClick={() => handleToggle('autoSave')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.autoSave ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Sound Effects</label>
                <p className="text-xs text-neutral-500">Play sounds for achievements and alerts</p>
              </div>
              <button
                onClick={() => handleToggle('soundEffects')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.soundEffects ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-neutral-200">
          <button className="btn-primary">
            Save Preferences
          </button>
        </div>
      </div>
    </motion.div>
  )
}
