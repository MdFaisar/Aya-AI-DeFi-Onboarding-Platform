from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(20), default="beginner")
    category = Column(String(50), nullable=True)
    time_limit = Column(Integer, default=300)  # in seconds
    passing_score = Column(Integer, default=70)  # percentage
    
    # Status
    is_published = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    questions = relationship("QuizQuestion", back_populates="quiz")
    attempts = relationship("UserQuizAttempt", back_populates="quiz")
    
    def __repr__(self):
        return f"<Quiz(id={self.quiz_id}, title={self.title})>"

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # List of answer options
    correct_answer = Column(Integer, nullable=False)  # Index of correct option
    explanation = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    
    def __repr__(self):
        return f"<QuizQuestion(id={self.id}, quiz_id={self.quiz_id})>"

class UserQuizAttempt(Base):
    __tablename__ = "user_quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    
    # Attempt data
    answers = Column(JSON, nullable=False)  # List of user's answers
    score = Column(Integer, nullable=False)  # 0-100
    passed = Column(Boolean, nullable=False)
    time_taken = Column(Integer, nullable=True)  # in seconds
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
    
    def __repr__(self):
        return f"<UserQuizAttempt(user_id={self.user_id}, quiz_id={self.quiz_id}, score={self.score})>"
