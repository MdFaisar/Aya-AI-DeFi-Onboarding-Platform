from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import structlog

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User

logger = structlog.get_logger()

router = APIRouter()

# Request/Response models
class QuizAttemptRequest(BaseModel):
    quiz_id: str
    answers: List[int]  # List of selected answer indices

class QuizResultResponse(BaseModel):
    quiz_id: str
    score: int
    passed: bool
    correct_answers: int
    total_questions: int
    time_taken: Optional[int] = None
    feedback: List[dict]

@router.get("/")
async def get_available_quizzes(current_user: User = Depends(get_current_user)):
    """Get all available quizzes for the user"""
    # Mock quiz data
    quizzes = [
        {
            "id": "defi-basics",
            "title": "DeFi Basics Quiz",
            "description": "Test your understanding of DeFi fundamentals",
            "difficulty": "beginner",
            "question_count": 5,
            "time_limit": 300,  # 5 minutes
            "passing_score": 70,
            "category": "fundamentals"
        },
        {
            "id": "wallet-security",
            "title": "Wallet Security Quiz",
            "description": "Assess your knowledge of wallet security practices",
            "difficulty": "beginner",
            "question_count": 4,
            "time_limit": 240,
            "passing_score": 75,
            "category": "security"
        },
        {
            "id": "liquidity-pools",
            "title": "Liquidity Pools Quiz",
            "description": "Advanced concepts in liquidity provision",
            "difficulty": "intermediate",
            "question_count": 6,
            "time_limit": 360,
            "passing_score": 70,
            "category": "advanced"
        }
    ]
    
    return quizzes

@router.get("/{quiz_id}")
async def get_quiz(
    quiz_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get quiz questions"""
    quiz_questions = {
        "defi-basics": {
            "id": "defi-basics",
            "title": "DeFi Basics Quiz",
            "description": "Test your understanding of DeFi fundamentals",
            "time_limit": 300,
            "passing_score": 70,
            "questions": [
                {
                    "id": 1,
                    "question": "What does DeFi stand for?",
                    "options": [
                        "Digital Finance",
                        "Decentralized Finance", 
                        "Distributed Finance",
                        "Deferred Finance"
                    ]
                },
                {
                    "id": 2,
                    "question": "Which blockchain is most commonly used for DeFi applications?",
                    "options": [
                        "Bitcoin",
                        "Ethereum",
                        "Litecoin", 
                        "Ripple"
                    ]
                },
                {
                    "id": 3,
                    "question": "What is a smart contract?",
                    "options": [
                        "A legal document",
                        "Self-executing code on blockchain",
                        "A type of cryptocurrency",
                        "A trading strategy"
                    ]
                },
                {
                    "id": 4,
                    "question": "What is the main risk of DeFi protocols?",
                    "options": [
                        "High fees",
                        "Slow transactions",
                        "Smart contract vulnerabilities",
                        "Limited functionality"
                    ]
                },
                {
                    "id": 5,
                    "question": "What is yield farming?",
                    "options": [
                        "Growing crops",
                        "Mining cryptocurrency",
                        "Earning rewards by providing liquidity",
                        "Trading frequently"
                    ]
                }
            ]
        },
        "wallet-security": {
            "id": "wallet-security",
            "title": "Wallet Security Quiz",
            "description": "Assess your knowledge of wallet security practices",
            "time_limit": 240,
            "passing_score": 75,
            "questions": [
                {
                    "id": 1,
                    "question": "What should you never share with anyone?",
                    "options": [
                        "Your wallet address",
                        "Your private key",
                        "Your transaction history",
                        "Your DeFi portfolio"
                    ]
                },
                {
                    "id": 2,
                    "question": "How many words are typically in a seed phrase?",
                    "options": [
                        "8 or 16",
                        "12 or 24",
                        "6 or 12",
                        "10 or 20"
                    ]
                },
                {
                    "id": 3,
                    "question": "What is the safest way to store large amounts of cryptocurrency?",
                    "options": [
                        "On an exchange",
                        "In a mobile wallet",
                        "In a hardware wallet",
                        "In a browser extension"
                    ]
                },
                {
                    "id": 4,
                    "question": "What should you do before interacting with a new DeFi protocol?",
                    "options": [
                        "Invest all your funds immediately",
                        "Research and verify the protocol",
                        "Ask friends for advice",
                        "Follow social media hype"
                    ]
                }
            ]
        }
    }
    
    quiz = quiz_questions.get(quiz_id)
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    return quiz

@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
async def submit_quiz(
    quiz_id: str,
    attempt: QuizAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit quiz answers and get results"""
    try:
        # Get correct answers (in production, this would be from database)
        correct_answers_map = {
            "defi-basics": [1, 1, 1, 2, 2],  # Correct answer indices
            "wallet-security": [1, 1, 2, 1]
        }
        
        correct_answers = correct_answers_map.get(quiz_id)
        if not correct_answers:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found"
            )
        
        if len(attempt.answers) != len(correct_answers):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid number of answers"
            )
        
        # Calculate score
        correct_count = sum(1 for i, answer in enumerate(attempt.answers) 
                          if answer == correct_answers[i])
        total_questions = len(correct_answers)
        score = int((correct_count / total_questions) * 100)
        
        # Determine if passed
        passing_scores = {
            "defi-basics": 70,
            "wallet-security": 75
        }
        passing_score = passing_scores.get(quiz_id, 70)
        passed = score >= passing_score
        
        # Generate feedback
        feedback = []
        quiz_data = await get_quiz(quiz_id, current_user)
        
        for i, (user_answer, correct_answer) in enumerate(zip(attempt.answers, correct_answers)):
            question = quiz_data["questions"][i]
            is_correct = user_answer == correct_answer
            
            feedback.append({
                "question_id": i + 1,
                "question": question["question"],
                "user_answer": question["options"][user_answer],
                "correct_answer": question["options"][correct_answer],
                "is_correct": is_correct,
                "explanation": _get_explanation(quiz_id, i + 1, is_correct)
            })
        
        # Update user progress if passed
        if passed:
            current_user.update_progress(quiz_passed=True)
            db.commit()
            
            logger.info(
                "Quiz completed successfully",
                user_id=current_user.id,
                quiz_id=quiz_id,
                score=score
            )
        
        return QuizResultResponse(
            quiz_id=quiz_id,
            score=score,
            passed=passed,
            correct_answers=correct_count,
            total_questions=total_questions,
            feedback=feedback
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Failed to submit quiz",
            user_id=current_user.id,
            quiz_id=quiz_id,
            error=str(e)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit quiz"
        )

@router.get("/{quiz_id}/results")
async def get_quiz_results(
    quiz_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get user's previous quiz results"""
    # Mock results data - in production, this would come from database
    mock_results = [
        {
            "attempt_id": 1,
            "quiz_id": quiz_id,
            "score": 85,
            "passed": True,
            "completed_at": "2024-01-15T10:30:00Z",
            "time_taken": 240
        },
        {
            "attempt_id": 2,
            "quiz_id": quiz_id,
            "score": 92,
            "passed": True,
            "completed_at": "2024-01-20T14:15:00Z",
            "time_taken": 180
        }
    ]
    
    return {
        "quiz_id": quiz_id,
        "attempts": mock_results,
        "best_score": max(result["score"] for result in mock_results) if mock_results else 0,
        "total_attempts": len(mock_results)
    }

def _get_explanation(quiz_id: str, question_id: int, is_correct: bool) -> str:
    """Get explanation for quiz question"""
    explanations = {
        "defi-basics": {
            1: "DeFi stands for Decentralized Finance, which refers to financial services built on blockchain technology without traditional intermediaries.",
            2: "Ethereum is the most popular blockchain for DeFi applications due to its smart contract capabilities and large ecosystem.",
            3: "Smart contracts are self-executing programs on the blockchain that automatically enforce agreements without intermediaries.",
            4: "Smart contract vulnerabilities are the main risk in DeFi, as bugs in code can lead to loss of funds.",
            5: "Yield farming involves providing liquidity to DeFi protocols in exchange for rewards, often in the form of tokens."
        },
        "wallet-security": {
            1: "Your private key should never be shared as it gives complete control over your wallet and funds.",
            2: "Seed phrases typically contain 12 or 24 words that can restore your entire wallet.",
            3: "Hardware wallets provide the highest security for storing large amounts of cryptocurrency offline.",
            4: "Always research and verify DeFi protocols before interacting with them to avoid scams and vulnerabilities."
        }
    }

    quiz_explanations = explanations.get(quiz_id, {})
    explanation = quiz_explanations.get(question_id, "")

    if is_correct:
        return f"Correct! {explanation}"
    else:
        return f"Incorrect. {explanation}"
