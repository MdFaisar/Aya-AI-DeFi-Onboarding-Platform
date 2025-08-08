from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import structlog

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User

logger = structlog.get_logger()

router = APIRouter()

# Request/Response models
class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    experience_level: Optional[str] = None
    risk_tolerance: Optional[str] = None
    preferred_language: Optional[str] = None
    timezone: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: int
    wallet_address: str
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    bio: Optional[str]
    experience_level: str
    risk_tolerance: str
    preferred_language: str
    timezone: str
    current_level: str
    overall_progress_percentage: float
    total_lessons_completed: int
    total_quizzes_passed: int
    total_simulations_completed: int
    is_verified: bool
    is_premium: bool

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile"""
    return UserProfileResponse(
        id=current_user.id,
        wallet_address=current_user.wallet_address,
        username=current_user.username,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        bio=current_user.bio,
        experience_level=current_user.experience_level,
        risk_tolerance=current_user.risk_tolerance,
        preferred_language=current_user.preferred_language,
        timezone=current_user.timezone,
        current_level=current_user.current_level,
        overall_progress_percentage=current_user.overall_progress_percentage,
        total_lessons_completed=current_user.total_lessons_completed,
        total_quizzes_passed=current_user.total_quizzes_passed,
        total_simulations_completed=current_user.total_simulations_completed,
        is_verified=current_user.is_verified,
        is_premium=current_user.is_premium
    )

@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    try:
        # Update fields if provided
        if update_data.username is not None:
            # Check if username is already taken
            existing_user = db.query(User).filter(
                User.username == update_data.username,
                User.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
            current_user.username = update_data.username
        
        if update_data.first_name is not None:
            current_user.first_name = update_data.first_name
        
        if update_data.last_name is not None:
            current_user.last_name = update_data.last_name
        
        if update_data.bio is not None:
            current_user.bio = update_data.bio
        
        if update_data.experience_level is not None:
            if update_data.experience_level not in ["beginner", "intermediate", "advanced"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid experience level"
                )
            current_user.experience_level = update_data.experience_level
        
        if update_data.risk_tolerance is not None:
            if update_data.risk_tolerance not in ["low", "medium", "high"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid risk tolerance"
                )
            current_user.risk_tolerance = update_data.risk_tolerance
        
        if update_data.preferred_language is not None:
            current_user.preferred_language = update_data.preferred_language
        
        if update_data.timezone is not None:
            current_user.timezone = update_data.timezone
        
        db.commit()
        db.refresh(current_user)
        
        logger.info("User profile updated", user_id=current_user.id)
        
        return UserProfileResponse(
            id=current_user.id,
            wallet_address=current_user.wallet_address,
            username=current_user.username,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            bio=current_user.bio,
            experience_level=current_user.experience_level,
            risk_tolerance=current_user.risk_tolerance,
            preferred_language=current_user.preferred_language,
            timezone=current_user.timezone,
            current_level=current_user.current_level,
            overall_progress_percentage=current_user.overall_progress_percentage,
            total_lessons_completed=current_user.total_lessons_completed,
            total_quizzes_passed=current_user.total_quizzes_passed,
            total_simulations_completed=current_user.total_simulations_completed,
            is_verified=current_user.is_verified,
            is_premium=current_user.is_premium
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update user profile", user_id=current_user.id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

@router.get("/progress")
async def get_user_progress(current_user: User = Depends(get_current_user)):
    """Get detailed user progress information"""
    return {
        "user_id": current_user.id,
        "current_level": current_user.current_level,
        "experience_level": current_user.experience_level,
        "overall_progress": current_user.overall_progress_percentage,
        "lessons": {
            "completed": current_user.total_lessons_completed,
            "total": 20  # This would come from a lessons count query
        },
        "quizzes": {
            "passed": current_user.total_quizzes_passed,
            "total": 15  # This would come from a quizzes count query
        },
        "simulations": {
            "completed": current_user.total_simulations_completed,
            "total": 10  # This would come from a simulations count query
        },
        "achievements": {
            "unlocked": 7,  # This would come from achievements query
            "total": 20
        },
        "next_milestone": self._get_next_milestone(current_user),
        "recommendations": self._get_recommendations(current_user)
    }

def _get_next_milestone(user: User) -> str:
    """Get next milestone for user"""
    if user.overall_progress_percentage < 20:
        return "Complete 5 lessons to reach Intermediate level"
    elif user.overall_progress_percentage < 50:
        return "Pass 10 quizzes to unlock advanced features"
    elif user.overall_progress_percentage < 80:
        return "Complete 8 simulations to reach Expert level"
    else:
        return "You're doing great! Keep exploring new DeFi protocols"

def _get_recommendations(user: User) -> list:
    """Get personalized recommendations for user"""
    recommendations = []
    
    if user.total_lessons_completed < 5:
        recommendations.append("Continue with basic DeFi lessons")
    
    if user.total_quizzes_passed < user.total_lessons_completed:
        recommendations.append("Take quizzes to test your knowledge")
    
    if user.total_simulations_completed == 0:
        recommendations.append("Try your first simulation on testnet")
    
    if user.experience_level == "beginner" and user.overall_progress_percentage > 30:
        recommendations.append("Consider updating your experience level")
    
    return recommendations or ["Keep up the great work!"]

@router.delete("/account")
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account (soft delete)"""
    try:
        current_user.is_active = False
        db.commit()
        
        logger.info("User account deactivated", user_id=current_user.id)
        
        return {"message": "Account successfully deactivated"}
        
    except Exception as e:
        logger.error("Failed to delete user account", user_id=current_user.id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )
