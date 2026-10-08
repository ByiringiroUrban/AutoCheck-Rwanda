from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union, Dict, List
import bcrypt
from jose import jwt, JWTError
from app.core.config import settings
from app.utils.exceptions import UnauthorizedException, ForbiddenException


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against hashed password."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Hashes a password with bcrypt salt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")



def create_access_token(
    subject: Union[str, Any],
    role: str,
    email: str,
    first_name: str,
    last_name: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Creates a signed JWT access token."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "role": role,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Creates a signed JWT refresh token."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        raise UnauthorizedException(f"Invalid or expired token: {str(e)}")


def create_password_reset_token(
    user_id: str,
    email: str,
    password_hash: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Creates a signed JWT password reset token with fingerprinting."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    
    # Hash fingerprint prevents token replay after password was already updated
    fingerprint = password_hash[-12:] if len(password_hash) >= 12 else password_hash
    
    to_encode: Dict[str, Any] = {
        "sub": str(user_id),
        "email": email.lower(),
        "type": "password_reset",
        "fp": fingerprint,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_password_reset_token(token: str) -> Dict[str, Any]:
    """Decodes and validates a password reset token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "password_reset":
            raise UnauthorizedException("Invalid token purpose; expected password reset token")
        return payload
    except JWTError as e:
        raise UnauthorizedException(f"Invalid or expired password reset token: {str(e)}")


ROLE_HIERARCHY: Dict[str, int] = {
    "PUBLIC": 0,
    "OWNER": 10,
    "GARAGE_STAFF": 20,
    "DEALER": 20,
    "GARAGE_MANAGER": 30,
    "ADMIN": 50,
    "SUPER_ADMIN": 100,
}


def require_min_role(user_role: str, min_role: str) -> bool:
    """Checks whether the user's role satisfies the minimum required role level."""
    user_level = ROLE_HIERARCHY.get(user_role.upper(), 0)
    required_level = ROLE_HIERARCHY.get(min_role.upper(), 0)
    return user_level >= required_level


def check_roles(user_role: str, allowed_roles: List[str]) -> bool:
    """Checks if the user role is in the list of allowed roles."""
    return user_role.upper() in [r.upper() for r in allowed_roles]
