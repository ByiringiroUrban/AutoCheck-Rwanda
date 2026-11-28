"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable, type Column } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError, apiUrl } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Ownership } from "@/types/api";
import { PLATFORM_ROLES } from "@/utils/roles";

export default function AdminOwnershipPage() {
  return (
    <ProtectedRoute allow={PLATFORM_ROLES}>
      <Claims />
    </ProtectedRoute>
  );
}

function Claims() {
  const [rows, setRows] = useState<Ownership[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = () => endpoints.pendingClaims().then(setRows);

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Ownership claims could not be loaded."));
  }, []);

  const decide = async (id: string, decision: "approve" | "reject") => {
    try {
      await endpoints.reviewClaim(id, decision);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The claim could not be updated.");
    }
  };

  return (
    <DashboardFrame title="Ownership claims" subtitle="Owners waiting for their proof of ownership to be reviewed.">
      {error ? <Alert>{error}</Alert> : null}
      <DataTable
        rows={rows}
        empty="No ownership claims are waiting for review."
        getSearchText={(row) =>
          `${row.vehicle?.make || ""} ${row.vehicle?.model || ""} ${row.vehicle?.vin || ""} ${row.user?.email || ""} ${row.user?.first_name || ""} ${row.user?.last_name || ""}`
        }
        columns={
          [
            {
              key: "vehicle",
              header: "Vehicle",
              render: (row) => `${row.vehicle?.year || ""} ${row.vehicle?.make || ""} ${row.vehicle?.model || ""}`.trim() || "—",
            },
            { key: "vin", header: "VIN", render: (row) => row.vehicle?.vin || "—" },
            {
              key: "owner",
              header: "Claimed by",
              render: (row) => (
                <span>
                  {row.user ? `${row.user.first_name} ${row.user.last_name}` : "—"}
                  <br />
                  {row.user?.email}
                </span>
              ),
            },
            {
              key: "evidence",
              header: "Proof",
              render: (row) =>
                row.evidence_url ? (
                  <a href={row.evidence_url.startsWith("http") ? row.evidence_url : apiUrl(row.evidence_url)} target="_blank" rel="noreferrer">
                    View proof
                  </a>
                ) : (
                  "None attached"
                ),
            },
            { key: "created", header: "Submitted", render: (row) => new Date(row.created_at).toLocaleDateString() },
            { key: "status", header: "Status", render: (row) => row.status },
          ] as Column<Ownership>[]
        }
        rowActions={(row) => [
          { label: "Approve", onClick: () => decide(row.id, "approve") },
          { label: "Reject", danger: true, onClick: () => decide(row.id, "reject") },
        ]}
      />
    </DashboardFrame>
  );
}
