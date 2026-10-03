import asyncio
import logging
from typing import Optional
from prisma import Prisma
from app.core.config import settings

logger = logging.getLogger(__name__)

# Global Prisma Client instance
db = Prisma(auto_register=True)
_connection_attempted = False


async def connect_db() -> Prisma:
    """Connects to the Neon PostgreSQL database via Prisma with timeout safety."""
    global _connection_attempted
    if not db.is_connected() and not _connection_attempted:
        _connection_attempted = True
        # Check if placeholder URL
        if "ep-sample-123456" in settings.DATABASE_URL or settings.ENVIRONMENT == "test":
            logger.info("Using placeholder or test configuration; database connection skipped.")
            return db

        try:
            logger.info("Connecting to Neon PostgreSQL...")
            await asyncio.wait_for(db.connect(), timeout=20.0)
            logger.info("Successfully connected to Neon PostgreSQL.")
        except asyncio.TimeoutError:
            logger.warning("Database connection timed out. Operating in standalone mode.")
        except Exception as e:
            logger.warning(f"Failed to connect to primary database ({e}). Operating in standalone mode.")
    return db



async def disconnect_db() -> None:
    """Disconnects from the database on app shutdown."""
    global _connection_attempted
    if db.is_connected():
        logger.info("Disconnecting from Neon PostgreSQL...")
        await db.disconnect()
        logger.info("Database connection closed.")
    _connection_attempted = False


async def get_db() -> Prisma:
    """Dependency provider for FastAPI route endpoints."""
    if not db.is_connected() and not _connection_attempted:
        await connect_db()
    return db

