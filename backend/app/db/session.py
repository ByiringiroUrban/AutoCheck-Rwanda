import asyncio
import logging
from typing import Optional
from prisma import Prisma
from app.core.config import settings

logger = logging.getLogger(__name__)

# Global Prisma Client instance
# Prisma's engine reads DATABASE_URL from the process environment, while the
# application settings may have loaded it from .env. Pass it explicitly so both
# local and deployed runtimes use the same configured database.
db = Prisma(datasource={"url": settings.DATABASE_URL}, auto_register=True)
_connection_attempted = False


def _database_disabled() -> bool:
    return "ep-sample-123456" in settings.DATABASE_URL or settings.ENVIRONMENT == "test"


async def connect_db() -> Prisma:
    """Connects to the Neon PostgreSQL database via Prisma with timeout safety."""
    global _connection_attempted
    if db.is_connected() or _connection_attempted:
        return db
    if _database_disabled():
        logger.info("Using placeholder or test configuration; database connection skipped.")
        _connection_attempted = True
        return db

    try:
        logger.info("Connecting to Neon PostgreSQL...")
        await asyncio.wait_for(db.connect(), timeout=20.0)
        _connection_attempted = True
        logger.info("Successfully connected to Neon PostgreSQL.")
    except asyncio.TimeoutError:
        logger.warning("Database connection timed out. Will retry on the next request.")
    except Exception as e:
        logger.warning(f"Failed to connect to primary database ({e}). Will retry on the next request.")
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
    if not db.is_connected():
        await connect_db()
    return db

