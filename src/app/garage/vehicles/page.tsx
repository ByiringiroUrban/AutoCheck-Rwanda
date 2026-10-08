"use client";

import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import type { Vehicle } from "@/types/api";
import { STAFF_ROLES } from "@/utils/roles";
import { validateVin } from "@/utils/validation";

export default function GarageVehiclesPage() {
  return (
    <ProtectedRoute allow={STAFF_ROLES}>
      <VehiclesBody />
    </ProtectedRoute>
  );
}

function VehiclesBody() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setNote(null);
    setCreating(false);
    try {
      setVehicle(await lookupVehicle("vin", String(data.get("vin") || "")));
    } catch (err) {
      setVehicle(null);
      if (err instanceof ApiError && err.status === 404) setCreating(true);
      setError(friendlySearchError(err));
    }
  };

  const createIdentity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vin = validateVin(String(data.get("vin") || ""));
    if (!vin.ok || !vin.value) {
      setError(vin.message || "Enter a valid VIN.");
      return;
    }
    try {
      const created = await endpoints.createVehicle({
        vin: vin.value,
        make: String(data.get("make") || ""),
        model: String(data.get("model") || ""),
        year: Number(data.get("year") || 0),
        body_type: String(data.get("body_type") || "SEDAN"),
        fuel_type: String(data.get("fuel_type") || "PETROL"),
        color: String(data.get("color") || "UNKNOWN"),
        initial_plate: String(data.get("plate") || "") || undefined,
      });
      setVehicle(created);
      setCreating(false);
      setError(null);
      setNote("Vehicle identity saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The vehicle could not be created.");
    }
  };

  return (
    <DashboardFrame title="Find or register a vehicle" subtitle="Search the registry. If the VIN is new, create the identity before a service or inspection.">
      <div className="max-w-xl space-y-4">
        {error && !creating ? <Alert>{error}</Alert> : null}
        {note ? <Alert tone="ok">{note}</Alert> : null}
        <PendingForm onSubmit={find} className="flex flex-col gap-3 sm:flex-row">
          <input name="vin" required maxLength={17} placeholder="VIN" className={fieldClass} />
          <SubmitButton busyLabel="Looking up…">Look up</SubmitButton>
        </PendingForm>
        {creating ? (
          <PendingForm onSubmit={createIdentity} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
            <h2 className="m-0 text-[16px] font-bold">This VIN is not in the registry</h2>
            <input name="vin" required maxLength={17} placeholder="VIN" className={fieldClass} />
            <input name="make" required placeholder="Make" className={fieldClass} />
            <input name="model" required placeholder="Model" className={fieldClass} />
            <input name="year" required type="number" min={1900} max={2100} placeholder="Year" className={fieldClass} />
            <input name="plate" placeholder="Current plate" className={fieldClass} />
            <input name="body_type" placeholder="Body type" defaultValue="SEDAN" className={fieldClass} />
            <input name="fuel_type" placeholder="Fuel" defaultValue="PETROL" className={fieldClass} />
            <input name="color" placeholder="Colour" defaultValue="UNKNOWN" className={fieldClass} />
            <SubmitButton busyLabel="Creating…">Create vehicle</SubmitButton>
          </PendingForm>
        ) : null}
        {vehicle ? <VehicleIdentityCard vehicle={vehicle} mask={false} /> : null}
      </div>
    </DashboardFrame>
  );
}
