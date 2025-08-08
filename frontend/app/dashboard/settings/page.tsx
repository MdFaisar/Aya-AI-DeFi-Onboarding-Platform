import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { PreferencesSettings } from '@/components/settings/PreferencesSettings'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
            <p className="text-neutral-600 mt-1">
              Manage your account preferences and security settings
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-1">
                <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg">
                  <span className="mr-3">👤</span>
                  Profile
                </a>
                <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg">
                  <span className="mr-3">🔔</span>
                  Notifications
                </a>
                <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg">
                  <span className="mr-3">🔒</span>
                  Security
                </a>
                <a href="#preferences" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg">
                  <span className="mr-3">⚙️</span>
                  Preferences
                </a>
                <a href="#data" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg">
                  <span className="mr-3">📊</span>
                  Data & Privacy
                </a>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <div id="profile">
              <ProfileSettings />
            </div>

            {/* Notification Settings */}
            <div id="notifications">
              <NotificationSettings />
            </div>

            {/* Security Settings */}
            <div id="security">
              <SecuritySettings />
            </div>

            {/* Preferences Settings */}
            <div id="preferences">
              <PreferencesSettings />
            </div>

            {/* Data & Privacy */}
            <div id="data" className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data & Privacy</h3>
              
              <div className="space-y-6">
                {/* Data Export */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Export Your Data</h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    Download a copy of your learning progress, analytics, and account data.
                  </p>
                  <button className="btn-ghost text-sm">
                    Request Data Export
                  </button>
                </div>

                {/* Data Deletion */}
                <div className="pt-4 border-t border-neutral-200">
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="btn-danger text-sm">
                    Delete Account
                  </button>
                </div>

                {/* Privacy Policy */}
                <div className="pt-4 border-t border-neutral-200">
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Privacy & Terms</h4>
                  <div className="space-y-2">
                    <a href="/privacy" className="text-sm text-primary-600 hover:text-primary-700 block">
                      Privacy Policy
                    </a>
                    <a href="/terms" className="text-sm text-primary-600 hover:text-primary-700 block">
                      Terms of Service
                    </a>
                    <a href="/cookies" className="text-sm text-primary-600 hover:text-primary-700 block">
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
