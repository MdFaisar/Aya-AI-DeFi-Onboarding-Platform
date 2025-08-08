from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import structlog
from datetime import datetime

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User

logger = structlog.get_logger()

router = APIRouter()

# Request/Response models
class RiskAssessmentRequest(BaseModel):
    type: str  # protocol, token, portfolio, transaction
    address: Optional[str] = None
    protocol: Optional[str] = None
    amount: Optional[str] = None
    token_addresses: Optional[List[str]] = None

class RiskScore(BaseModel):
    overall: int  # 0-100, where 0 is safest
    smart_contract: int
    liquidity: int
    volatility: int
    regulatory: int
    team: int

class RiskAssessmentResponse(BaseModel):
    assessment_id: str
    type: str
    risk_score: RiskScore
    risk_level: str  # low, medium, high
    warnings: List[str]
    recommendations: List[str]
    details: Dict[str, Any]
    created_at: datetime

class PortfolioRiskRequest(BaseModel):
    wallet_address: str
    include_defi_positions: bool = True

@router.post("/assess", response_model=RiskAssessmentResponse)
async def assess_risk(
    request: RiskAssessmentRequest,
    current_user: User = Depends(get_current_user)
):
    """Perform risk assessment based on type"""
    try:
        # Generate assessment ID
        import uuid
        assessment_id = str(uuid.uuid4())
        
        # Perform risk assessment based on type
        if request.type == "protocol":
            result = await _assess_protocol_risk(request.protocol or "")
        elif request.type == "token":
            result = await _assess_token_risk(request.address or "")
        elif request.type == "portfolio":
            result = await _assess_portfolio_risk(request.address or "")
        elif request.type == "transaction":
            result = await _assess_transaction_risk(request.protocol or "", request.amount or "0")
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid risk assessment type"
            )
        
        logger.info(
            "Risk assessment completed",
            user_id=current_user.id,
            assessment_id=assessment_id,
            type=request.type,
            risk_level=result["risk_level"]
        )
        
        return RiskAssessmentResponse(
            assessment_id=assessment_id,
            type=request.type,
            risk_score=RiskScore(**result["risk_score"]),
            risk_level=result["risk_level"],
            warnings=result["warnings"],
            recommendations=result["recommendations"],
            details=result["details"],
            created_at=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Risk assessment failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Risk assessment failed"
        )

@router.get("/portfolio/{wallet_address}")
async def get_portfolio_risk(
    wallet_address: str,
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive portfolio risk analysis"""
    try:
        # Mock portfolio data - in production, this would fetch real wallet data
        portfolio_data = {
            "wallet_address": wallet_address,
            "total_value_usd": 15750.50,
            "asset_breakdown": [
                {"token": "ETH", "amount": "5.2", "value_usd": 9620.0, "percentage": 61.1},
                {"token": "USDC", "amount": "3000", "value_usd": 3000.0, "percentage": 19.0},
                {"token": "AAVE", "amount": "25", "value_usd": 2250.0, "percentage": 14.3},
                {"token": "UNI", "amount": "150", "value_usd": 880.5, "percentage": 5.6}
            ],
            "defi_positions": [
                {
                    "protocol": "Uniswap V3",
                    "type": "liquidity_pool",
                    "pair": "ETH/USDC",
                    "value_usd": 5000.0,
                    "apy": 15.2,
                    "risk_level": "medium"
                },
                {
                    "protocol": "Aave",
                    "type": "lending",
                    "asset": "USDC",
                    "value_usd": 2000.0,
                    "apy": 3.5,
                    "risk_level": "low"
                }
            ]
        }
        
        # Calculate portfolio risk metrics
        risk_analysis = {
            "overall_risk_score": 35,  # 0-100
            "risk_level": "medium",
            "diversification_score": 72,
            "concentration_risk": "moderate",
            "defi_exposure": 44.4,  # percentage
            "volatility_score": 42,
            "liquidity_score": 85,
            "risk_factors": [
                {
                    "factor": "High ETH concentration",
                    "impact": "medium",
                    "description": "61% of portfolio in ETH increases volatility risk"
                },
                {
                    "factor": "DeFi protocol risk",
                    "impact": "medium", 
                    "description": "44% exposure to DeFi protocols adds smart contract risk"
                },
                {
                    "factor": "Good liquidity",
                    "impact": "positive",
                    "description": "Most assets are highly liquid"
                }
            ],
            "recommendations": [
                "Consider reducing ETH concentration below 50%",
                "Diversify into more stablecoins for lower volatility",
                "Monitor DeFi protocol health regularly",
                "Set up automated alerts for large price movements"
            ]
        }
        
        return {
            "portfolio": portfolio_data,
            "risk_analysis": risk_analysis,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("Portfolio risk analysis failed", wallet_address=wallet_address, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Portfolio risk analysis failed"
        )

@router.get("/alerts")
async def get_risk_alerts(
    current_user: User = Depends(get_current_user),
    active_only: bool = True
):
    """Get active risk alerts for user"""
    # Mock risk alerts - in production, this would come from real monitoring
    alerts = [
        {
            "id": "alert_001",
            "type": "high_gas",
            "severity": "warning",
            "title": "High Gas Fees Detected",
            "message": "Current gas fees are 25% above average. Consider waiting for lower fees.",
            "created_at": "2024-01-15T10:30:00Z",
            "is_active": True,
            "action_required": False
        },
        {
            "id": "alert_002", 
            "type": "protocol_risk",
            "severity": "info",
            "title": "Protocol Update Available",
            "message": "Uniswap V4 is now available with improved features and lower fees.",
            "created_at": "2024-01-14T15:20:00Z",
            "is_active": True,
            "action_required": False
        },
        {
            "id": "alert_003",
            "type": "liquidation_risk",
            "severity": "critical",
            "title": "Liquidation Risk Warning",
            "message": "Your Aave position is approaching liquidation threshold. Add collateral or repay debt.",
            "created_at": "2024-01-13T09:15:00Z",
            "is_active": False,
            "action_required": True
        }
    ]
    
    if active_only:
        alerts = [alert for alert in alerts if alert["is_active"]]
    
    return {
        "alerts": alerts,
        "total_active": len([a for a in alerts if a["is_active"]]),
        "critical_count": len([a for a in alerts if a["severity"] == "critical" and a["is_active"]])
    }

@router.get("/protocols")
async def get_protocol_risks():
    """Get risk assessments for major DeFi protocols"""
    protocols = [
        {
            "name": "Uniswap",
            "version": "V3",
            "risk_score": 25,
            "risk_level": "low",
            "tvl": "$4.2B",
            "audit_status": "audited",
            "last_audit": "2023-12-15",
            "risk_factors": {
                "smart_contract": 15,
                "liquidity": 10,
                "volatility": 30,
                "regulatory": 20,
                "team": 10
            }
        },
        {
            "name": "Aave",
            "version": "V3",
            "risk_score": 30,
            "risk_level": "low",
            "tvl": "$6.8B",
            "audit_status": "audited",
            "last_audit": "2023-11-20",
            "risk_factors": {
                "smart_contract": 20,
                "liquidity": 15,
                "volatility": 25,
                "regulatory": 25,
                "team": 15
            }
        },
        {
            "name": "Compound",
            "version": "V3",
            "risk_score": 35,
            "risk_level": "medium",
            "tvl": "$2.1B",
            "audit_status": "audited",
            "last_audit": "2023-10-10",
            "risk_factors": {
                "smart_contract": 25,
                "liquidity": 20,
                "volatility": 30,
                "regulatory": 30,
                "team": 20
            }
        }
    ]
    
    return {
        "protocols": protocols,
        "last_updated": datetime.utcnow().isoformat(),
        "methodology": "Risk scores based on smart contract audits, TVL, team reputation, and regulatory clarity"
    }

async def _assess_protocol_risk(protocol: str) -> Dict[str, Any]:
    """Assess risk for a specific protocol"""
    protocol_risks = {
        "uniswap": {
            "risk_score": {
                "overall": 25,
                "smart_contract": 15,
                "liquidity": 10,
                "volatility": 30,
                "regulatory": 20,
                "team": 10
            },
            "risk_level": "low",
            "warnings": [
                "Impermanent loss risk when providing liquidity",
                "Smart contract risk always present"
            ],
            "recommendations": [
                "Start with small amounts",
                "Understand impermanent loss",
                "Use stablecoin pairs for lower volatility"
            ],
            "details": {
                "tvl": "$4.2B",
                "audit_status": "Multiple audits completed",
                "last_audit": "2023-12-15",
                "governance": "Decentralized DAO"
            }
        },
        "aave": {
            "risk_score": {
                "overall": 30,
                "smart_contract": 20,
                "liquidity": 15,
                "volatility": 25,
                "regulatory": 25,
                "team": 15
            },
            "risk_level": "low",
            "warnings": [
                "Liquidation risk when borrowing",
                "Interest rate fluctuations"
            ],
            "recommendations": [
                "Maintain healthy collateralization ratio",
                "Monitor liquidation threshold",
                "Start with overcollateralized positions"
            ],
            "details": {
                "tvl": "$6.8B",
                "audit_status": "Continuously audited",
                "last_audit": "2023-11-20",
                "governance": "AAVE token holders"
            }
        }
    }
    
    return protocol_risks.get(protocol.lower(), {
        "risk_score": {
            "overall": 70,
            "smart_contract": 60,
            "liquidity": 50,
            "volatility": 70,
            "regulatory": 80,
            "team": 70
        },
        "risk_level": "high",
        "warnings": [
            "Unknown protocol - exercise extreme caution",
            "Limited audit information available"
        ],
        "recommendations": [
            "Research thoroughly before using",
            "Start with very small amounts",
            "Check for recent audits"
        ],
        "details": {
            "tvl": "Unknown",
            "audit_status": "Unknown",
            "last_audit": "Unknown",
            "governance": "Unknown"
        }
    })

async def _assess_token_risk(address: str) -> Dict[str, Any]:
    """Assess risk for a specific token"""
    return {
        "risk_score": {
            "overall": 45,
            "smart_contract": 40,
            "liquidity": 30,
            "volatility": 60,
            "regulatory": 40,
            "team": 50
        },
        "risk_level": "medium",
        "warnings": [
            "Check token contract for potential issues",
            "Verify token legitimacy"
        ],
        "recommendations": [
            "Research token thoroughly",
            "Check liquidity on DEXs",
            "Verify contract address"
        ],
        "details": {
            "contract_address": address,
            "total_supply": "Unknown",
            "holders": "Unknown",
            "liquidity_pools": "Unknown"
        }
    }

async def _assess_portfolio_risk(wallet_address: str) -> Dict[str, Any]:
    """Assess risk for a portfolio"""
    return {
        "risk_score": {
            "overall": 35,
            "smart_contract": 30,
            "liquidity": 20,
            "volatility": 45,
            "regulatory": 30,
            "team": 25
        },
        "risk_level": "medium",
        "warnings": [
            "High concentration in volatile assets",
            "Significant DeFi exposure"
        ],
        "recommendations": [
            "Diversify across asset classes",
            "Reduce concentration risk",
            "Monitor DeFi positions regularly"
        ],
        "details": {
            "wallet_address": wallet_address,
            "total_value": "Unknown",
            "asset_count": "Unknown",
            "defi_exposure": "Unknown"
        }
    }

async def _assess_transaction_risk(protocol: str, amount: str) -> Dict[str, Any]:
    """Assess risk for a specific transaction"""
    amount_num = float(amount) if amount else 0
    risk_level = "low"
    
    if amount_num > 10000:
        risk_level = "high"
    elif amount_num > 1000:
        risk_level = "medium"
    
    return {
        "risk_score": {
            "overall": 25 if risk_level == "low" else 50 if risk_level == "medium" else 75,
            "smart_contract": 20,
            "liquidity": 15,
            "volatility": 30,
            "regulatory": 20,
            "team": 15
        },
        "risk_level": risk_level,
        "warnings": [
            "Verify all transaction parameters",
            "Check gas fees before confirming"
        ],
        "recommendations": [
            "Start with smaller amounts",
            "Simulate transaction first",
            "Keep some ETH for gas"
        ],
        "details": {
            "protocol": protocol,
            "amount": amount,
            "estimated_gas": "150000",
            "network": "ethereum"
        }
    }
