from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    require_min_role,
    check_roles,
)


def test_password_hashing():
    plain = "SecurePass123!"
    hashed = get_password_hash(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_access_and_refresh_tokens():
    user_id = "test-user-12345"
    token = create_access_token(
        subject=user_id,
        role="GARAGE_STAFF",
        email="mechanic@garage.rw",
        first_name="Eric",
        last_name="Habimana",
    )
    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["role"] == "GARAGE_STAFF"
    assert payload["email"] == "mechanic@garage.rw"
    assert payload["type"] == "access"

    refresh = create_refresh_token(subject=user_id)
    refresh_payload = decode_token(refresh)
    assert refresh_payload["sub"] == user_id
    assert refresh_payload["type"] == "refresh"


def test_rbac_role_hierarchy():
    # SUPER_ADMIN >= ADMIN >= GARAGE_MANAGER >= GARAGE_STAFF / DEALER >= OWNER >= PUBLIC
    assert require_min_role("SUPER_ADMIN", "ADMIN") is True
    assert require_min_role("ADMIN", "GARAGE_MANAGER") is True
    assert require_min_role("GARAGE_MANAGER", "GARAGE_STAFF") is True
    assert require_min_role("OWNER", "ADMIN") is False
    assert require_min_role("PUBLIC", "OWNER") is False

    # check_roles
    assert check_roles("GARAGE_STAFF", ["GARAGE_STAFF", "GARAGE_MANAGER"]) is True
    assert check_roles("OWNER", ["GARAGE_STAFF", "GARAGE_MANAGER"]) is False
