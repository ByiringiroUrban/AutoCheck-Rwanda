import pytest
from app.utils.normalizers import (
    normalize_vin,
    validate_vin,
    normalize_plate_number,
)


def test_vin_normalization():
    # Whitespace and lowercase
    assert normalize_vin("  1hgcr2f83ha123456  ") == "1HGCR2F83HA123456"
    # Hyphens stripped
    assert normalize_vin("1HG-CR2F83-HA123456") == "1HGCR2F83HA123456"
    assert normalize_vin(None) is None
    assert normalize_vin("") is None


def test_vin_validation():
    # Valid 17-char standard VIN
    valid, err = validate_vin("1HGCR2F83HA123456")
    assert valid is True
    assert err is None

    # Invalid: contains forbidden letter 'I'
    valid, err = validate_vin("1HGCR2F83IA123456")
    assert valid is False
    assert "cannot contain invalid characters" in err

    # Invalid: contains forbidden letter 'O'
    valid, err = validate_vin("1HGCR2F83OA123456")
    assert valid is False

    # Invalid: contains forbidden letter 'Q'
    valid, err = validate_vin("1HGCR2F83QA123456")
    assert valid is False

    # Invalid: too short
    valid, err = validate_vin("1HGCR2F83")
    assert valid is False
    assert "must be exactly 17 characters long" in err


def test_rwanda_plate_normalization():
    # Standard Rwanda format: 3 letters + 3 digits + 1 letter
    assert normalize_plate_number("raa 123 a") == "RAA 123 A"
    assert normalize_plate_number("RAC456B") == "RAC 456 B"
    assert normalize_plate_number("  rad 789 c  ") == "RAD 789 C"

    # Temporary transit (IT)
    assert normalize_plate_number("it 1234") == "IT 1234"
    assert normalize_plate_number("IT567") == "IT 567"

    # Government plates (GR)
    assert normalize_plate_number("gr 123 a") == "GR 123 A"
    assert normalize_plate_number("GR456") == "GR 456"

    # Diplomatic plates (CD)
    assert normalize_plate_number("cd 12 a") == "CD 12 A"

    # None or empty
    assert normalize_plate_number(None) is None
    assert normalize_plate_number("") is None
