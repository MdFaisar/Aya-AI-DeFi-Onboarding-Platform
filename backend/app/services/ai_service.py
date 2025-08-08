import asyncio
from typing import Dict, List, Optional, Any
import structlog
from groq import Groq

from app.core.config import settings
from app.core.redis import redis_client

logger = structlog.get_logger()

class AIService:
    """AI service for DeFi education and assistance"""
    
    def __init__(self):
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is required")
        
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.MODEL_NAME
        self.max_tokens = settings.MAX_TOKENS
        self.temperature = settings.TEMPERATURE
    
    async def explain_concept(
        self, 
        concept: str, 
        user_level: str = "beginner", 
        include_example: bool = True
    ) -> Dict[str, Any]:
        """Explain a DeFi concept in simple terms"""
        
        # Check cache first
        cache_key = f"explain:{concept}:{user_level}:{include_example}"
        cached_result = await redis_client.get(cache_key)
        if cached_result:
            return eval(cached_result)  # Note: In production, use json.loads
        
        level_prompts = {
            "beginner": "Explain this like I'm completely new to DeFi and crypto. Use simple language and avoid jargon.",
            "intermediate": "Explain this assuming I understand basic crypto concepts but am new to DeFi.",
            "advanced": "Provide a detailed technical explanation with nuances and edge cases."
        }
        
        prompt = f"""
You are Aya, an expert DeFi educator helping users understand complex concepts simply.

Task: Explain "{concept}" for a {user_level} user.

Guidelines:
- {level_prompts[user_level]}
- Use analogies to real-world concepts when helpful
- Break down complex ideas into digestible parts
- {f'Include a practical example' if include_example else 'Focus on conceptual understanding'}
- Highlight any risks or important considerations
- Keep the explanation engaging and encouraging

Format your response with:
1. Simple Definition
2. How It Works
3. {'Practical Example' if include_example else 'Key Benefits'}
4. Important Considerations/Risks
5. Next Steps for Learning

Concept to explain: {concept}
"""
        
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are Aya, a friendly and knowledgeable DeFi educator. Your goal is to make complex DeFi concepts accessible and understandable for everyone."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            explanation_text = completion.choices[0].message.content
            
            result = {
                "text": explanation_text,
                "examples": self._extract_examples(explanation_text) if include_example else [],
                "next_steps": self._extract_next_steps(explanation_text)
            }
            
            # Cache the result
            await redis_client.setex(cache_key, 3600, str(result))  # Cache for 1 hour
            
            return result
            
        except Exception as e:
            logger.error("Failed to explain concept", concept=concept, error=str(e))
            return {
                "text": f"I apologize, but I'm having trouble explaining '{concept}' right now. Please try again in a moment.",
                "examples": [],
                "next_steps": ["Try asking about a different concept", "Check our lesson library"]
            }
    
    async def generate_quiz(
        self, 
        topic: str, 
        difficulty: str = "easy", 
        question_count: int = 5
    ) -> Dict[str, Any]:
        """Generate an interactive quiz on a DeFi topic"""
        
        cache_key = f"quiz:{topic}:{difficulty}:{question_count}"
        cached_result = await redis_client.get(cache_key)
        if cached_result:
            return eval(cached_result)
        
        prompt = f"""
Create a {difficulty} level quiz about "{topic}" in DeFi with exactly {question_count} multiple choice questions.

Requirements:
- Each question should have 4 options (A, B, C, D)
- Include clear explanations for correct answers
- Focus on practical knowledge and real-world applications
- Avoid overly technical jargon for easy level
- Include risk awareness questions

Format each question as JSON:
{{
  "id": 1,
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": 0,
  "explanation": "Detailed explanation"
}}

Topic: {topic}
Difficulty: {difficulty}
Number of questions: {question_count}

Return only valid JSON array of questions.
"""
        
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert DeFi educator creating educational quizzes. Focus on practical knowledge that helps users make better decisions. Return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=2000
            )
            
            quiz_text = completion.choices[0].message.content
            
            # Parse the quiz (simplified - in production, use proper JSON parsing)
            questions = self._parse_quiz_questions(quiz_text, topic, difficulty, question_count)
            
            result = {
                "topic": topic,
                "difficulty": difficulty,
                "questions": questions,
                "total_questions": len(questions)
            }
            
            # Cache the result
            await redis_client.setex(cache_key, 7200, str(result))  # Cache for 2 hours
            
            return result
            
        except Exception as e:
            logger.error("Failed to generate quiz", topic=topic, error=str(e))
            return self._get_fallback_quiz(topic, difficulty, question_count)
    
    async def chat(self, message: str, context: str = "") -> Dict[str, Any]:
        """Chat with AI assistant about DeFi topics"""
        
        prompt = f"""
You are Aya, a helpful DeFi assistant. The user is asking: "{message}"

Context about the user:
{context}

Guidelines:
- Provide helpful, accurate information about DeFi
- Keep responses conversational and encouraging
- If the question is about risks, be honest but not discouraging
- Suggest practical next steps when appropriate
- If you're unsure, admit it and suggest resources

Respond in a friendly, helpful manner.
"""
        
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are Aya, a friendly DeFi assistant focused on education and safety."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            response_text = completion.choices[0].message.content
            
            return {
                "text": response_text,
                "suggestions": self._extract_suggestions(response_text),
                "related_topics": self._extract_related_topics(message)
            }
            
        except Exception as e:
            logger.error("Failed to process chat", message=message, error=str(e))
            return {
                "text": "I'm having trouble processing your question right now. Please try again in a moment.",
                "suggestions": ["Try rephrasing your question", "Check our help documentation"],
                "related_topics": []
            }
    
    async def generate_learning_path(
        self, 
        user_level: str, 
        completed_lessons: int, 
        risk_tolerance: str, 
        progress_percentage: float
    ) -> Dict[str, Any]:
        """Generate personalized learning path"""
        
        # Simplified learning path generation
        learning_paths = {
            "beginner": {
                "lessons": [
                    "What is DeFi?",
                    "Understanding Wallets",
                    "Basic Token Concepts",
                    "Introduction to DEXs",
                    "Liquidity Pools Basics"
                ],
                "milestone": "Complete basic DeFi concepts",
                "estimated_time": "2-3 hours",
                "focus_areas": ["Safety", "Basic Concepts", "Wallet Management"]
            },
            "intermediate": {
                "lessons": [
                    "Advanced Trading Strategies",
                    "Yield Farming",
                    "Lending and Borrowing",
                    "Risk Management",
                    "Portfolio Optimization"
                ],
                "milestone": "Master core DeFi strategies",
                "estimated_time": "4-6 hours",
                "focus_areas": ["Strategy", "Risk Assessment", "Advanced Features"]
            },
            "advanced": {
                "lessons": [
                    "Protocol Analysis",
                    "Smart Contract Risks",
                    "MEV and Arbitrage",
                    "Cross-chain DeFi",
                    "Building DeFi Strategies"
                ],
                "milestone": "Become a DeFi expert",
                "estimated_time": "6-8 hours",
                "focus_areas": ["Technical Analysis", "Advanced Strategies", "Protocol Development"]
            }
        }
        
        return learning_paths.get(user_level, learning_paths["beginner"])
    
    async def analyze_transaction(
        self, 
        transaction_data: Dict[str, Any], 
        user_level: str
    ) -> Dict[str, Any]:
        """Analyze a transaction and provide insights"""
        
        # Simplified transaction analysis
        risk_level = "medium"  # This would be calculated based on actual transaction data
        
        return {
            "risk_level": risk_level,
            "explanation": "This transaction involves swapping tokens on a decentralized exchange.",
            "warnings": ["Check slippage tolerance", "Verify token addresses"],
            "recommendations": ["Start with small amounts", "Use reputable DEXs"],
            "educational_notes": ["This is a basic swap transaction", "Gas fees will apply"]
        }
    
    def _extract_examples(self, text: str) -> List[str]:
        """Extract examples from explanation text"""
        # Simplified extraction - in production, use NLP
        return ["Example: Using Uniswap to swap ETH for USDC"]
    
    def _extract_next_steps(self, text: str) -> List[str]:
        """Extract next steps from explanation text"""
        return ["Practice on testnet", "Take a quiz on this topic", "Read more about related concepts"]
    
    def _extract_suggestions(self, text: str) -> List[str]:
        """Extract suggestions from chat response"""
        return ["Learn about liquidity pools", "Try a simulation", "Check risk assessment"]
    
    def _extract_related_topics(self, message: str) -> List[str]:
        """Extract related topics from user message"""
        # Simplified topic extraction
        topics = []
        if "swap" in message.lower():
            topics.extend(["DEX", "Slippage", "Liquidity"])
        if "lend" in message.lower():
            topics.extend(["Aave", "Compound", "Interest Rates"])
        return topics
    
    def _parse_quiz_questions(self, quiz_text: str, topic: str, difficulty: str, count: int) -> List[Dict]:
        """Parse quiz questions from AI response"""
        # Fallback quiz questions - in production, parse actual AI response
        return self._get_fallback_quiz(topic, difficulty, count)["questions"]
    
    def _get_fallback_quiz(self, topic: str, difficulty: str, count: int) -> Dict[str, Any]:
        """Get fallback quiz when AI generation fails"""
        fallback_questions = [
            {
                "id": 1,
                "question": f"What is the main purpose of {topic}?",
                "options": [
                    "To make money quickly",
                    "To provide decentralized financial services",
                    "To replace traditional banks",
                    "To create new cryptocurrencies"
                ],
                "correct_answer": 1,
                "explanation": f"{topic} aims to provide decentralized financial services without traditional intermediaries."
            }
        ]
        
        return {
            "topic": topic,
            "difficulty": difficulty,
            "questions": fallback_questions[:count],
            "total_questions": min(len(fallback_questions), count)
        }
