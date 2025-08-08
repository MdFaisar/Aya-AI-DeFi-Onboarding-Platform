'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  HomeIcon,
  AcademicCapIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AyaLogo } from '@/components/ui/AyaLogo'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Learn', href: '/dashboard/learn', icon: AcademicCapIcon },
  { name: 'Practice', href: '/dashboard/practice', icon: BeakerIcon },
  { name: 'Risk Scanner', href: '/dashboard/risk', icon: ShieldCheckIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-neutral-600 bg-opacity-75 dark:bg-black dark:bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-neutral-800 shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <AyaLogo className="h-8 w-8" />
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">Aya Navigator</span>
            </div>
            <button
              type="button"
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={clsx(
                    'mr-3 h-5 w-5',
                    pathname === item.href
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <AyaLogo className="h-8 w-8" />
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">Aya Navigator</span>
            </div>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={clsx(
                    'mr-3 h-5 w-5',
                    pathname === item.href
                      ? 'text-primary-500'
                      : 'text-neutral-400 group-hover:text-neutral-500'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Search bar */}
              <div className="hidden sm:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search lessons, concepts..."
                    className="input w-64 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Connect wallet */}
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
