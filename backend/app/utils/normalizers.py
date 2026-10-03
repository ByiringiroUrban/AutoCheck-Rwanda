import re
from typing import Optional, Tuple


def normalize_vin(vin: Optional[str]) -> Optional[str]:
    """
    Normalizes VIN string by stripping whitespace and converting to uppercase.
    Removes invalid separation characters (spaces, hyphens).
    """
    if not vin:
        return None
    cleaned = re.sub(r"[\s\-]", "", vin).strip().upper()
    return cleaned if cleaned else None


def validate_vin(vin: str) -> Tuple[bool, Optional[str]]:
    """
    Validates a vehicle identification number (VIN).
    Standard ISO 3779 VIN is 17 characters long and does not contain I, O, Q.
    """
    normalized = normalize_vin(vin)
    if not normalized:
        return False, "VIN cannot be empty"
    
    if len(normalized) != 17:
        return False, f"VIN must be exactly 17 characters long (got {len(normalized)})"
    
    # ISO 3779 forbids I, O, Q to avoid confusion with 1, 0, 9
    invalid_chars = set("IOQ") & set(normalized)
    if invalid_chars:
        return False, f"VIN cannot contain invalid characters: {', '.join(sorted(invalid_chars))}"
    
    if not re.match(r"^[A-HJ-NPR-Z0-9]{17}$", normalized):
        return False, "VIN contains invalid characters"
    
    return True, None


def normalize_plate_number(plate: Optional[str]) -> Optional[str]:
    """
    Normalizes Rwanda plate number.
    Examples:
      'raa 123 a' -> 'RAA 123 A'
      'RAC123B'   -> 'RAC 123 B'
      'it 456'    -> 'IT 456'
      'GR 001 A'  -> 'GR 001 A'
    """
    if not plate:
        return None
    
    cleaned = plate.strip().upper()
    # Remove all spaces and dashes first
    compact = re.sub(r"[\s\-]", "", cleaned)
    
    # Format: RAA123A -> RAA 123 A
    m_rw = re.match(r"^(R[A-Z]{2})(\d{3})([A-Z])$", compact)
    if m_rw:
        return f"{m_rw.group(1)} {m_rw.group(2)} {m_rw.group(3)}"
    
    # Format: IT1234 -> IT 1234 (Temporary transit)
    m_it = re.match(r"^(IT)(\d{3,4})$", compact)
    if m_it:
        return f"{m_it.group(1)} {m_it.group(2)}"
    
    # Format: GR123A -> GR 123 A (Government Rwanda)
    m_gr = re.match(r"^(GR)(\d{3})([A-Z]?)$", compact)
    if m_gr:
        tail = f" {m_gr.group(3)}" if m_gr.group(3) else ""
        return f"{m_gr.group(1)} {m_gr.group(2)}{tail}"
    
    # Format: CD123A -> CD 123 A (Diplomatic)
    m_cd = re.match(r"^(CD|CMD|CC)(\d{2,3})([A-Z]?)$", compact)
    if m_cd:
        tail = f" {m_cd.group(3)}" if m_cd.group(3) else ""
        return f"{m_cd.group(1)} {m_cd.group(2)}{tail}"

    # General standardizer for generic format: 3 letters, numbers, optional letter
    m_gen = re.match(r"^([A-Z]{2,3})(\d{2,4})([A-Z]?)$", compact)
    if m_gen:
        tail = f" {m_gen.group(3)}" if m_gen.group(3) else ""
        return f"{m_gen.group(1)} {m_gen.group(2)}{tail}"

    # Fallback: remove excess internal whitespace
    return re.sub(r"\s+", " ", cleaned)
