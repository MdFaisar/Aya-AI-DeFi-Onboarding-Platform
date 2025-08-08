from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
import structlog

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.core.deps import get_current_user

logger = structlog.get_logger()
security = HTTPBearer()

router = APIRouter()

# Request/Response models
class WalletAuthRequest(BaseModel):
    wallet_address: str
    signature: str
    message: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: int
    wallet_address: str
    username: str | None
    experience_level: str
    current_level: str
    overall_progress_percentage: float
    is_verified: bool
    is_premium: bool
    created_at: datetime

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@router.post("/login", response_model=AuthResponse)
async def login_with_wallet(
    auth_request: WalletAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user with wallet signature
    """
    try:
        # In a real implementation, you would verify the signature here
        # For demo purposes, we'll skip signature verification
        wallet_address = auth_request.wallet_address.lower()
        
        # Get or create user
        user = db.query(User).filter(User.wallet_address == wallet_address).first()
        
        if not user:
            # Create new user
            user = User(
                wallet_address=wallet_address,
                experience_level="beginner",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("New user created", wallet_address=wallet_address)
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.wallet_address},
            expires_delta=access_token_expires
        )
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "wallet_address": user.wallet_address,
                "username": user.username,
                "experience_level": user.experience_level,
                "current_level": user.current_level,
                "overall_progress_percentage": user.overall_progress_percentage,
                "is_verified": user.is_verified,
                "is_premium": user.is_premium
            }
        )
        
    except Exception as e:
        logger.error("Login failed", wallet_address=auth_request.wallet_address, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication failed"
        )

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout user (in a real implementation, you might invalidate the token)
    """
    logger.info("User logged out", user_id=current_user.id)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user information
    """
    return UserResponse(
        id=current_user.id,
        wallet_address=current_user.wallet_address,
        username=current_user.username,
        experience_level=current_user.experience_level,
        current_level=current_user.current_level,
        overall_progress_percentage=current_user.overall_progress_percentage,
        is_verified=current_user.is_verified,
        is_premium=current_user.is_premium,
        created_at=current_user.created_at
    )

@router.post("/verify-signature")
async def verify_wallet_signature(
    wallet_address: str,
    signature: str,
    message: str
):
    """
    Verify wallet signature (placeholder implementation)
    In production, this would use eth_account or similar library
    """
    # Placeholder verification
    # In real implementation:
    # from eth_account.messages import encode_defunct
    # from eth_account import Account
    # 
    # message_hash = encode_defunct(text=message)
    # recovered_address = Account.recover_message(message_hash, signature=signature)
    # return recovered_address.lower() == wallet_address.lower()
    
    return {
        "valid": True,
        "message": "Signature verification successful (demo mode)"
    }

@router.get("/nonce/{wallet_address}")
async def get_auth_nonce(wallet_address: str):
    """
    Get authentication nonce for wallet signature
    """
    # Generate a unique nonce for the wallet
    import secrets
    nonce = secrets.token_hex(16)
    
    # In production, store this nonce temporarily (Redis) and verify it during login
    message = f"Sign this message to authenticate with Aya DeFi Navigator.\n\nNonce: {nonce}\nTimestamp: {datetime.utcnow().isoformat()}"
    
    return {
        "nonce": nonce,
        "message": message
    }
