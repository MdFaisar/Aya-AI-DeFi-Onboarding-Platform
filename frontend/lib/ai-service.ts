// AI Service for connecting to MCP server and backend AI endpoints
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const MCP_BASE_URL = process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:3001'

export interface AIResponse {
  success: boolean
  data?: any
  message?: string
  error?: string
}

export interface ConceptExplanation {
  concept: string
  explanation: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  examples: string[]
  relatedConcepts: string[]
}

export interface RiskAssessment {
  overallRisk: number
  riskFactors: {
    name: string
    score: number
    description: string
  }[]
  recommendations: string[]
}

export interface LearningRecommendation {
  nextLessons: string[]
  skillGaps: string[]
  personalizedPath: {
    lessonId: string
    title: string
    reason: string
  }[]
}

class AIService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  private mcpClient = axios.create({
    baseURL: MCP_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Explain DeFi concepts in simple terms
  async explainConcept(concept: string, userLevel: string = 'beginner'): Promise<ConceptExplanation> {
    try {
      const response = await this.mcpClient.post('/tools/explain_concept_simply', {
        concept,
        user_level: userLevel
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to explain concept')
      }
    } catch (error) {
      console.error('Error explaining concept:', error)
      // Fallback to static explanation
      return this.getFallbackExplanation(concept)
    }
  }

  // Assess portfolio risk
  async assessRisk(portfolioData: any): Promise<RiskAssessment> {
    try {
      const response = await this.mcpClient.post('/tools/assess_portfolio_risk', {
        portfolio: portfolioData
      })

      if (response.data.success && response.data.data) {
        const data = response.data.data
        // Ensure the response has the correct structure
        return {
          overallRisk: data.overallRisk || 35,
          riskFactors: Array.isArray(data.riskFactors) ? data.riskFactors : [],
          recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
        }
      } else {
        throw new Error(response.data.error || 'Failed to assess risk')
      }
    } catch (error) {
      console.error('Error assessing risk:', error)
      // Fallback to mock risk assessment
      return this.getFallbackRiskAssessment()
    }
  }

  // Get personalized learning recommendations
  async getLearningRecommendations(userProgress: any): Promise<LearningRecommendation> {
    try {
      const response = await this.mcpClient.post('/tools/recommend_learning_path', {
        user_progress: userProgress
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to get recommendations')
      }
    } catch (error) {
      console.error('Error getting recommendations:', error)
      // Fallback to static recommendations
      return this.getFallbackRecommendations()
    }
  }

  // Simulate DeFi transactions
  async simulateTransaction(transactionData: any): Promise<any> {
    try {
      const response = await this.mcpClient.post('/tools/simulate_transaction', {
        transaction: transactionData
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to simulate transaction')
      }
    } catch (error) {
      console.error('Error simulating transaction:', error)
      throw error
    }
  }

  // Get protocol information
  async getProtocolInfo(protocolName: string): Promise<any> {
    try {
      const response = await this.mcpClient.post('/tools/get_protocol_info', {
        protocol: protocolName
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to get protocol info')
      }
    } catch (error) {
      console.error('Error getting protocol info:', error)
      return this.getFallbackProtocolInfo(protocolName)
    }
  }

  // Track learning progress
  async trackProgress(progressData: any): Promise<any> {
    try {
      const response = await this.mcpClient.post('/tools/track_learning_progress', {
        progress: progressData
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to track progress')
      }
    } catch (error) {
      console.error('Error tracking progress:', error)
      return { success: false, error: error.message }
    }
  }

  // Chat with AI assistant
  async chatWithAI(message: string, context?: any): Promise<string> {
    try {
      const response = await this.apiClient.post('/ai/chat', {
        message,
        context
      })

      if (response.data.success) {
        return response.data.response
      } else {
        throw new Error(response.data.error || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('Error chatting with AI:', error)
      return "I'm sorry, I'm having trouble connecting right now. Please try again later."
    }
  }

  // Fallback methods for when AI services are unavailable
  private getFallbackExplanation(concept: string): ConceptExplanation {
    const explanations: Record<string, ConceptExplanation> = {
      'defi': {
        concept: 'DeFi',
        explanation: 'DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks.',
        difficulty: 'beginner',
        examples: ['Uniswap for trading', 'Aave for lending', 'Compound for earning interest'],
        relatedConcepts: ['Smart Contracts', 'Liquidity Pools', 'Yield Farming']
      },
      'liquidity-pools': {
        concept: 'Liquidity Pools',
        explanation: 'Liquidity pools are collections of tokens locked in smart contracts that enable decentralized trading and lending.',
        difficulty: 'intermediate',
        examples: ['ETH/USDC pool on Uniswap', 'DAI lending pool on Aave'],
        relatedConcepts: ['AMM', 'Impermanent Loss', 'Yield Farming']
      }
    }

    return explanations[concept.toLowerCase()] || {
      concept,
      explanation: `${concept} is an important concept in DeFi. Please check our lessons for detailed explanations.`,
      difficulty: 'beginner',
      examples: [],
      relatedConcepts: []
    }
  }

  private getFallbackRiskAssessment(): RiskAssessment {
    return {
      overallRisk: 35,
      riskFactors: [
        { name: 'Smart Contract Risk', score: 25, description: 'Risk from smart contract vulnerabilities' },
        { name: 'Liquidity Risk', score: 40, description: 'Risk from low liquidity in protocols' },
        { name: 'Market Risk', score: 50, description: 'Risk from market volatility' },
        { name: 'Regulatory Risk', score: 30, description: 'Risk from changing regulations' }
      ],
      recommendations: [
        'Diversify across multiple protocols to reduce concentration risk',
        'Start with well-audited protocols like Aave and Compound',
        'Keep some funds in stablecoins for stability',
        'Never invest more than you can afford to lose',
        'Stay updated on protocol changes and security audits'
      ]
    }
  }

  private getFallbackRecommendations(): LearningRecommendation {
    return {
      nextLessons: ['liquidity-pools', 'yield-farming'],
      skillGaps: ['Risk Management', 'Advanced Trading'],
      personalizedPath: [
        {
          lessonId: 'liquidity-pools',
          title: 'Understanding Liquidity Pools',
          reason: 'Build on your DeFi fundamentals'
        },
        {
          lessonId: 'risk-management',
          title: 'Risk Management Strategies',
          reason: 'Essential for safe DeFi participation'
        }
      ]
    }
  }

  private getFallbackProtocolInfo(protocolName: string): any {
    const protocols: Record<string, any> = {
      'uniswap': {
        name: 'Uniswap',
        type: 'DEX',
        tvl: '$4.2B',
        riskScore: 25,
        description: 'Leading decentralized exchange for token swapping'
      },
      'aave': {
        name: 'Aave',
        type: 'Lending',
        tvl: '$6.8B',
        riskScore: 30,
        description: 'Decentralized lending and borrowing protocol'
      }
    }

    return protocols[protocolName.toLowerCase()] || {
      name: protocolName,
      type: 'Unknown',
      tvl: 'N/A',
      riskScore: 50,
      description: 'Protocol information not available'
    }
  }
}

export const aiService = new AIService()
export default aiService
