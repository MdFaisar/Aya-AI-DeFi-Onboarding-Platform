from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String(42), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    username = Column(String(50), unique=True, index=True, nullable=True)
    
    # Profile information
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Experience and preferences
    experience_level = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    risk_tolerance = Column(String(20), default="low")  # low, medium, high
    preferred_language = Column(String(10), default="en")
    timezone = Column(String(50), default="UTC")
    
    # Learning progress
    total_lessons_completed = Column(Integer, default=0)
    total_quizzes_passed = Column(Integer, default=0)
    total_simulations_completed = Column(Integer, default=0)
    overall_progress_percentage = Column(Float, default=0.0)
    current_level = Column(String(20), default="Beginner")
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    lesson_progress = relationship("UserLessonProgress", back_populates="user")
    quiz_attempts = relationship("UserQuizAttempt", back_populates="user")
    simulations = relationship("UserSimulation", back_populates="user")
    risk_assessments = relationship("RiskAssessment", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, wallet_address={self.wallet_address}, level={self.current_level})>"
    
    @property
    def full_name(self):
        """Get user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username or self.wallet_address[:10] + "..."
    
    @property
    def display_name(self):
        """Get user's display name"""
        return self.username or self.full_name or f"User {self.wallet_address[:8]}..."
    
    def update_progress(self, lesson_completed=False, quiz_passed=False, simulation_completed=False):
        """Update user's learning progress"""
        if lesson_completed:
            self.total_lessons_completed += 1
        if quiz_passed:
            self.total_quizzes_passed += 1
        if simulation_completed:
            self.total_simulations_completed += 1
        
        # Calculate overall progress (weighted)
        lesson_weight = 0.5
        quiz_weight = 0.3
        simulation_weight = 0.2
        
        # Assuming 20 total lessons, 15 total quizzes, 10 total simulations
        lesson_progress = min(self.total_lessons_completed / 20, 1.0)
        quiz_progress = min(self.total_quizzes_passed / 15, 1.0)
        simulation_progress = min(self.total_simulations_completed / 10, 1.0)
        
        self.overall_progress_percentage = (
            lesson_progress * lesson_weight +
            quiz_progress * quiz_weight +
            simulation_progress * simulation_weight
        ) * 100
        
        # Update level based on progress
        if self.overall_progress_percentage >= 80:
            self.current_level = "Expert"
        elif self.overall_progress_percentage >= 50:
            self.current_level = "Advanced"
        elif self.overall_progress_percentage >= 20:
            self.current_level = "Intermediate"
        else:
            self.current_level = "Beginner"
