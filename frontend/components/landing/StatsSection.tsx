'use client'

import { motion } from 'framer-motion'

const stats = [
  {
    id: 1,
    name: 'Onboarding Completion Rate',
    value: '80%',
    description: 'Users complete our full onboarding program',
    change: '+15%',
    changeType: 'positive',
  },
  {
    id: 2,
    name: 'Time to First Trade',
    value: '3 days',
    description: 'Average time from signup to first real transaction',
    change: '-60%',
    changeType: 'positive',
  },
  {
    id: 3,
    name: 'Error Reduction',
    value: '90%',
    description: 'Fewer user mistakes compared to traditional learning',
    change: '+25%',
    changeType: 'positive',
  },
  {
    id: 4,
    name: 'User Satisfaction',
    value: '4.8/5',
    description: 'Average rating from post-demo surveys',
    change: '+0.3',
    changeType: 'positive',
  },
]

const protocols = [
  { name: 'Uniswap', logo: '🦄', tvl: '$4.2B' },
  { name: 'Aave', logo: '👻', tvl: '$6.8B' },
  { name: 'Compound', logo: '🏛️', tvl: '$2.1B' },
  { name: 'Curve', logo: '🌊', tvl: '$3.5B' },
  { name: 'MakerDAO', logo: '🏭', tvl: '$5.2B' },
  { name: 'Lido', logo: '🔥', tvl: '$14.1B' },
]

export function StatsSection() {
  return (
    <section className="bg-neutral-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Success metrics */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Proven Results
            </h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Our AI-powered approach delivers measurable improvements in DeFi learning outcomes
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
              <div className="mt-2 text-sm font-medium text-neutral-900">{stat.name}</div>
              <div className="mt-1 text-sm text-neutral-600">{stat.description}</div>
              <div className={`mt-2 inline-flex items-center text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
              }`}>
                <span className="mr-1">
                  {stat.changeType === 'positive' ? '↗' : '↘'}
                </span>
                {stat.change} from baseline
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Supported protocols */}
        <div className="mx-auto mt-24 max-w-2xl text-center sm:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
              Learn with Real Protocols
            </h3>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Practice with the same protocols you'll use in production
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="card-hover text-center"
            >
              <div className="text-3xl mb-2">{protocol.logo}</div>
              <div className="text-sm font-medium text-neutral-900">{protocol.name}</div>
              <div className="text-xs text-neutral-600">{protocol.tvl} TVL</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Risk reduction showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-4xl sm:mt-32"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-16 shadow-2xl sm:px-10 sm:py-20">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  95% of DeFi newcomers quit within a week
                </h3>
                <p className="mt-4 text-xl text-white/90">
                  Don't be part of that statistic. Learn the smart way.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Before Aya</div>
                    <div className="mt-2 text-white/80">
                      • Overwhelming complexity<br />
                      • Trial and error learning<br />
                      • High risk of losses
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-4xl text-white">→</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">With Aya</div>
                    <div className="mt-2 text-white/80">
                      • Guided learning path<br />
                      • Safe practice environment<br />
                      • AI-powered risk protection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
