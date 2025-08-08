'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { aiService } from '@/lib/ai-service'
import clsx from 'clsx'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isLoading?: boolean
}

interface AIChatProps {
  isOpen: boolean
  onToggle: () => void
}

export function AIChat({ isOpen, onToggle }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm Aya, your DeFi learning assistant. I can help explain concepts, assess risks, and guide your learning journey. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Check if user is asking for concept explanation
      const conceptKeywords = ['what is', 'explain', 'how does', 'what are']
      const isConceptQuestion = conceptKeywords.some(keyword => 
        userMessage.content.toLowerCase().includes(keyword)
      )

      let aiResponse: string

      if (isConceptQuestion) {
        // Extract concept from question
        const concept = extractConcept(userMessage.content)
        const explanation = await aiService.explainConcept(concept)
        aiResponse = formatConceptExplanation(explanation)
      } else {
        // General chat
        aiResponse = await aiService.chatWithAI(userMessage.content)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const extractConcept = (question: string): string => {
    // Simple concept extraction - in production, this would be more sophisticated
    const words = question.toLowerCase().split(' ')
    const defiTerms = ['defi', 'liquidity', 'pool', 'yield', 'farming', 'staking', 'swap', 'aave', 'uniswap', 'compound']
    
    for (const term of defiTerms) {
      if (words.includes(term)) {
        return term
      }
    }
    
    return question.replace(/what is|explain|how does|what are/gi, '').trim()
  }

  const formatConceptExplanation = (explanation: any): string => {
    const examples = explanation.examples || []
    const relatedConcepts = explanation.relatedConcepts || []

    return `**${explanation.concept}**

${explanation.explanation}

**Examples:**
${examples.map((ex: string) => `• ${ex}`).join('\n')}

**Related concepts:** ${relatedConcepts.join(', ')}

Would you like me to explain any of these related concepts?`
  }

  const quickQuestions = [
    "What is DeFi?",
    "How do liquidity pools work?",
    "What is yield farming?",
    "Explain smart contracts",
    "What are the risks in DeFi?"
  ]

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">Aya AI Assistant</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={clsx(
                'flex',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={clsx(
                  'max-w-[80%] p-3 rounded-lg text-sm',
                  message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={clsx(
                  'text-xs mt-1 opacity-70',
                  message.type === 'user' ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-1">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about DeFi..."
            className="flex-1 input text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
