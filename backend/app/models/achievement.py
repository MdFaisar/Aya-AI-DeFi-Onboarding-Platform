from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    achievement_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(100), nullable=True)  # emoji or icon identifier
    category = Column(String(50), nullable=True)
    
    # Achievement properties
    rarity = Column(String(20), default="common")  # common, uncommon, rare, legendary
    points = Column(Integer, default=10)
    
    # Unlock conditions
    conditions = Column(JSON, nullable=False)  # JSON describing unlock conditions
    
    # Status
    is_active = Column(Boolean, default=True)
    is_hidden = Column(Boolean, default=False)  # Hidden until unlocked
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")
    
    def __repr__(self):
        return f"<Achievement(id={self.achievement_id}, name={self.name}, rarity={self.rarity})>"

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    
    # Achievement progress
    progress = Column(Integer, default=0)
    target = Column(Integer, nullable=False)
    is_unlocked = Column(Boolean, default=False)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    unlocked_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
    
    def __repr__(self):
        return f"<UserAchievement(user_id={self.user_id}, achievement_id={self.achievement_id}, unlocked={self.is_unlocked})>"
    
    @property
    def progress_percentage(self):
        """Calculate progress percentage"""
        if self.target == 0:
            return 100.0
        return min((self.progress / self.target) * 100, 100.0)
