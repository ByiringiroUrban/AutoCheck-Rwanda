"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable, type Column } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Organization } from "@/types/api";
import { PLATFORM_ROLES } from "@/utils/roles";

export default function AdminOrganizationsPage() {
  return (
    <ProtectedRoute allow={PLATFORM_ROLES}>
      <Orgs />
    </ProtectedRoute>
  );
}

function Orgs() {
  const [rows, setRows] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = () => endpoints.pendingGarages().then(setRows);

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Applications could not be loaded."));
  }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      await endpoints.updateGarageStatus(id, status);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The organization could not be updated.");
    }
  };

  return (
    <DashboardFrame title="Organization approvals" subtitle="Pending garage and dealer applications.">
      {error ? <Alert>{error}</Alert> : null}
      <DataTable
        rows={rows}
        empty="No organizations are waiting for approval."
        getSearchText={(row) => `${row.name} ${row.tin || ""} ${row.type} ${row.applicant_type} ${row.location || ""} ${row.email} ${row.phone}`}
        columns={
          [
            { key: "name", header: "Applicant / organization", render: (row) => row.name },
            { key: "type", header: "Type", render: (row) => row.type },
            {
              key: "applicant_type",
              header: "Applicant type",
              render: (row) => row.applicant_type === "INDIVIDUAL" ? "Individual" : "Organization",
            },
            { key: "tin", header: "TIN", render: (row) => row.tin || "—" },
            { key: "where", header: "Location", render: (row) => row.location || "—" },
            {
              key: "contact",
              header: "Contact",
              render: (row) => <span>{row.email}<br />{row.phone}</span>,
            },
            { key: "status", header: "Status", render: (row) => row.status },
          ] as Column<Organization>[]
        }
        rowActions={(row) => [
          { label: "Approve", onClick: () => setStatus(row.id, "APPROVED") },
          { label: "Reject", danger: true, onClick: () => setStatus(row.id, "REJECTED") },
        ]}
      />
    </DashboardFrame>
  );
}
