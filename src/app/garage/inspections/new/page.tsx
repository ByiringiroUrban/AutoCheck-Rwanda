"use client";

import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { lookupVehicle } from "@/hooks/useVehicleSearch";
import type { Vehicle } from "@/types/api";
import { STAFF_ROLES } from "@/utils/roles";
import { validateMileage } from "@/utils/validation";

const ITEMS = [
  { category: "BRAKES", item: "Brake pad thickness" },
  { category: "BRAKES", item: "Brake fluid" },
  { category: "ENGINE", item: "Engine oil condition" },
  { category: "ENGINE", item: "Coolant level" },
  { category: "TIRES_WHEELS", item: "Tire tread" },
  { category: "ELECTRICAL", item: "Lights and battery" },
  { category: "EXTERIOR_BODY", item: "Panels and glass" },
];

export default function NewInspectionPage() {
  return (
    <ProtectedRoute allow={STAFF_ROLES}>
      <InspectionForm />
    </ProtectedRoute>
  );
}

function InspectionForm() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    try {
      setVehicle(await lookupVehicle("vin", String(data.get("vin") || "")));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Lookup failed.");
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicle) return;
    const data = new FormData(event.currentTarget);
    const mileage = validateMileage(String(data.get("mileage") || ""), vehicle.latest_mileage);
    setWarning(mileage.warning || null);
    if (!mileage.ok || mileage.mileage == null) {
      setError(mileage.message || "Check the mileage.");
      return;
    }
    try {
      const inspection = await endpoints.createInspection({
        vehicle_id: vehicle.id,
        mileage: mileage.mileage,
        inspection_type: "STANDARD_SAFETY",
        summary: String(data.get("summary") || "") || undefined,
      });
      for (const item of ITEMS) {
        const condition = String(data.get(`condition-${item.item}`) || "PASS");
        const severity = condition === "FAIL" ? "HIGH" : condition === "WARNING" ? "MEDIUM" : "NONE";
        await endpoints.addInspectionItem(inspection.id, {
          category: item.category,
          item: item.item,
          condition,
          severity,
          notes: String(data.get(`notes-${item.item}`) || "") || undefined,
        });
      }
      const done = await endpoints.completeInspection(inspection.id, String(data.get("summary") || "") || undefined);
      setNote(`Inspection ${done.id} is ${done.status}.`);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The inspection could not be saved.");
    }
  };

  return (
    <DashboardFrame title="Physical inspection" subtitle="Checklist items are saved one by one, then the inspection is completed.">
      <div className="max-w-3xl space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        {warning ? <Alert tone="warn">{warning}</Alert> : null}
        {note ? <Alert tone="ok">{note}</Alert> : null}
        <PendingForm onSubmit={find} className="flex flex-col gap-3 sm:flex-row">
          <input name="vin" required maxLength={17} placeholder="VIN" className={fieldClass} />
          <SubmitButton busyLabel="Looking up…">Look up</SubmitButton>
        </PendingForm>
        {vehicle ? (
          <PendingForm onSubmit={save} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
            <p className="m-0 font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <input name="mileage" required placeholder="Mileage (km)" className={fieldClass} />
            <textarea name="summary" rows={3} placeholder="Summary" className={`${fieldClass} h-auto py-2`} />
            {ITEMS.map((item) => (
              <div key={item.item} className="grid grid-cols-1 gap-2 border-t border-solid border-[#eee] pt-3 sm:grid-cols-3">
                <p className="m-0 text-[13px] font-semibold">
                  {item.category.replaceAll("_", " ")}
                  <span className="block font-normal text-[#666]">{item.item}</span>
                </p>
                <select name={`condition-${item.item}`} className={fieldClass} defaultValue="PASS">
                  <option value="PASS">Pass</option>
                  <option value="WARNING">Warning</option>
                  <option value="FAIL">Fail</option>
                  <option value="NOT_APPLICABLE">Not applicable</option>
                </select>
                <input name={`notes-${item.item}`} placeholder="Notes" className={fieldClass} />
              </div>
            ))}
            <SubmitButton busyLabel="Saving…">Complete inspection</SubmitButton>
          </PendingForm>
        ) : null}
      </div>
    </DashboardFrame>
  );
}
