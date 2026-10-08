"use client";

import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { lookupVehicle } from "@/hooks/useVehicleSearch";
import type { Vehicle } from "@/types/api";
import { useRouter } from "next/navigation";
import { GARAGE_ROLES } from "@/utils/roles";
import { validateMileage, validateVin } from "@/utils/validation";

const TYPES = ["ROUTINE_MAINTENANCE", "OIL_CHANGE", "BRAKE_SERVICE", "MAJOR_REPAIR"];

export default function NewServicePage() {
  return (
    <ProtectedRoute allow={GARAGE_ROLES}>
      <ServiceForm />
    </ProtectedRoute>
  );
}

function ServiceForm() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setVehicle(null);
    try {
      const found = await lookupVehicle("vin", String(data.get("vin") || ""));
      setVehicle(found);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setCreating(true);
        setError("That VIN is not in the registry yet. Create the vehicle identity below.");
      } else {
        setError(err instanceof ApiError ? err.message : "Lookup failed.");
      }
    }
  };

  const createIdentity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vin = validateVin(String(data.get("vin") || ""));
    if (!vin.ok || !vin.value) {
      setError(vin.message || "Invalid VIN");
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
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The vehicle could not be created.");
    }
  };

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicle) return;
    const data = new FormData(event.currentTarget);
    const mileage = validateMileage(String(data.get("mileage") || ""), vehicle.latest_mileage);
    setWarning(mileage.warning || null);
    if (!mileage.ok || mileage.mileage == null) {
      setError(mileage.message || "Check the mileage.");
      return;
    }
    const parts = String(data.get("parts") || "").trim();
    const work = String(data.get("description") || "").trim();
    const description = parts ? `${work}\nParts replaced: ${parts}` : work;
    try {
      const record = await endpoints.createServiceRecord({
        vehicle_id: vehicle.id,
        mileage: mileage.mileage,
        service_type: String(data.get("service_type") || "ROUTINE_MAINTENANCE"),
        description,
        service_date: String(data.get("service_date") || "") ? new Date(String(data.get("service_date"))).toISOString() : undefined,
      });
      setNote(`Service record ${record.id} saved.`);
      setError(null);
      router.push(`/garage/history?vin=${encodeURIComponent(vehicle.vin)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The service record could not be saved.");
    }
  };

  return (
    <DashboardFrame title="Add a service record" subtitle="Look up the VIN, then record the work, parts, and mileage.">
      <div className="max-w-2xl space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        {warning ? <Alert tone="warn">{warning}</Alert> : null}
        {note ? <Alert tone="ok">{note}</Alert> : null}
        <PendingForm onSubmit={find} className="flex flex-col gap-3 sm:flex-row">
          <input name="vin" required maxLength={17} placeholder="VIN" className={fieldClass} />
          <SubmitButton busyLabel="Looking up…">Look up</SubmitButton>
        </PendingForm>
        {creating ? (
          <PendingForm onSubmit={createIdentity} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
            <h2 className="m-0 text-[16px] font-bold">Create vehicle identity</h2>
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
        {vehicle ? (
          <>
            <VehicleIdentityCard vehicle={vehicle} mask={false} />
            <PendingForm onSubmit={saveRecord} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
              <label className="block text-[13px] font-semibold">
                Mileage (km)
                <input name="mileage" required className={`${fieldClass} mt-1`} />
              </label>
              <label className="block text-[13px] font-semibold">
                Service category
                <select name="service_type" className={`${fieldClass} mt-1`}>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[13px] font-semibold">
                Work description
                <textarea name="description" required minLength={3} rows={4} className={`${fieldClass} mt-1 h-auto py-2`} />
              </label>
              <label className="block text-[13px] font-semibold">
                Parts replaced
                <input name="parts" className={`${fieldClass} mt-1`} placeholder="Included in the description sent to the API" />
              </label>
              <label className="block text-[13px] font-semibold">
                Service date
                <input name="service_date" type="date" className={`${fieldClass} mt-1`} />
              </label>
              <SubmitButton busyLabel="Saving…">Save service record</SubmitButton>
            </PendingForm>
          </>
        ) : null}
      </div>
    </DashboardFrame>
  );
}
