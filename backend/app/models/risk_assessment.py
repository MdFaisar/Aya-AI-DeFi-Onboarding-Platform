from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Assessment details
    type = Column(String(50), nullable=False)  # protocol, token, portfolio, transaction
    target = Column(String(200), nullable=True)  # protocol name, token address, etc.
    
    # Risk scores (0-100, where 0 is safest)
    overall_risk_score = Column(Integer, nullable=False)
    smart_contract_risk = Column(Integer, nullable=False)
    liquidity_risk = Column(Integer, nullable=False)
    volatility_risk = Column(Integer, nullable=False)
    regulatory_risk = Column(Integer, nullable=False)
    team_risk = Column(Integer, nullable=False)
    
    # Risk level
    risk_level = Column(String(20), nullable=False)  # low, medium, high
    
    # Additional data
    warnings = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    details = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="risk_assessments")
    
    def __repr__(self):
        return f"<RiskAssessment(id={self.assessment_id}, type={self.type}, risk_level={self.risk_level})>"

class PortfolioRisk(Base):
    __tablename__ = "portfolio_risks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    wallet_address = Column(String(42), nullable=False)
    
    # Portfolio metrics
    total_value_usd = Column(Float, nullable=False)
    asset_count = Column(Integer, nullable=False)
    defi_exposure_percentage = Column(Float, nullable=False)
    
    # Risk metrics
    overall_risk_score = Column(Integer, nullable=False)
    diversification_score = Column(Integer, nullable=False)
    concentration_risk = Column(String(20), nullable=False)  # low, medium, high
    volatility_score = Column(Integer, nullable=False)
    liquidity_score = Column(Integer, nullable=False)
    
    # Portfolio breakdown
    asset_breakdown = Column(JSON, nullable=True)
    defi_positions = Column(JSON, nullable=True)
    risk_factors = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<PortfolioRisk(user_id={self.user_id}, wallet={self.wallet_address}, risk_score={self.overall_risk_score})>"

class RiskAlert(Base):
    __tablename__ = "risk_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    alert_id = Column(String(100), unique=True, index=True, nullable=False)
    
    # Alert details
    type = Column(String(50), nullable=False)  # high_gas, protocol_risk, liquidation_risk, etc.
    severity = Column(String(20), nullable=False)  # info, warning, critical
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    
    # Alert status
    is_active = Column(Boolean, default=True)
    is_read = Column(Boolean, default=False)
    action_required = Column(Boolean, default=False)
    
    # Additional data
    alert_metadata = Column(JSON, nullable=True)
    action_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<RiskAlert(id={self.alert_id}, type={self.type}, severity={self.severity})>"
