import redis.asyncio as redis
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class MockRedis:
    """A simple mock Redis client to prevent the app from crashing when Redis is unavailable."""
    async def ping(self):
        return True
    
    async def close(self):
        pass
    
    async def get(self, name):
        return None
    
    async def set(self, name, value, ex=None):
        return True
    
    async def delete(self, *names):
        return 0
    
    async def exists(self, *names):
        return 0

class RedisManager:
    client = None

redis_db = RedisManager()

async def init_redis():
    try:
        # Connection pool is created automatically by redis-py when using from_url or Redis()
        redis_db.client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=10
        )
        # Verify connection
        await redis_db.client.ping()
        logger.info("Successfully connected to Redis.")
    except Exception as e:
        logger.error(f"Could not connect to Redis: {e}. Falling back to MockRedis.")
        # Fallback to MockRedis so the application can still start
        redis_db.client = MockRedis()

async def close_redis_connection():
    if redis_db.client:
        await redis_db.client.close()
        logger.info("Redis connection closed.")

def get_redis():
    return redis_db.client
