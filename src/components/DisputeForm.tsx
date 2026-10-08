"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError, apiUrl } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { Loader2 } from "lucide-react";
import { Alert, fieldClass } from "@/components/ui";
import { lookupVehicle } from "@/hooks/useVehicleSearch";

const TARGETS = ["SERVICE_RECORD", "INSPECTION", "MILEAGE", "INCIDENT", "VEHICLE_DETAILS"];

export function DisputeForm() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setPending(true);
    try {
      const vehicle = await lookupVehicle("vin", String(data.get("vin") || ""));
      let evidenceUrl: string | undefined;
      const file = data.get("evidence");
      if (file instanceof File && file.size > 0) {
        const uploaded = await endpoints.uploadImage(vehicle.id, file, "DAMAGE_DETAIL", "VEHICLE_OWNER");
        evidenceUrl = uploaded.upload_url.startsWith("http") ? uploaded.upload_url : apiUrl(uploaded.upload_url);
      }
      const dispute = await endpoints.createDispute({
        vehicle_id: vehicle.id,
        target_type: String(data.get("target_type") || "VEHICLE_DETAILS"),
        target_id: String(data.get("target_id") || vehicle.id),
        reason: String(data.get("reason") || ""),
        details: String(data.get("details") || ""),
        evidence_url: evidenceUrl,
      });
      setDone(`Dispute ${dispute.id} is ${dispute.status}.`);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The dispute could not be submitted.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form method="post" onSubmit={onSubmit} className="space-y-4">
      {done ? <Alert tone="ok">{done}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      <div>
        <label className="mb-1 block text-[13px] font-semibold" htmlFor="dispute-vin">
          Vehicle VIN
        </label>
        <input id="dispute-vin" name="vin" required maxLength={17} defaultValue={params.get("vin") || ""} className={fieldClass} placeholder="17-character VIN" />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-semibold" htmlFor="dispute-target">
          Record type
        </label>
        <select id="dispute-target" name="target_type" className={fieldClass}>
          {TARGETS.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-semibold" htmlFor="dispute-target-id">
          Record id
        </label>
        <input id="dispute-target-id" name="target_id" className={fieldClass} placeholder="Leave blank to use the vehicle id" />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-semibold" htmlFor="dispute-reason">
          Reason
        </label>
        <input id="dispute-reason" name="reason" required minLength={5} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-semibold" htmlFor="dispute-details">
          Details
        </label>
        <textarea id="dispute-details" name="details" required minLength={10} rows={5} className={`${fieldClass} h-auto py-2`} />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-semibold" htmlFor="dispute-file">
          Evidence image
        </label>
        <input id="dispute-file" name="evidence" type="file" accept="image/jpeg,image/png,image/webp" className="text-[13px]" />
      </div>
      <button type="submit" className="ac-btn gap-2 px-6" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : null}
        {pending ? "Submitting…" : "Submit Dispute"}
      </button>
    </form>
  );
}
