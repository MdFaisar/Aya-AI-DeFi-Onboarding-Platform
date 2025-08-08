from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import asyncio
from typing import Generator

from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db() -> Generator:
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def create_tables():
    """Create all database tables"""
    # Import all models to ensure they are registered
    from app.models.user import User
    from app.models.lesson import Lesson, UserLessonProgress
    from app.models.quiz import Quiz, QuizQuestion, UserQuizAttempt
    from app.models.simulation import Simulation, UserSimulation
    from app.models.risk_assessment import RiskAssessment, PortfolioRisk
    from app.models.achievement import Achievement, UserAchievement
    
    # Create tables
    Base.metadata.create_all(bind=engine)

def init_db():
    """Initialize database with default data"""
    from app.core.init_data import create_initial_data
    create_initial_data()

# Database utilities
class DatabaseManager:
    """Database management utilities"""
    
    @staticmethod
    def check_connection() -> bool:
        """Check if database connection is working"""
        try:
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            return True
        except Exception:
            return False
    
    @staticmethod
    def get_table_count() -> int:
        """Get number of tables in database"""
        try:
            with engine.connect() as conn:
                result = conn.execute(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"
                )
                return result.scalar()
        except Exception:
            return 0
    
    @staticmethod
    def reset_database():
        """Reset database (drop and recreate all tables)"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

# Export database manager instance
db_manager = DatabaseManager()
