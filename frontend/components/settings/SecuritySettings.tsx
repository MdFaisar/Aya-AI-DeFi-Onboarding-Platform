'use client'

import { motion } from 'framer-motion'

export function SecuritySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Security Settings</h3>
      
      <div className="space-y-6">
        {/* Wallet Connection */}
        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Connected Wallets</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-sm">🦊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">MetaMask</p>
                  <p className="text-xs text-neutral-500">0x1234...5678</p>
                </div>
              </div>
              <button className="text-sm text-danger-600 hover:text-danger-700">
                Disconnect
              </button>
            </div>
            <button className="btn-ghost text-sm w-full">
              Connect Another Wallet
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Two-Factor Authentication</h4>
          <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-neutral-900">Authenticator App</p>
              <p className="text-xs text-neutral-500">Not enabled</p>
            </div>
            <button className="btn-primary text-sm">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Session Management */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Active Sessions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Current Session</p>
                <p className="text-xs text-neutral-500">Chrome on Windows • Active now</p>
              </div>
              <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded">
                Current
              </span>
            </div>
            <button className="btn-ghost text-sm w-full">
              Sign Out All Other Sessions
            </button>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Security Recommendations</h4>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-900">Enable Two-Factor Authentication</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-green-600">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-900">Wallet Connected Securely</p>
                  <p className="text-xs text-green-700 mt-1">
                    Your wallet connection is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
