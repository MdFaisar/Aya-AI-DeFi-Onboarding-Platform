from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
import structlog

from app.services.ai_service import AIService
from app.core.deps import get_current_user
from app.models.user import User

logger = structlog.get_logger()

router = APIRouter()

# Request/Response models
class ExplainConceptRequest(BaseModel):
    concept: str
    user_level: Optional[str] = "beginner"
    include_example: Optional[bool] = True

class ExplainConceptResponse(BaseModel):
    explanation: str
    difficulty: str
    examples: Optional[List[str]] = None
    next_steps: Optional[List[str]] = None

class GenerateQuizRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "easy"
    question_count: Optional[int] = 5

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class GenerateQuizResponse(BaseModel):
    topic: str
    difficulty: str
    questions: List[QuizQuestion]
    total_questions: int

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
    related_topics: Optional[List[str]] = None

@router.post("/explain-concept", response_model=ExplainConceptResponse)
async def explain_concept(
    request: ExplainConceptRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Explain a DeFi concept in simple terms using AI
    """
    try:
        ai_service = AIService()
        
        # Adjust explanation based on user's experience level
        user_level = current_user.experience_level if current_user else request.user_level
        
        explanation = await ai_service.explain_concept(
            concept=request.concept,
            user_level=user_level,
            include_example=request.include_example
        )
        
        return ExplainConceptResponse(
            explanation=explanation["text"],
            difficulty=user_level,
            examples=explanation.get("examples", []),
            next_steps=explanation.get("next_steps", [])
        )
        
    except Exception as e:
        logger.error("Failed to explain concept", concept=request.concept, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate explanation"
        )

@router.post("/generate-quiz", response_model=GenerateQuizResponse)
async def generate_quiz(
    request: GenerateQuizRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate an interactive quiz on a DeFi topic using AI
    """
    try:
        ai_service = AIService()
        
        # Adjust difficulty based on user's level
        difficulty = request.difficulty
        if current_user:
            if current_user.experience_level == "advanced":
                difficulty = "hard"
            elif current_user.experience_level == "intermediate":
                difficulty = "medium"
        
        quiz_data = await ai_service.generate_quiz(
            topic=request.topic,
            difficulty=difficulty,
            question_count=request.question_count
        )
        
        questions = [
            QuizQuestion(
                id=q["id"],
                question=q["question"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"]
            )
            for q in quiz_data["questions"]
        ]
        
        return GenerateQuizResponse(
            topic=quiz_data["topic"],
            difficulty=quiz_data["difficulty"],
            questions=questions,
            total_questions=len(questions)
        )
        
    except Exception as e:
        logger.error("Failed to generate quiz", topic=request.topic, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate quiz"
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Chat with AI assistant about DeFi topics
    """
    try:
        ai_service = AIService()
        
        # Build context from user's learning history
        context = request.context or ""
        if current_user:
            context += f"\nUser level: {current_user.experience_level}"
            context += f"\nProgress: {current_user.overall_progress_percentage}%"
            context += f"\nLessons completed: {current_user.total_lessons_completed}"
        
        response = await ai_service.chat(
            message=request.message,
            context=context
        )
        
        return ChatResponse(
            response=response["text"],
            suggestions=response.get("suggestions", []),
            related_topics=response.get("related_topics", [])
        )
        
    except Exception as e:
        logger.error("Failed to process chat", message=request.message, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat message"
        )

@router.get("/learning-path")
async def get_personalized_learning_path(
    current_user: User = Depends(get_current_user)
):
    """
    Get AI-generated personalized learning path for the user
    """
    try:
        ai_service = AIService()
        
        learning_path = await ai_service.generate_learning_path(
            user_level=current_user.experience_level,
            completed_lessons=current_user.total_lessons_completed,
            risk_tolerance=current_user.risk_tolerance,
            progress_percentage=current_user.overall_progress_percentage
        )
        
        return {
            "current_level": current_user.experience_level,
            "progress": current_user.overall_progress_percentage,
            "recommended_lessons": learning_path["lessons"],
            "next_milestone": learning_path["milestone"],
            "estimated_time": learning_path["estimated_time"],
            "focus_areas": learning_path["focus_areas"]
        }
        
    except Exception as e:
        logger.error("Failed to generate learning path", user_id=current_user.id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate learning path"
        )

@router.post("/analyze-transaction")
async def analyze_transaction(
    transaction_data: dict,
    current_user: User = Depends(get_current_user)
):
    """
    Analyze a transaction and provide AI insights
    """
    try:
        ai_service = AIService()
        
        analysis = await ai_service.analyze_transaction(
            transaction_data=transaction_data,
            user_level=current_user.experience_level
        )
        
        return {
            "risk_level": analysis["risk_level"],
            "explanation": analysis["explanation"],
            "warnings": analysis["warnings"],
            "recommendations": analysis["recommendations"],
            "educational_notes": analysis["educational_notes"]
        }
        
    except Exception as e:
        logger.error("Failed to analyze transaction", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze transaction"
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Chat with AI assistant about DeFi topics
    """
    try:
        # Simple rule-based responses for common DeFi questions
        message_lower = request.message.lower()

        if any(word in message_lower for word in ['what is defi', 'defi', 'decentralized finance']):
            response = """DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks.

Key features:
• **Permissionless**: Anyone can access DeFi protocols
• **Transparent**: All transactions are on-chain and verifiable
• **Composable**: Protocols can be combined like building blocks
• **Global**: Available 24/7 worldwide

Popular DeFi activities include:
- Trading on DEXs like Uniswap
- Lending/borrowing on Aave or Compound
- Earning yield through liquidity provision
- Staking tokens for rewards

Would you like me to explain any specific DeFi concept in more detail?"""
            suggestions = ["What are liquidity pools?", "How does yield farming work?", "What are the risks in DeFi?"]
            related_topics = ["Liquidity Pools", "Yield Farming", "Smart Contracts", "Risk Management"]

        elif any(word in message_lower for word in ['liquidity pool', 'liquidity', 'amm']):
            response = """Liquidity pools are collections of tokens locked in smart contracts that enable decentralized trading.

**How they work:**
1. Users deposit token pairs (e.g., ETH/USDC) into a pool
2. Traders can swap between these tokens using the pool
3. Liquidity providers earn fees from trades
4. Automated Market Makers (AMMs) determine prices

**Benefits:**
• Earn trading fees (typically 0.3% per trade)
• No need for order books
• 24/7 trading availability

**Risks:**
• Impermanent loss when token prices diverge
• Smart contract risks
• Market volatility

Popular platforms: Uniswap, SushiSwap, Curve

Want to learn about impermanent loss or how to provide liquidity safely?"""
            suggestions = ["What is impermanent loss?", "How to provide liquidity safely?", "Best liquidity pool strategies?"]
            related_topics = ["Impermanent Loss", "AMM", "Yield Farming", "DEX"]

        elif any(word in message_lower for word in ['yield farming', 'yield', 'farming']):
            response = """Yield farming is the practice of earning rewards by providing liquidity or staking tokens in DeFi protocols.

**Common strategies:**
• **Liquidity provision**: Earn trading fees + token rewards
• **Lending**: Earn interest on deposited tokens
• **Staking**: Lock tokens to secure networks and earn rewards
• **Governance participation**: Vote and earn governance tokens

**Risks to consider:**
• Smart contract vulnerabilities
• Impermanent loss in liquidity pools
• Token price volatility
• Rug pulls in new protocols

**Best practices:**
• Start with established protocols (Aave, Compound, Uniswap)
• Diversify across multiple strategies
• Understand the risks before investing
• Never invest more than you can afford to lose

Would you like specific recommendations for your risk level?"""
            suggestions = ["What are the safest yield farming strategies?", "How to assess yield farming risks?", "Best protocols for beginners?"]
            related_topics = ["Liquidity Pools", "Staking", "Risk Management", "Protocol Selection"]

        elif any(word in message_lower for word in ['risk', 'safe', 'security']):
            response = """DeFi safety is crucial! Here are key risks and how to manage them:

**Smart Contract Risk:**
• Use audited protocols with good track records
• Check audit reports before using new protocols
• Start with small amounts

**Market Risk:**
• Diversify your portfolio
• Use stablecoins for lower volatility
• Set stop-losses where possible

**Liquidity Risk:**
• Ensure you can exit positions when needed
• Check trading volumes and liquidity depth
• Avoid low-liquidity tokens

**Operational Risk:**
• Use hardware wallets for large amounts
• Double-check addresses before transactions
• Keep private keys secure

**Red flags to avoid:**
• Anonymous teams
• Unrealistic APY promises (>100%)
• No audit reports
• Low liquidity

Start with established protocols like Aave, Compound, or Uniswap for safer DeFi experience."""
            suggestions = ["How to choose safe DeFi protocols?", "What are the biggest DeFi risks?", "Best security practices?"]
            related_topics = ["Smart Contract Audits", "Portfolio Diversification", "Wallet Security", "Protocol Research"]

        else:
            # Generic helpful response
            response = f"""I'd be happy to help you with DeFi! I can explain concepts like:

• **DeFi Basics**: What is decentralized finance?
• **Liquidity Pools**: How AMMs and trading work
• **Yield Farming**: Earning rewards in DeFi
• **Risk Management**: Staying safe in DeFi
• **Specific Protocols**: Uniswap, Aave, Compound, etc.

Your question: "{request.message}"

Could you be more specific about what aspect of DeFi you'd like to learn about? I'm here to help you understand and navigate DeFi safely!"""
            suggestions = ["What is DeFi?", "How do liquidity pools work?", "What is yield farming?", "How to stay safe in DeFi?"]
            related_topics = ["DeFi Basics", "Liquidity Pools", "Yield Farming", "Risk Management"]

        return ChatResponse(
            response=response,
            suggestions=suggestions,
            related_topics=related_topics
        )

    except Exception as e:
        logger.error("Failed to process chat message", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat message"
        )
