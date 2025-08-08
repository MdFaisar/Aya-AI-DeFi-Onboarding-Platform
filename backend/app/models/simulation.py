from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), nullable=False)  # swap, lend, borrow, stake, provide_liquidity
    protocol = Column(String(50), nullable=False)
    difficulty = Column(String(20), default="beginner")
    estimated_time = Column(Integer, default=15)  # in minutes
    
    # Configuration
    default_params = Column(JSON, nullable=True)
    
    # Status
    is_published = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_simulations = relationship("UserSimulation", back_populates="simulation")
    
    def __repr__(self):
        return f"<Simulation(id={self.simulation_id}, type={self.type}, protocol={self.protocol})>"

class UserSimulation(Base):
    __tablename__ = "user_simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    simulation_id = Column(Integer, ForeignKey("simulations.id"), nullable=False)
    
    # Simulation data
    input_params = Column(JSON, nullable=False)
    result_data = Column(JSON, nullable=True)
    status = Column(String(20), default="pending")  # pending, success, failed
    
    # Performance metrics
    execution_time = Column(Integer, nullable=True)  # in milliseconds
    gas_estimate = Column(String(50), nullable=True)
    success_rate = Column(Float, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="simulations")
    simulation = relationship("Simulation", back_populates="user_simulations")
    
    def __repr__(self):
        return f"<UserSimulation(user_id={self.user_id}, simulation_id={self.simulation_id}, status={self.status})>"
