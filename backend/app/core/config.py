from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Aya DeFi Navigator"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://aya_user:aya_password@localhost:5432/aya_defi_navigator"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_CACHE_TTL: int = 3600  # 1 hour
    
    # External APIs
    GROQ_API_KEY: Optional[str] = None
    ALCHEMY_API_KEY: Optional[str] = None
    COINGECKO_API_KEY: Optional[str] = None
    DEFILLAMA_API_URL: str = "https://api.llama.fi"
    
    # Blockchain
    ETHEREUM_RPC_URL: str = "https://eth-mainnet.alchemyapi.io/v2/demo"
    SEPOLIA_RPC_URL: str = "https://eth-sepolia.g.alchemy.com/v2/demo"
    
    # AI/ML
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.7
    MODEL_NAME: str = "llama-3.1-70b-versatile"
    
    # Risk Assessment
    RISK_CACHE_TTL: int = 300  # 5 minutes
    MAX_RISK_SCORE: int = 100
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 10
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "application/pdf"]
    
    # Email (for notifications)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    # Security
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://localhost:3000"]
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Override with environment variables if they exist
        if os.getenv("DATABASE_URL"):
            self.DATABASE_URL = os.getenv("DATABASE_URL")
        if os.getenv("REDIS_URL"):
            self.REDIS_URL = os.getenv("REDIS_URL")
        if os.getenv("GROQ_API_KEY"):
            self.GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        if os.getenv("ENVIRONMENT"):
            self.ENVIRONMENT = os.getenv("ENVIRONMENT")
            self.DEBUG = self.ENVIRONMENT == "development"

# Create settings instance
settings = Settings()

# Validation
if not settings.GROQ_API_KEY and settings.ENVIRONMENT == "production":
    raise ValueError("GROQ_API_KEY is required in production")

if settings.ENVIRONMENT == "production":
    settings.ALLOWED_HOSTS = [
        "api.ayadefi.com",
        "localhost",
        "127.0.0.1"
    ]
    settings.DEBUG = False
