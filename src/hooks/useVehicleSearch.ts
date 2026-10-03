"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Vehicle } from "@/types/api";
import { validatePlate, validateVin } from "@/utils/validation";

export async function lookupVehicle(kind: "vin" | "plate", raw: string): Promise<Vehicle> {
  if (kind === "vin") {
    const check = validateVin(raw);
    if (!check.ok || !check.value) throw new ApiError(check.message || "Invalid VIN", 422);
    return endpoints.searchVehicle({ vin: check.value });
  }
  const check = validatePlate(raw);
  if (!check.ok || !check.value) throw new ApiError(check.message || "Invalid plate", 422);
  return endpoints.searchVehicle({ plate: check.value });
}

export function friendlySearchError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) return "No vehicle in the registry matches that number.";
    if (error.status === 0) return error.message;
    return error.message;
  }
  return "The search could not be completed.";
}

export function useVehicleSearch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(kind: "vin" | "plate", raw: string) {
    setError(null);
    setLoading(true);
    try {
      const vehicle = await lookupVehicle(kind, raw);
      const query = kind === "vin" ? `vin=${encodeURIComponent(vehicle.vin)}` : `plate=${encodeURIComponent(vehicle.current_plate || raw)}`;
      router.push(`/search-results?${query}`);
      return vehicle;
    } catch (err) {
      setError(friendlySearchError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { search, loading, error, setError };
}
