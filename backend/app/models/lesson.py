from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    difficulty = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    estimated_time = Column(Integer, default=30)  # in minutes
    order = Column(Integer, default=0)
    category = Column(String(50), nullable=True)
    
    # Status
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_progress = relationship("UserLessonProgress", back_populates="lesson")
    
    def __repr__(self):
        return f"<Lesson(id={self.lesson_id}, title={self.title})>"

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    
    # Progress tracking
    is_completed = Column(Boolean, default=False)
    completion_percentage = Column(Float, default=0.0)
    time_spent = Column(Integer, default=0)  # in seconds
    score = Column(Integer, nullable=True)  # 0-100
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="user_progress")
    
    def __repr__(self):
        return f"<UserLessonProgress(user_id={self.user_id}, lesson_id={self.lesson_id}, completed={self.is_completed})>"
