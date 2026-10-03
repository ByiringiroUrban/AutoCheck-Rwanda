"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, Spinner, fieldClass } from "@/components/ui";
import { ApiError, apiUrl } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { lookupVehicle } from "@/hooks/useVehicleSearch";
import type { Ownership } from "@/types/api";
import { OWNER_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

function MyVehiclesBody() {
  const params = useSearchParams();
  const [rows, setRows] = useState<Ownership[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [vin, setVin] = useState(params.get("vin") || "");

  const load = async () => {
    const data = await endpoints.myVehicles();
    setRows(data);
  };

  useEffect(() => {
    let cancelled = false;
    endpoints
      .myVehicles()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Vehicles could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setNote(null);
    try {
      const vehicle = await lookupVehicle("vin", String(data.get("vin") || vin));
      const file = data.get("proof");
      let evidenceUrl: string | undefined;
      if (file instanceof File && file.size > 0) {
        const uploaded = await endpoints.uploadImage(vehicle.id, file, "DOCUMENT", "VEHICLE_OWNER");
        evidenceUrl = uploaded.upload_url.startsWith("http") ? uploaded.upload_url : apiUrl(uploaded.upload_url);
      }
      const claim = await endpoints.claimOwnership({ vehicle_id: vehicle.id, evidence_url: evidenceUrl });
      setNote(`Claim ${claim.status}. The registry records the start date.`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The claim could not be submitted.");
    }
  };

  return (
    <DashboardFrame title="My vehicles" subtitle="Vehicles you have claimed, and a form to submit proof of ownership." >
      <div className="space-y-6">
        {loading ? <Spinner /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {note ? <Alert tone="ok">{note}</Alert> : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.length === 0 && !loading ? <p className="text-[14px] text-[#666]">You have not claimed a vehicle yet.</p> : null}
          {rows.map((row) => (
            <article key={row.id} className="rounded-[8px] border border-solid border-[#ddd] bg-white p-4 shadow-sm">
              <h2 className="m-0 text-[16px] font-bold">
                {row.vehicle ? `${row.vehicle.year} ${row.vehicle.make} ${row.vehicle.model}` : row.vehicle_id}
              </h2>
              <p className="m-0 mt-1 text-[13px] text-[#555]">
                {row.vehicle?.vin} · {row.status} · since {formatWhen(row.start_date)}
              </p>
              {row.evidence_url ? (
                <a href={row.evidence_url.startsWith("http") ? row.evidence_url : apiUrl(row.evidence_url)} className="text-[13px]">
                  View proof
                </a>
              ) : null}
            </article>
          ))}
        </div>
        <form method="post" onSubmit={onClaim} className="max-w-xl space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
          <h2 className="m-0 text-[18px] font-bold">Claim a vehicle</h2>
          <p className="text-[13px] text-[#666]">
            Search by VIN, then attach a photo of the yellow card. The API stores the claim against the vehicle id and the evidence URL.
          </p>
          <input name="vin" value={vin} onChange={(event) => setVin(event.target.value)} required maxLength={17} className={fieldClass} placeholder="VIN" />
          <input name="plate" className={fieldClass} placeholder="Plate (for your notes)" />
          <label className="block text-[13px] font-semibold">
            Proof of ownership
            <input name="proof" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block text-[13px] font-normal" />
          </label>
          <button type="submit" className="ac-btn px-5">
            Submit claim
          </button>
        </form>
      </div>
    </DashboardFrame>
  );
}

export default function MyVehiclesPage() {
  return (
    <ProtectedRoute allow={OWNER_ROLES}>
      <Suspense fallback={<div className="p-8"><Spinner /></div>}>
        <MyVehiclesBody />
      </Suspense>
    </ProtectedRoute>
  );
}
