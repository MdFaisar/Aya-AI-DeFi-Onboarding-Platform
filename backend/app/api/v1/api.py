from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    lessons,
    quizzes,
    simulations,
    risk,
    ai,
    analytics,
    protocols
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(simulations.router, prefix="/simulations", tags=["simulations"])
api_router.include_router(risk.router, prefix="/risk", tags=["risk-assessment"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai-services"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(protocols.router, prefix="/protocols", tags=["protocols"])
