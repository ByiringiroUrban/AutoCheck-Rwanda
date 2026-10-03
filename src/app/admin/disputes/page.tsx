"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Dispute } from "@/types/api";
import { ADMIN_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

export default function AdminDisputesPage() {
  return (
    <ProtectedRoute allow={ADMIN_ROLES}>
      <Queue />
    </ProtectedRoute>
  );
}

function Queue() {
  const [rows, setRows] = useState<Dispute[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = () => endpoints.adminDisputes().then(setRows);

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Disputes could not be loaded."));
  }, []);

  const resolve = async (id: string, status: string) => {
    const notes = window.prompt("Resolution notes") || "";
    if (notes.trim().length < 3) {
      setError("Add at least 3 characters of resolution notes.");
      return;
    }
    try {
      await endpoints.resolveDispute(id, { status, resolution_notes: notes.trim() });
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
          {
            key: "actions",
            header: "",
            render: (row) => (
              <div className="flex gap-2">
                <button type="button" className="text-[13px] font-bold text-emerald-700" onClick={() => void resolve(row.id, "RESOLVED")}>
                  Resolve
                </button>
                <button type="button" className="text-[13px] font-bold text-ac-danger" onClick={() => void resolve(row.id, "REJECTED")}>
                  Reject
                </button>
              </div>
            ),
          },
        ]}
      />
    </DashboardFrame>
  );
}
