"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable, type Column } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Organization } from "@/types/api";
import { ADMIN_ROLES } from "@/utils/roles";

export default function AdminOrganizationsPage() {
  return (
    <ProtectedRoute allow={ADMIN_ROLES}>
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
        getSearchText={(row) => `${row.name} ${row.tin} ${row.type} ${row.location}`}
        columns={
          [
            { key: "name", header: "Name", render: (row) => row.name },
            { key: "type", header: "Type", render: (row) => row.type },
            { key: "tin", header: "TIN", render: (row) => row.tin },
            { key: "where", header: "Location", render: (row) => row.location },
            { key: "status", header: "Status", render: (row) => row.status },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex gap-2">
                  <button type="button" className="text-[13px] font-bold text-emerald-700" onClick={() => void setStatus(row.id, "APPROVED")}>
                    Approve
                  </button>
                  <button type="button" className="text-[13px] font-bold text-ac-danger" onClick={() => void setStatus(row.id, "REJECTED")}>
                    Reject
                  </button>
                </div>
              ),
            },
          ] as Column<Organization>[]
        }
      />
    </DashboardFrame>
  );
}
