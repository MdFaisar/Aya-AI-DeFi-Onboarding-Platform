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

# Mock lesson data - in production, this would come from database
LESSONS = [
    {
        "id": "defi-fundamentals",
        "title": "DeFi Fundamentals",
        "description": "Learn the basics of decentralized finance",
        "difficulty": "beginner",
        "estimated_time": "30 minutes",
        "topics": ["What is DeFi", "Traditional vs DeFi", "Key Benefits", "Common Risks"],
        "prerequisites": [],
        "order": 1
    },
    {
        "id": "understanding-wallets",
        "title": "Understanding Wallets",
        "description": "Master wallet security and management",
        "difficulty": "beginner",
        "estimated_time": "25 minutes",
        "topics": ["Wallet Types", "Security Best Practices", "Private Keys", "Seed Phrases"],
        "prerequisites": ["defi-fundamentals"],
        "order": 2
    },
    {
        "id": "tokens-and-standards",
        "title": "Tokens and Standards",
        "description": "Understanding ERC-20, ERC-721, and other token standards",
        "difficulty": "beginner",
        "estimated_time": "35 minutes",
        "topics": ["ERC-20 Tokens", "NFTs", "Token Economics", "Smart Contracts"],
        "prerequisites": ["understanding-wallets"],
        "order": 3
    },
    {
        "id": "decentralized-exchanges",
        "title": "Decentralized Exchanges",
        "description": "Learn how DEXs work and how to trade safely",
        "difficulty": "intermediate",
        "estimated_time": "45 minutes",
        "topics": ["AMM Basics", "Uniswap", "Slippage", "Trading Strategies"],
        "prerequisites": ["tokens-and-standards"],
        "order": 4
    },
    {
        "id": "liquidity-pools",
        "title": "Liquidity Pools",
        "description": "Deep dive into liquidity provision and AMMs",
        "difficulty": "intermediate",
        "estimated_time": "50 minutes",
        "topics": ["How LPs Work", "Impermanent Loss", "Yield Farming", "Risk Management"],
        "prerequisites": ["decentralized-exchanges"],
        "order": 5
    }
]

# Request/Response models
class LessonResponse(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimated_time: str
    topics: List[str]
    prerequisites: List[str]
    order: int
    is_completed: bool
    is_available: bool

class LessonProgressRequest(BaseModel):
    lesson_id: str
    completed: bool
    score: Optional[int] = None
    time_spent: Optional[int] = None  # in seconds

@router.get("/", response_model=List[LessonResponse])
async def get_lessons(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all lessons with user progress"""
    try:
        # Get user's completed lessons (mock data)
        completed_lessons = ["defi-fundamentals", "understanding-wallets"]  # This would come from DB
        
        lessons_with_progress = []
        for lesson in LESSONS:
            is_completed = lesson["id"] in completed_lessons
            is_available = _is_lesson_available(lesson, completed_lessons)
            
            lessons_with_progress.append(LessonResponse(
                id=lesson["id"],
                title=lesson["title"],
                description=lesson["description"],
                difficulty=lesson["difficulty"],
                estimated_time=lesson["estimated_time"],
                topics=lesson["topics"],
                prerequisites=lesson["prerequisites"],
                order=lesson["order"],
                is_completed=is_completed,
                is_available=is_available
            ))
        
        return lessons_with_progress
        
    except Exception as e:
        logger.error("Failed to get lessons", user_id=current_user.id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve lessons"
        )

@router.get("/{lesson_id}")
async def get_lesson_detail(
    lesson_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed lesson content"""
    lesson = next((l for l in LESSONS if l["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Check if lesson is available
    completed_lessons = ["defi-fundamentals", "understanding-wallets"]  # Mock data
    if not _is_lesson_available(lesson, completed_lessons):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Lesson not available. Complete prerequisites first."
        )
    
    # Return detailed lesson content
    return {
        **lesson,
        "content": _get_lesson_content(lesson_id),
        "is_completed": lesson_id in completed_lessons,
        "progress": _get_lesson_progress(lesson_id, current_user.id)
    }

@router.post("/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: str,
    progress_data: LessonProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark lesson as completed"""
    try:
        lesson = next((l for l in LESSONS if l["id"] == lesson_id), None)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        # Update user progress
        current_user.update_progress(lesson_completed=True)
        db.commit()
        
        logger.info(
            "Lesson completed",
            user_id=current_user.id,
            lesson_id=lesson_id,
            score=progress_data.score
        )
        
        return {
            "message": "Lesson completed successfully",
            "lesson_id": lesson_id,
            "new_progress": current_user.overall_progress_percentage,
            "achievements": _check_achievements(current_user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Failed to complete lesson",
            user_id=current_user.id,
            lesson_id=lesson_id,
            error=str(e)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete lesson"
        )

@router.get("/{lesson_id}/quiz")
async def get_lesson_quiz(
    lesson_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get quiz for a specific lesson"""
    lesson = next((l for l in LESSONS if l["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Return mock quiz data
    return {
        "lesson_id": lesson_id,
        "quiz": {
            "id": f"{lesson_id}-quiz",
            "title": f"{lesson['title']} Quiz",
            "questions": _get_lesson_quiz_questions(lesson_id),
            "passing_score": 70,
            "time_limit": 300  # 5 minutes
        }
    }

def _is_lesson_available(lesson: dict, completed_lessons: List[str]) -> bool:
    """Check if lesson is available based on prerequisites"""
    if not lesson["prerequisites"]:
        return True
    
    return all(prereq in completed_lessons for prereq in lesson["prerequisites"])

def _get_lesson_content(lesson_id: str) -> dict:
    """Get lesson content (mock implementation)"""
    content_map = {
        "defi-fundamentals": {
            "sections": [
                {
                    "title": "What is DeFi?",
                    "content": "Decentralized Finance (DeFi) refers to financial services built on blockchain technology...",
                    "type": "text"
                },
                {
                    "title": "Traditional vs DeFi",
                    "content": "Compare traditional banking with DeFi protocols...",
                    "type": "comparison"
                },
                {
                    "title": "Interactive Example",
                    "content": "Try connecting a wallet to see how DeFi works...",
                    "type": "interactive"
                }
            ],
            "resources": [
                {"title": "DeFi Pulse", "url": "https://defipulse.com"},
                {"title": "Ethereum.org DeFi Guide", "url": "https://ethereum.org/en/defi/"}
            ]
        }
    }
    
    return content_map.get(lesson_id, {"sections": [], "resources": []})

def _get_lesson_progress(lesson_id: str, user_id: int) -> dict:
    """Get user's progress for a specific lesson"""
    # Mock progress data
    return {
        "started_at": "2024-01-15T10:00:00Z",
        "last_accessed": "2024-01-15T10:30:00Z",
        "time_spent": 1800,  # 30 minutes
        "sections_completed": 2,
        "total_sections": 3
    }

def _get_lesson_quiz_questions(lesson_id: str) -> List[dict]:
    """Get quiz questions for a lesson"""
    # Mock quiz questions
    return [
        {
            "id": 1,
            "question": "What does DeFi stand for?",
            "options": [
                "Digital Finance",
                "Decentralized Finance",
                "Distributed Finance",
                "Deferred Finance"
            ],
            "correct_answer": 1,
            "explanation": "DeFi stands for Decentralized Finance, referring to financial services built on blockchain."
        }
    ]

def _check_achievements(user: User) -> List[dict]:
    """Check for new achievements"""
    achievements = []
    
    if user.total_lessons_completed == 1:
        achievements.append({
            "id": "first_lesson",
            "name": "First Steps",
            "description": "Completed your first lesson"
        })
    
    if user.total_lessons_completed == 5:
        achievements.append({
            "id": "learning_streak",
            "name": "Learning Streak",
            "description": "Completed 5 lessons"
        })
    
    return achievements
