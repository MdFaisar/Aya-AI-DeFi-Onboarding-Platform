'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

export function CTASection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Ready to master DeFi?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-600">
            Join thousands of users who have successfully learned DeFi with our AI-powered platform. 
            Start your journey today with personalized guidance and risk protection.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/onboarding"
              className="btn-primary text-lg px-8 py-3 shadow-glow group"
            >
              Start Free Onboarding
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo"
              className="btn-outline group"
            >
              <PlayIcon className="mr-2 h-5 w-5" />
              Watch Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-primary-500">🛡️</div>
              <div className="mt-2 text-sm font-medium text-neutral-900">Safe Learning</div>
              <div className="mt-1 text-sm text-neutral-600">
                Practice on testnet before real transactions
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-secondary-500">🤖</div>
              <div className="mt-2 text-sm font-medium text-neutral-900">AI Powered</div>
              <div className="mt-1 text-sm text-neutral-600">
                Personalized learning adapted to your pace
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-success-500">📈</div>
              <div className="mt-2 text-sm font-medium text-neutral-900">Proven Results</div>
              <div className="mt-1 text-sm text-neutral-600">
                80% completion rate, 90% fewer mistakes
              </div>
            </motion.div>
          </div>

          {/* FAQ preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="text-left max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6 text-center">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-neutral-50 p-4 text-left text-neutral-900 hover:bg-neutral-100">
                    <span className="font-medium">Is it safe to learn with real protocols?</span>
                    <span className="ml-6 flex-shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="mt-2 px-4 pb-4 text-neutral-600">
                    Yes! We use testnet versions of real protocols, so you can practice with actual smart contracts without risking real money. Only when you're confident do we guide you to mainnet with small amounts.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-neutral-50 p-4 text-left text-neutral-900 hover:bg-neutral-100">
                    <span className="font-medium">How long does the onboarding take?</span>
                    <span className="ml-6 flex-shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="mt-2 px-4 pb-4 text-neutral-600">
                    Our adaptive onboarding typically takes 2-4 hours spread over a few days. The AI adjusts the pace based on your learning speed and prior knowledge.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-neutral-50 p-4 text-left text-neutral-900 hover:bg-neutral-100">
                    <span className="font-medium">Do I need any crypto experience?</span>
                    <span className="ml-6 flex-shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="mt-2 px-4 pb-4 text-neutral-600">
                    No prior experience needed! Our AI starts with the basics and builds up your knowledge step by step. We explain everything in simple terms with real-world analogies.
                  </div>
                </details>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
