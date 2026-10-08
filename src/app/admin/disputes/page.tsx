"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { AsyncButton, PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Dispute } from "@/types/api";
import { PLATFORM_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

export default function AdminDisputesPage() {
  return (
    <ProtectedRoute allow={PLATFORM_ROLES}>
      <Queue />
    </ProtectedRoute>
  );
}

function Queue() {
  const [rows, setRows] = useState<Dispute[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Dispute | null>(null);
  const [notes, setNotes] = useState("");
  const [mileage, setMileage] = useState("");
  const [description, setDescription] = useState("");

  const load = () => endpoints.adminDisputes().then(setRows);

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Disputes could not be loaded."));
  }, []);

  const openResolve = (row: Dispute) => {
    setActive(row);
    setNotes("");
    setMileage("");
    setDescription("");
    setError(null);
  };

  const resolve = async (status: string) => {
    if (!active) return;
    if (notes.trim().length < 3) {
      setError("Add at least 3 characters of resolution notes.");
      return;
    }
    const payload: { mileage?: number; description?: string } = {};
    if (mileage.trim()) payload.mileage = Number(mileage);
    if (description.trim()) payload.description = description.trim();
    try {
      await endpoints.resolveDispute(active.id, {
        status,
        resolution_notes: notes.trim(),
        target_type: active.target_type,
        target_id: active.target_id,
        corrected_payload: status === "RESOLVED" && (payload.mileage != null || payload.description) ? payload : undefined,
      });
      setActive(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The dispute could not be updated.");
    }
  };

  return (
    <DashboardFrame title="Dispute queue" subtitle="Compare the stored record with the evidence the owner submitted.">
      {error ? <Alert>{error}</Alert> : null}
      <DataTable
        rows={rows}
        empty="No disputes are in the queue."
        getSearchText={(row) => `${row.reason} ${row.status} ${row.vehicle_id}`}
        columns={[
          { key: "when", header: "Opened", render: (row) => formatWhen(row.created_at) },
          { key: "vehicle", header: "Vehicle", render: (row) => row.vehicle_id },
          { key: "target", header: "Target", render: (row) => `${row.target_type} ${row.target_id}` },
          { key: "reason", header: "Reason", render: (row) => row.reason },
          { key: "status", header: "Status", render: (row) => row.status },
        ]}
        rowActions={(row) => [{ label: "Review", onClick: () => openResolve(row) }]}
      />
      {active ? (
        <PendingForm
          className="mt-4 max-w-xl space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4"
          onSubmit={() => resolve("RESOLVED")}
        >
          <h2 className="m-0 text-[16px] font-bold">Correct and resolve</h2>
          <p className="m-0 text-[13px] text-[#555]">
            {active.target_type} · {active.reason}
          </p>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} required minLength={3} rows={3} placeholder="Resolution notes" className={`${fieldClass} h-auto py-2`} />
          <input value={mileage} onChange={(event) => setMileage(event.target.value)} inputMode="numeric" placeholder="Corrected mileage (km), if the number is wrong" className={fieldClass} />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Corrected service text, if the words are wrong" className={`${fieldClass} h-auto py-2`} />
          <div className="flex gap-3">
            <SubmitButton busyLabel="Saving…">Resolve and save correction</SubmitButton>
            <AsyncButton className="ac-btn bg-[#6c757d] px-5" busyLabel="Rejecting…" onClick={() => resolve("REJECTED")}>
              Reject
            </AsyncButton>
          </div>
        </PendingForm>
      ) : null}
    </DashboardFrame>
  );
}
