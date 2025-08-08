'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function ProfileSettings() {
  const [formData, setFormData] = useState({
    username: 'defi_learner',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Learning DeFi to build the future of finance',
    experienceLevel: 'intermediate',
    riskTolerance: 'medium',
    timezone: 'UTC-5',
    language: 'en'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Profile updated:', formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 text-xl font-semibold">JD</span>
          </div>
          <div>
            <button type="button" className="btn-ghost text-sm">
              Change Avatar
            </button>
            <p className="text-xs text-neutral-500 mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="input"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Bio
          </label>
          <textarea
            className="input"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Learning Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Experience Level
            </label>
            <select
              className="input"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Risk Tolerance
            </label>
            <select
              className="input"
              value={formData.riskTolerance}
              onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Localization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Timezone
            </label>
            <select
              className="input"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
              <option value="UTC+8">China Standard Time (UTC+8)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Language
            </label>
            <select
              className="input"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  )
}
