'use client'

import { motion } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  ShieldExclamationIcon,
  BeakerIcon,
  ChartBarSquareIcon,
  CpuChipIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Natural Language Learning',
    description: 'Ask questions in plain English and get personalized explanations adapted to your experience level.',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
  {
    name: 'Real-Time Risk Engine',
    description: 'Continuous monitoring of protocols, portfolios, and transactions with automated warnings.',
    icon: ShieldExclamationIcon,
    color: 'text-danger-500',
    bgColor: 'bg-danger-50',
  },
  {
    name: 'Safe Practice Environment',
    description: 'Test all transactions on simulation networks before risking real funds.',
    icon: BeakerIcon,
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
  },
  {
    name: 'Portfolio Analytics',
    description: 'Track your DeFi journey with detailed analytics and progress visualization.',
    icon: ChartBarSquareIcon,
    color: 'text-success-500',
    bgColor: 'bg-success-50',
  },
  {
    name: 'AI-Powered Insights',
    description: 'Get intelligent recommendations based on market conditions and your risk profile.',
    icon: CpuChipIcon,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50',
  },
  {
    name: 'Multi-Protocol Support',
    description: 'Learn and practice with major DeFi protocols including Uniswap, Aave, and more.',
    icon: GlobeAltIcon,
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-50',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base font-semibold leading-7 text-primary-500">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Learn DeFi the smart way
            </p>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Our AI-powered platform provides comprehensive tools to help you understand, 
              practice, and safely navigate the DeFi ecosystem.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-neutral-900">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-neutral-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Feature showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 sm:mt-32"
        >
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-6 py-20 shadow-2xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start your DeFi journey?
              </h3>
              <p className="mt-6 text-lg leading-8 text-neutral-300">
                Join thousands of users who have successfully learned DeFi with our AI guidance. 
                Start with our interactive onboarding and build confidence step by step.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-6">
                <a
                  href="/onboarding"
                  className="btn-primary text-lg px-8 py-3 shadow-glow"
                >
                  Begin Onboarding
                </a>
                <a
                  href="/learn"
                  className="btn-ghost text-white border-white hover:bg-white hover:text-neutral-900"
                >
                  Explore Lessons
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
