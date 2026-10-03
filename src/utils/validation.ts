export interface CheckResult {
  ok: boolean;
  message?: string;
  value?: string;
  warning?: string;
}

export function normalizeVin(input: string): string {
  return input.replace(/[\s-]/g, "").trim().toUpperCase();
}

/** 17 uppercase characters. Letters I, O, and Q are rejected. */
export function validateVin(input: string): CheckResult {
  const value = normalizeVin(input);
  if (!value) return { ok: false, message: "Enter a vehicle identification number." };
  if (value.length !== 17) {
    return { ok: false, message: `VIN must be 17 characters (got ${value.length}).` };
  }
  if (/[IOQ]/.test(value) || !/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) {
    return { ok: false, message: "VIN cannot contain the letters I, O, or Q." };
  }
  return { ok: true, value };
}

/**
 * Rwanda plate formatting.
 * RAC123A -> RAC 123 A, IT456 -> IT 456, GR001A -> GR 001 A.
 */
export function normalizePlate(input: string): string | null {
  const compact = input.trim().toUpperCase().replace(/[\s-]/g, "");
  if (!compact) return null;

  const rw = compact.match(/^(R[A-Z]{2})(\d{3})([A-Z])$/);
  if (rw) return `${rw[1]} ${rw[2]} ${rw[3]}`;

  const it = compact.match(/^(IT)(\d{3,4})$/);
  if (it) return `${it[1]} ${it[2]}`;

  const gr = compact.match(/^(GR)(\d{3})([A-Z]?)$/);
  if (gr) return `${gr[1]} ${gr[2]}${gr[3] ? ` ${gr[3]}` : ""}`;

  const cd = compact.match(/^(CD|CMD|CC)(\d{2,3})([A-Z]?)$/);
  if (cd) return `${cd[1]} ${cd[2]}${cd[3] ? ` ${cd[3]}` : ""}`;

  const generic = compact.match(/^([A-Z]{2,3})(\d{2,4})([A-Z]?)$/);
  if (generic) return `${generic[1]} ${generic[2]}${generic[3] ? ` ${generic[3]}` : ""}`;

  return null;
}

export function validatePlate(input: string): CheckResult {
  const value = normalizePlate(input);
  if (!value) {
    return { ok: false, message: "Enter a Rwanda plate such as RAC 123 A." };
  }
  return { ok: true, value };
}

export function maskVin(vin: string): string {
  const clean = normalizeVin(vin);
  if (clean.length < 8) return clean;
  return `${clean.slice(0, 3)}${"*".repeat(clean.length - 7)}${clean.slice(-4)}`;
}

/** Non-negative integer. A drop versus a past reading is a warning, not a block. */
export function validateMileage(input: string, previous?: number | null): CheckResult & { mileage?: number } {
  const trimmed = input.trim();
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, message: "Mileage must be a whole number of kilometres, zero or higher." };
  }
  const mileage = Number(trimmed);
  if (!Number.isSafeInteger(mileage) || mileage < 0) {
    return { ok: false, message: "Mileage must be a whole number of kilometres, zero or higher." };
  }
  if (previous != null && mileage < previous) {
    return {
      ok: true,
      mileage,
      value: String(mileage),
      warning: `This reading (${mileage.toLocaleString()} km) is lower than the last recorded ${previous.toLocaleString()} km. It will be flagged as a possible rollback.`,
    };
  }
  return { ok: true, mileage, value: String(mileage) };
}

export function formatWhen(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function riskLevel(score: number): "Low" | "Moderate" | "High" {
  if (score >= 75) return "Low";
  if (score >= 50) return "Moderate";
  return "High";
}
