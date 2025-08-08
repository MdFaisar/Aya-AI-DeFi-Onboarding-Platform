import redis.asyncio as redis
from typing import Optional, Any
import json
import structlog
from app.core.config import settings

logger = structlog.get_logger()

class RedisClient:
    """Redis client wrapper with async support"""
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self.connected = False
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=5,
                socket_keepalive=True,
                socket_keepalive_options={},
                health_check_interval=30,
            )

            # Test connection
            await self.redis.ping()
            self.connected = True
            logger.info("Redis connection established")

        except Exception as e:
            logger.warning("Failed to connect to Redis", error=str(e))
            self.connected = False
            # Don't raise - allow app to continue without Redis
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()
            self.connected = False
            logger.info("Redis connection closed")
    
    async def get(self, key: str) -> Optional[str]:
        """Get value by key"""
        if not self.connected or not self.redis:
            return None
        
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.error("Redis GET error", key=key, error=str(e))
            return None
    
    async def set(
        self, 
        key: str, 
        value: str, 
        ex: Optional[int] = None
    ) -> bool:
        """Set key-value pair with optional expiration"""
        if not self.connected or not self.redis:
            return False
        
        try:
            await self.redis.set(key, value, ex=ex)
            return True
        except Exception as e:
            logger.error("Redis SET error", key=key, error=str(e))
            return False
    
    async def setex(self, key: str, time: int, value: str) -> bool:
        """Set key-value pair with expiration time"""
        return await self.set(key, value, ex=time)
    
    async def delete(self, key: str) -> bool:
        """Delete key"""
        if not self.connected or not self.redis:
            return False
        
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error("Redis DELETE error", key=key, error=str(e))
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.connected or not self.redis:
            return False
        
        try:
            result = await self.redis.exists(key)
            return bool(result)
        except Exception as e:
            logger.error("Redis EXISTS error", key=key, error=str(e))
            return False
    
    async def ping(self) -> bool:
        """Ping Redis server"""
        if not self.redis:
            return False
        
        try:
            await self.redis.ping()
            return True
        except Exception as e:
            logger.error("Redis PING error", error=str(e))
            return False
    
    async def close(self):
        """Close Redis connection"""
        await self.disconnect()
    
    # JSON helpers
    async def get_json(self, key: str) -> Optional[Any]:
        """Get JSON value by key"""
        value = await self.get(key)
        if value is None:
            return None
        
        try:
            return json.loads(value)
        except json.JSONDecodeError as e:
            logger.error("JSON decode error", key=key, error=str(e))
            return None
    
    async def set_json(
        self, 
        key: str, 
        value: Any, 
        ex: Optional[int] = None
    ) -> bool:
        """Set JSON value with optional expiration"""
        try:
            json_value = json.dumps(value)
            return await self.set(key, json_value, ex=ex)
        except (TypeError, ValueError) as e:
            logger.error("JSON encode error", key=key, error=str(e))
            return False
    
    # Cache helpers
    async def cache_get(self, key: str) -> Optional[Any]:
        """Get cached value (JSON)"""
        return await self.get_json(f"cache:{key}")
    
    async def cache_set(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[int] = None
    ) -> bool:
        """Set cached value (JSON) with TTL"""
        cache_ttl = ttl or settings.REDIS_CACHE_TTL
        return await self.set_json(f"cache:{key}", value, ex=cache_ttl)
    
    async def cache_delete(self, key: str) -> bool:
        """Delete cached value"""
        return await self.delete(f"cache:{key}")
    
    # Rate limiting helpers
    async def rate_limit_check(
        self, 
        key: str, 
        limit: int, 
        window: int
    ) -> tuple[bool, int]:
        """
        Check rate limit for a key
        Returns (allowed, remaining_requests)
        """
        if not self.connected or not self.redis:
            return True, limit
        
        try:
            current = await self.redis.get(f"rate_limit:{key}")
            if current is None:
                await self.redis.setex(f"rate_limit:{key}", window, 1)
                return True, limit - 1
            
            current_count = int(current)
            if current_count >= limit:
                return False, 0
            
            await self.redis.incr(f"rate_limit:{key}")
            return True, limit - current_count - 1
            
        except Exception as e:
            logger.error("Rate limit check error", key=key, error=str(e))
            return True, limit  # Allow on error
    
    # Session helpers
    async def set_session(
        self, 
        session_id: str, 
        data: dict, 
        ttl: int = 3600
    ) -> bool:
        """Set session data"""
        return await self.set_json(f"session:{session_id}", data, ex=ttl)
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        """Get session data"""
        return await self.get_json(f"session:{session_id}")
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        return await self.delete(f"session:{session_id}")

# Create global Redis client instance
redis_client = RedisClient()

# Initialize connection on import
async def init_redis():
    """Initialize Redis connection"""
    await redis_client.connect()

# Cleanup function
async def cleanup_redis():
    """Cleanup Redis connection"""
    await redis_client.close()
