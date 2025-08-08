from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import structlog
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User

logger = structlog.get_logger()

router = APIRouter()

# Response models
class LearningAnalytics(BaseModel):
    total_time_spent: int  # in minutes
    lessons_completed: int
    quizzes_passed: int
    simulations_completed: int
    average_quiz_score: float
    learning_streak: int
    favorite_topics: List[str]
    progress_over_time: List[Dict[str, Any]]

class PerformanceMetrics(BaseModel):
    user_rank: int
    total_users: int
    percentile: float
    achievements_unlocked: int
    total_achievements: int
    skill_levels: Dict[str, str]

@router.get("/dashboard")
async def get_analytics_dashboard(
    current_user: User = Depends(get_current_user),
    timeframe: str = "30d"  # 7d, 30d, 90d, all
):
    """Get comprehensive analytics dashboard for user"""
    try:
        # Mock analytics data - in production, this would come from database queries
        dashboard_data = {
            "overview": {
                "total_learning_time": 1250,  # minutes
                "lessons_completed": current_user.total_lessons_completed,
                "quizzes_passed": current_user.total_quizzes_passed,
                "simulations_completed": current_user.total_simulations_completed,
                "overall_progress": current_user.overall_progress_percentage,
                "current_streak": 7,  # days
                "level": current_user.current_level
            },
            "learning_velocity": {
                "lessons_per_week": 2.5,
                "quizzes_per_week": 1.8,
                "simulations_per_week": 1.2,
                "trend": "increasing"  # increasing, stable, decreasing
            },
            "performance": {
                "average_quiz_score": 87.5,
                "quiz_improvement": "+12%",
                "simulation_success_rate": 95.0,
                "time_to_completion": {
                    "lessons": 25,  # average minutes per lesson
                    "quizzes": 8,   # average minutes per quiz
                    "simulations": 15  # average minutes per simulation
                }
            },
            "engagement": {
                "daily_active_days": 22,  # out of last 30
                "peak_learning_hour": 14,  # 2 PM
                "preferred_content_type": "interactive",
                "session_duration": 35  # average minutes
            }
        }
        
        return dashboard_data
        
    except Exception as e:
        logger.error("Failed to get analytics dashboard", user_id=current_user.id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics"
        )

@router.get("/learning-progress")
async def get_learning_progress(
    current_user: User = Depends(get_current_user),
    timeframe: str = "30d"
):
    """Get detailed learning progress analytics"""
    # Mock progress data over time
    progress_data = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(30):
        date = base_date + timedelta(days=i)
        progress_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "lessons_completed": min(i // 3, current_user.total_lessons_completed),
            "quizzes_passed": min(i // 4, current_user.total_quizzes_passed),
            "simulations_completed": min(i // 6, current_user.total_simulations_completed),
            "overall_progress": min((i / 30) * current_user.overall_progress_percentage, current_user.overall_progress_percentage),
            "time_spent": max(0, 30 + (i * 2) + (i % 7) * 10)  # Variable daily time
        })
    
    return {
        "timeframe": timeframe,
        "progress_data": progress_data,
        "milestones": [
            {
                "date": "2024-01-10",
                "type": "lesson_milestone",
                "description": "Completed 5 lessons",
                "achievement": "Learning Streak"
            },
            {
                "date": "2024-01-15",
                "type": "quiz_milestone", 
                "description": "Passed first quiz with 90%+",
                "achievement": "Quiz Master"
            }
        ],
        "trends": {
            "learning_velocity": "increasing",
            "engagement": "stable",
            "performance": "improving"
        }
    }

@router.get("/performance-comparison")
async def get_performance_comparison(
    current_user: User = Depends(get_current_user)
):
    """Compare user performance with peers"""
    # Mock comparison data
    comparison_data = {
        "user_stats": {
            "lessons_completed": current_user.total_lessons_completed,
            "quizzes_passed": current_user.total_quizzes_passed,
            "simulations_completed": current_user.total_simulations_completed,
            "average_quiz_score": 87.5,
            "learning_time": 1250  # minutes
        },
        "peer_averages": {
            "lessons_completed": 8.2,
            "quizzes_passed": 5.8,
            "simulations_completed": 3.1,
            "average_quiz_score": 78.3,
            "learning_time": 980
        },
        "percentiles": {
            "lessons_completed": 75,  # user is in 75th percentile
            "quizzes_passed": 82,
            "simulations_completed": 90,
            "average_quiz_score": 88,
            "overall_progress": 78
        },
        "ranking": {
            "current_rank": 156,
            "total_users": 1250,
            "percentile": 87.5,
            "rank_change": "+23"  # positions gained
        },
        "achievements": {
            "user_achievements": 7,
            "average_achievements": 4.2,
            "rare_achievements": 2  # achievements held by <10% of users
        }
    }
    
    return comparison_data

@router.get("/skill-assessment")
async def get_skill_assessment(
    current_user: User = Depends(get_current_user)
):
    """Get detailed skill level assessment across DeFi topics"""
    # Mock skill assessment based on user activity
    skills = {
        "defi_fundamentals": {
            "level": "advanced",
            "score": 92,
            "lessons_completed": 5,
            "quiz_scores": [85, 90, 95, 88, 92],
            "last_activity": "2024-01-15T10:30:00Z",
            "recommendations": [
                "Ready for advanced DeFi strategies",
                "Consider exploring cross-chain DeFi"
            ]
        },
        "wallet_security": {
            "level": "intermediate",
            "score": 78,
            "lessons_completed": 3,
            "quiz_scores": [75, 80, 82],
            "last_activity": "2024-01-12T14:20:00Z",
            "recommendations": [
                "Practice hardware wallet setup",
                "Learn about multi-sig wallets"
            ]
        },
        "trading_strategies": {
            "level": "beginner",
            "score": 65,
            "lessons_completed": 2,
            "quiz_scores": [60, 70],
            "last_activity": "2024-01-08T09:15:00Z",
            "recommendations": [
                "Complete more trading lessons",
                "Practice with simulations"
            ]
        },
        "risk_management": {
            "level": "intermediate",
            "score": 82,
            "lessons_completed": 4,
            "quiz_scores": [80, 85, 78, 85],
            "last_activity": "2024-01-14T16:45:00Z",
            "recommendations": [
                "Learn advanced risk metrics",
                "Practice portfolio optimization"
            ]
        },
        "yield_farming": {
            "level": "beginner",
            "score": 58,
            "lessons_completed": 1,
            "quiz_scores": [58],
            "last_activity": "2024-01-05T11:30:00Z",
            "recommendations": [
                "Complete yield farming basics",
                "Understand impermanent loss"
            ]
        }
    }
    
    # Calculate overall skill level
    skill_scores = [skill["score"] for skill in skills.values()]
    overall_score = sum(skill_scores) / len(skill_scores)
    
    if overall_score >= 85:
        overall_level = "advanced"
    elif overall_score >= 70:
        overall_level = "intermediate"
    else:
        overall_level = "beginner"
    
    return {
        "overall_skill_level": overall_level,
        "overall_score": round(overall_score, 1),
        "skills": skills,
        "skill_distribution": {
            "advanced": len([s for s in skills.values() if s["level"] == "advanced"]),
            "intermediate": len([s for s in skills.values() if s["level"] == "intermediate"]),
            "beginner": len([s for s in skills.values() if s["level"] == "beginner"])
        },
        "next_focus_areas": [
            "yield_farming",
            "trading_strategies"
        ],
        "strengths": [
            "defi_fundamentals",
            "risk_management"
        ]
    }

@router.get("/learning-recommendations")
async def get_learning_recommendations(
    current_user: User = Depends(get_current_user)
):
    """Get personalized learning recommendations based on analytics"""
    # Analyze user's learning pattern and performance
    recommendations = []
    
    # Based on progress
    if current_user.total_lessons_completed < 5:
        recommendations.append({
            "type": "lesson",
            "priority": "high",
            "title": "Complete Basic DeFi Lessons",
            "description": "Focus on fundamental concepts before moving to advanced topics",
            "estimated_time": "2 hours",
            "difficulty": "beginner"
        })
    
    # Based on quiz performance
    if current_user.total_quizzes_passed < current_user.total_lessons_completed:
        recommendations.append({
            "type": "quiz",
            "priority": "medium",
            "title": "Take More Quizzes",
            "description": "Test your knowledge with quizzes to reinforce learning",
            "estimated_time": "30 minutes",
            "difficulty": "varies"
        })
    
    # Based on simulation activity
    if current_user.total_simulations_completed == 0:
        recommendations.append({
            "type": "simulation",
            "priority": "high",
            "title": "Try Your First Simulation",
            "description": "Practice DeFi transactions safely on testnet",
            "estimated_time": "15 minutes",
            "difficulty": "beginner"
        })
    
    # Personalized recommendations
    recommendations.extend([
        {
            "type": "lesson",
            "priority": "medium",
            "title": "Advanced Yield Farming Strategies",
            "description": "Learn about complex yield optimization techniques",
            "estimated_time": "45 minutes",
            "difficulty": "advanced"
        },
        {
            "type": "practice",
            "priority": "low",
            "title": "Portfolio Rebalancing Exercise",
            "description": "Practice maintaining optimal portfolio allocation",
            "estimated_time": "20 minutes",
            "difficulty": "intermediate"
        }
    ])
    
    return {
        "recommendations": recommendations,
        "learning_path": {
            "current_focus": "DeFi Fundamentals",
            "next_milestone": "Complete 10 lessons to unlock Intermediate level",
            "estimated_completion": "2 weeks",
            "suggested_schedule": "3-4 lessons per week"
        },
        "adaptive_suggestions": {
            "optimal_session_length": "30-45 minutes",
            "best_learning_time": "2:00 PM - 4:00 PM",
            "preferred_content_mix": "60% lessons, 25% quizzes, 15% simulations"
        }
    }

@router.get("/achievements")
async def get_achievement_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get detailed achievement analytics"""
    # Mock achievement data
    achievements = {
        "unlocked": [
            {
                "id": "first_lesson",
                "name": "First Steps",
                "description": "Completed your first DeFi lesson",
                "icon": "🎯",
                "unlocked_at": "2024-01-10T10:00:00Z",
                "rarity": "common"
            },
            {
                "id": "quiz_master",
                "name": "Quiz Master",
                "description": "Scored 90%+ on 3 quizzes",
                "icon": "🧠",
                "unlocked_at": "2024-01-15T14:30:00Z",
                "rarity": "uncommon"
            },
            {
                "id": "simulation_pro",
                "name": "Simulation Pro",
                "description": "Completed 5 simulations successfully",
                "icon": "⚡",
                "unlocked_at": "2024-01-18T16:45:00Z",
                "rarity": "rare"
            }
        ],
        "available": [
            {
                "id": "learning_streak_7",
                "name": "Week Warrior",
                "description": "Learn for 7 consecutive days",
                "icon": "🔥",
                "progress": 5,
                "target": 7,
                "rarity": "uncommon"
            },
            {
                "id": "perfect_quiz",
                "name": "Perfect Score",
                "description": "Score 100% on any quiz",
                "icon": "💯",
                "progress": 0,
                "target": 1,
                "rarity": "rare"
            }
        ],
        "statistics": {
            "total_unlocked": 3,
            "total_available": 15,
            "completion_rate": 20.0,
            "rarity_distribution": {
                "common": 1,
                "uncommon": 1,
                "rare": 1,
                "legendary": 0
            }
        }
    }
    
    return achievements

@router.get("/export")
async def export_analytics(
    current_user: User = Depends(get_current_user),
    format: str = "json"  # json, csv
):
    """Export user analytics data"""
    if format not in ["json", "csv"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid export format. Use 'json' or 'csv'"
        )
    
    # Compile all user data
    export_data = {
        "user_info": {
            "id": current_user.id,
            "wallet_address": current_user.wallet_address,
            "experience_level": current_user.experience_level,
            "current_level": current_user.current_level,
            "created_at": current_user.created_at.isoformat()
        },
        "progress": {
            "overall_progress": current_user.overall_progress_percentage,
            "lessons_completed": current_user.total_lessons_completed,
            "quizzes_passed": current_user.total_quizzes_passed,
            "simulations_completed": current_user.total_simulations_completed
        },
        "exported_at": datetime.utcnow().isoformat()
    }
    
    if format == "json":
        return export_data
    else:
        # For CSV format, you would convert to CSV here
        # This is a simplified response
        return {
            "message": "CSV export functionality would be implemented here",
            "data": export_data
        }
