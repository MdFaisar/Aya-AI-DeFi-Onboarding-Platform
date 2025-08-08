'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: AcademicCapIcon,
    title: 'Learn DeFi Safely',
    description: 'AI-powered tutorials that adapt to your learning pace'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Risk Protection',
    description: 'Real-time risk assessment and portfolio monitoring'
  },
  {
    icon: ChartBarIcon,
    title: 'Practice First',
    description: 'Test transactions on simulation before using real funds'
  }
]

export function HeroSection() {
  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Master DeFi with{' '}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Learn, practice, and navigate DeFi safely with our AI-powered platform. 
              Get personalized tutorials, real-time risk assessment, and guided practice 
              before investing real money.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/onboarding"
              className="btn-primary text-lg px-8 py-3 shadow-glow"
            >
              Start Learning
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="btn-ghost text-white border-white hover:bg-white hover:text-neutral-900"
            >
              Watch Demo
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-white">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-neutral-300">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-center sm:grid-cols-3">
              <div>
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-neutral-300">Newcomers abandon DeFi</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">80%</div>
                <div className="text-sm text-neutral-300">Complete our onboarding</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">90%</div>
                <div className="text-sm text-neutral-300">Fewer user mistakes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
