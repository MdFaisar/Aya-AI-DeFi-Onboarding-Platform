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

# Response models
class ProtocolInfo(BaseModel):
    name: str
    display_name: str
    description: str
    category: str
    tvl: str
    apy_range: str
    risk_level: str
    audit_status: str
    supported_networks: List[str]
    features: List[str]

class ProtocolMetrics(BaseModel):
    tvl: str
    volume_24h: str
    fees_24h: str
    users_24h: int
    apy: str
    utilization_rate: str
    last_updated: datetime

@router.get("/")
async def get_protocols(
    category: Optional[str] = None,
    network: Optional[str] = None,
    risk_level: Optional[str] = None
):
    """Get list of supported DeFi protocols with filtering"""
    
    # Mock protocol data - in production, this would come from database/APIs
    protocols = [
        {
            "name": "uniswap",
            "display_name": "Uniswap V3",
            "description": "Leading decentralized exchange with concentrated liquidity",
            "category": "dex",
            "tvl": "$4.2B",
            "apy_range": "5-25%",
            "risk_level": "low",
            "audit_status": "audited",
            "supported_networks": ["ethereum", "polygon", "arbitrum"],
            "features": ["token_swaps", "liquidity_provision", "yield_farming"],
            "logo_url": "https://uniswap.org/logo.png",
            "website": "https://uniswap.org",
            "documentation": "https://docs.uniswap.org"
        },
        {
            "name": "aave",
            "display_name": "Aave V3",
            "description": "Decentralized lending and borrowing protocol",
            "category": "lending",
            "tvl": "$6.8B",
            "apy_range": "2-8%",
            "risk_level": "low",
            "audit_status": "audited",
            "supported_networks": ["ethereum", "polygon", "avalanche"],
            "features": ["lending", "borrowing", "flash_loans"],
            "logo_url": "https://aave.com/logo.png",
            "website": "https://aave.com",
            "documentation": "https://docs.aave.com"
        },
        {
            "name": "compound",
            "display_name": "Compound V3",
            "description": "Algorithmic money market protocol",
            "category": "lending",
            "tvl": "$2.1B",
            "apy_range": "1-6%",
            "risk_level": "medium",
            "audit_status": "audited",
            "supported_networks": ["ethereum", "polygon"],
            "features": ["lending", "borrowing", "governance"],
            "logo_url": "https://compound.finance/logo.png",
            "website": "https://compound.finance",
            "documentation": "https://docs.compound.finance"
        },
        {
            "name": "curve",
            "display_name": "Curve Finance",
            "description": "Decentralized exchange for stablecoins and similar assets",
            "category": "dex",
            "tvl": "$3.5B",
            "apy_range": "3-15%",
            "risk_level": "medium",
            "audit_status": "audited",
            "supported_networks": ["ethereum", "polygon", "arbitrum"],
            "features": ["stable_swaps", "liquidity_provision", "yield_farming"],
            "logo_url": "https://curve.fi/logo.png",
            "website": "https://curve.fi",
            "documentation": "https://docs.curve.fi"
        },
        {
            "name": "lido",
            "display_name": "Lido",
            "description": "Liquid staking protocol for Ethereum 2.0",
            "category": "staking",
            "tvl": "$14.1B",
            "apy_range": "4-6%",
            "risk_level": "low",
            "audit_status": "audited",
            "supported_networks": ["ethereum"],
            "features": ["liquid_staking", "steth_tokens"],
            "logo_url": "https://lido.fi/logo.png",
            "website": "https://lido.fi",
            "documentation": "https://docs.lido.fi"
        },
        {
            "name": "makerdao",
            "display_name": "MakerDAO",
            "description": "Decentralized credit platform and DAI stablecoin issuer",
            "category": "stablecoin",
            "tvl": "$5.2B",
            "apy_range": "1-4%",
            "risk_level": "low",
            "audit_status": "audited",
            "supported_networks": ["ethereum"],
            "features": ["dai_minting", "collateral_vaults", "governance"],
            "logo_url": "https://makerdao.com/logo.png",
            "website": "https://makerdao.com",
            "documentation": "https://docs.makerdao.com"
        }
    ]
    
    # Apply filters
    filtered_protocols = protocols
    
    if category:
        filtered_protocols = [p for p in filtered_protocols if p["category"] == category]
    
    if network:
        filtered_protocols = [p for p in filtered_protocols if network in p["supported_networks"]]
    
    if risk_level:
        filtered_protocols = [p for p in filtered_protocols if p["risk_level"] == risk_level]
    
    return {
        "protocols": filtered_protocols,
        "total_count": len(filtered_protocols),
        "categories": list(set(p["category"] for p in protocols)),
        "networks": list(set(network for p in protocols for network in p["supported_networks"])),
        "risk_levels": list(set(p["risk_level"] for p in protocols))
    }

@router.get("/{protocol_name}")
async def get_protocol_details(
    protocol_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed information about a specific protocol"""
    
    # Mock detailed protocol data
    protocol_details = {
        "uniswap": {
            "basic_info": {
                "name": "uniswap",
                "display_name": "Uniswap V3",
                "description": "Uniswap is a decentralized exchange protocol that allows users to swap ERC-20 tokens and provide liquidity to earn fees.",
                "category": "dex",
                "founded": "2018",
                "team_size": "50+",
                "headquarters": "New York, USA"
            },
            "metrics": {
                "tvl": "$4.2B",
                "volume_24h": "$1.2B",
                "fees_24h": "$3.6M",
                "users_24h": 45000,
                "apy": "15.2%",
                "utilization_rate": "68%",
                "last_updated": datetime.utcnow()
            },
            "features": {
                "core_features": [
                    "Automated Market Maker (AMM)",
                    "Concentrated Liquidity",
                    "Multiple Fee Tiers",
                    "Flash Swaps",
                    "Governance Token (UNI)"
                ],
                "supported_tokens": "500+",
                "supported_networks": ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
                "unique_features": [
                    "Concentrated liquidity positions",
                    "Multiple fee tiers (0.05%, 0.3%, 1%)",
                    "Non-fungible liquidity positions"
                ]
            },
            "security": {
                "audit_firms": ["Trail of Bits", "ConsenSys Diligence", "ABDK"],
                "last_audit": "2023-12-15",
                "bug_bounty": "$2M maximum",
                "insurance_coverage": "Partial",
                "governance": "UNI token holders",
                "multisig_threshold": "4/7"
            },
            "risks": {
                "smart_contract_risk": "Low",
                "liquidity_risk": "Low", 
                "regulatory_risk": "Medium",
                "impermanent_loss": "Medium to High",
                "key_risks": [
                    "Impermanent loss for liquidity providers",
                    "Smart contract vulnerabilities",
                    "Regulatory uncertainty",
                    "MEV extraction"
                ]
            },
            "how_to_use": {
                "getting_started": [
                    "Connect your wallet to Uniswap interface",
                    "Ensure you have ETH for gas fees",
                    "Select tokens to swap",
                    "Set slippage tolerance",
                    "Confirm transaction"
                ],
                "providing_liquidity": [
                    "Choose a token pair",
                    "Select fee tier",
                    "Set price range for concentrated liquidity",
                    "Deposit tokens",
                    "Confirm liquidity provision"
                ],
                "best_practices": [
                    "Start with small amounts",
                    "Understand impermanent loss",
                    "Monitor gas fees",
                    "Use appropriate slippage settings"
                ]
            }
        },
        "aave": {
            "basic_info": {
                "name": "aave",
                "display_name": "Aave V3",
                "description": "Aave is a decentralized lending protocol where users can lend and borrow cryptocurrencies.",
                "category": "lending",
                "founded": "2017",
                "team_size": "100+",
                "headquarters": "London, UK"
            },
            "metrics": {
                "tvl": "$6.8B",
                "volume_24h": "$450M",
                "fees_24h": "$1.2M",
                "users_24h": 12000,
                "apy": "3.5%",
                "utilization_rate": "75%",
                "last_updated": datetime.utcnow()
            },
            "features": {
                "core_features": [
                    "Lending and Borrowing",
                    "Flash Loans",
                    "Rate Switching",
                    "Collateral Management",
                    "Governance (AAVE)"
                ],
                "supported_tokens": "30+",
                "supported_networks": ["Ethereum", "Polygon", "Avalanche"],
                "unique_features": [
                    "Flash loans without collateral",
                    "Stable and variable interest rates",
                    "aTokens representing deposits"
                ]
            },
            "security": {
                "audit_firms": ["OpenZeppelin", "Consensys", "Certora"],
                "last_audit": "2023-11-20",
                "bug_bounty": "$1M maximum",
                "insurance_coverage": "Yes",
                "governance": "AAVE token holders",
                "multisig_threshold": "5/10"
            },
            "risks": {
                "smart_contract_risk": "Low",
                "liquidity_risk": "Medium",
                "regulatory_risk": "Medium",
                "liquidation_risk": "High",
                "key_risks": [
                    "Liquidation risk for borrowers",
                    "Interest rate volatility",
                    "Smart contract bugs",
                    "Regulatory changes"
                ]
            },
            "how_to_use": {
                "lending": [
                    "Connect wallet to Aave",
                    "Select asset to lend",
                    "Approve token spending",
                    "Deposit tokens",
                    "Receive aTokens and start earning"
                ],
                "borrowing": [
                    "Deposit collateral",
                    "Select asset to borrow",
                    "Choose interest rate type",
                    "Confirm borrowing",
                    "Monitor health factor"
                ],
                "best_practices": [
                    "Maintain healthy collateral ratio",
                    "Monitor liquidation threshold",
                    "Understand interest rate models",
                    "Use flash loans carefully"
                ]
            }
        }
    }
    
    protocol_data = protocol_details.get(protocol_name.lower())
    if not protocol_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Protocol not found"
        )
    
    return protocol_data

@router.get("/{protocol_name}/metrics")
async def get_protocol_metrics(
    protocol_name: str,
    timeframe: str = "24h"  # 24h, 7d, 30d
):
    """Get real-time metrics for a specific protocol"""
    
    # Mock metrics data - in production, this would fetch from DeFi APIs
    metrics_data = {
        "uniswap": {
            "current": {
                "tvl": "$4.2B",
                "volume_24h": "$1.2B",
                "fees_24h": "$3.6M",
                "users_24h": 45000,
                "transactions_24h": 125000,
                "average_apy": "15.2%"
            },
            "historical": {
                "tvl_7d": ["$4.0B", "$4.1B", "$4.0B", "$4.2B", "$4.1B", "$4.3B", "$4.2B"],
                "volume_7d": ["$1.1B", "$1.3B", "$1.0B", "$1.2B", "$1.4B", "$1.1B", "$1.2B"],
                "fees_7d": ["$3.3M", "$3.9M", "$3.0M", "$3.6M", "$4.2M", "$3.3M", "$3.6M"]
            },
            "top_pools": [
                {"pair": "ETH/USDC", "tvl": "$450M", "volume_24h": "$180M", "apy": "12.5%"},
                {"pair": "USDC/USDT", "tvl": "$320M", "volume_24h": "$95M", "apy": "8.2%"},
                {"pair": "ETH/WBTC", "tvl": "$280M", "volume_24h": "$75M", "apy": "18.7%"}
            ]
        },
        "aave": {
            "current": {
                "tvl": "$6.8B",
                "volume_24h": "$450M",
                "fees_24h": "$1.2M",
                "users_24h": 12000,
                "transactions_24h": 35000,
                "average_apy": "3.5%"
            },
            "historical": {
                "tvl_7d": ["$6.5B", "$6.7B", "$6.6B", "$6.8B", "$6.9B", "$6.7B", "$6.8B"],
                "volume_7d": ["$420M", "$480M", "$390M", "$450M", "$510M", "$430M", "$450M"],
                "fees_7d": ["$1.1M", "$1.3M", "$1.0M", "$1.2M", "$1.4M", "$1.1M", "$1.2M"]
            },
            "top_markets": [
                {"asset": "USDC", "supply_apy": "3.2%", "borrow_apy": "4.8%", "utilization": "68%"},
                {"asset": "ETH", "supply_apy": "2.1%", "borrow_apy": "3.5%", "utilization": "45%"},
                {"asset": "WBTC", "supply_apy": "1.8%", "borrow_apy": "3.2%", "utilization": "52%"}
            ]
        }
    }
    
    protocol_metrics = metrics_data.get(protocol_name.lower())
    if not protocol_metrics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Protocol metrics not found"
        )
    
    return {
        "protocol": protocol_name,
        "timeframe": timeframe,
        "metrics": protocol_metrics,
        "last_updated": datetime.utcnow().isoformat()
    }

@router.get("/{protocol_name}/tutorials")
async def get_protocol_tutorials(
    protocol_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get tutorials and guides for a specific protocol"""
    
    tutorials = {
        "uniswap": [
            {
                "id": "uniswap-basics",
                "title": "Uniswap Basics: Your First Token Swap",
                "description": "Learn how to swap tokens on Uniswap safely",
                "difficulty": "beginner",
                "duration": "15 minutes",
                "type": "interactive",
                "completed": False
            },
            {
                "id": "uniswap-liquidity",
                "title": "Providing Liquidity on Uniswap V3",
                "description": "Understand concentrated liquidity and earn fees",
                "difficulty": "intermediate",
                "duration": "25 minutes",
                "type": "guided",
                "completed": False
            },
            {
                "id": "uniswap-advanced",
                "title": "Advanced Uniswap Strategies",
                "description": "Learn about MEV, arbitrage, and optimization",
                "difficulty": "advanced",
                "duration": "40 minutes",
                "type": "theory",
                "completed": False
            }
        ],
        "aave": [
            {
                "id": "aave-lending",
                "title": "Lending on Aave: Earn Interest",
                "description": "Start earning interest by lending your crypto",
                "difficulty": "beginner",
                "duration": "20 minutes",
                "type": "interactive",
                "completed": False
            },
            {
                "id": "aave-borrowing",
                "title": "Safe Borrowing on Aave",
                "description": "Learn to borrow without getting liquidated",
                "difficulty": "intermediate",
                "duration": "30 minutes",
                "type": "guided",
                "completed": False
            },
            {
                "id": "aave-flash-loans",
                "title": "Understanding Flash Loans",
                "description": "Advanced concept: borrowing without collateral",
                "difficulty": "advanced",
                "duration": "35 minutes",
                "type": "theory",
                "completed": False
            }
        ]
    }
    
    protocol_tutorials = tutorials.get(protocol_name.lower(), [])
    
    return {
        "protocol": protocol_name,
        "tutorials": protocol_tutorials,
        "total_tutorials": len(protocol_tutorials),
        "difficulty_distribution": {
            "beginner": len([t for t in protocol_tutorials if t["difficulty"] == "beginner"]),
            "intermediate": len([t for t in protocol_tutorials if t["difficulty"] == "intermediate"]),
            "advanced": len([t for t in protocol_tutorials if t["difficulty"] == "advanced"])
        }
    }

@router.get("/categories/overview")
async def get_protocol_categories():
    """Get overview of all protocol categories"""
    
    categories = {
        "dex": {
            "name": "Decentralized Exchanges",
            "description": "Protocols for trading tokens without intermediaries",
            "protocol_count": 2,
            "total_tvl": "$7.7B",
            "examples": ["Uniswap", "Curve", "SushiSwap"]
        },
        "lending": {
            "name": "Lending & Borrowing",
            "description": "Protocols for lending and borrowing cryptocurrencies",
            "protocol_count": 2,
            "total_tvl": "$8.9B",
            "examples": ["Aave", "Compound", "Euler"]
        },
        "staking": {
            "name": "Staking",
            "description": "Protocols for staking tokens to earn rewards",
            "protocol_count": 1,
            "total_tvl": "$14.1B",
            "examples": ["Lido", "Rocket Pool", "Frax"]
        },
        "stablecoin": {
            "name": "Stablecoins",
            "description": "Protocols for creating and managing stablecoins",
            "protocol_count": 1,
            "total_tvl": "$5.2B",
            "examples": ["MakerDAO", "Frax", "Liquity"]
        },
        "derivatives": {
            "name": "Derivatives",
            "description": "Protocols for trading derivatives and synthetic assets",
            "protocol_count": 0,
            "total_tvl": "$0",
            "examples": ["Synthetix", "dYdX", "GMX"]
        }
    }
    
    return {
        "categories": categories,
        "total_protocols": sum(cat["protocol_count"] for cat in categories.values()),
        "total_tvl": "$35.9B",
        "most_popular": "lending",
        "fastest_growing": "staking"
    }
