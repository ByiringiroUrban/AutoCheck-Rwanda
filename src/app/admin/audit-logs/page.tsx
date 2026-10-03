"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { AuditLog } from "@/types/api";
import { SUPER_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

export default function AuditLogsPage() {
  return (
    <ProtectedRoute allow={SUPER_ROLES}>
      <Logs />
    </ProtectedRoute>
  );
}

function Logs() {
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    endpoints
      .auditLogs()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Audit logs could not be loaded."));
  }, []);

  return (
    <DashboardFrame title="Audit logs" subtitle="Sensitive actions recorded by the API: sign-ins, records, approvals, and disputes.">
      {error ? <Alert>{error}</Alert> : null}
      <DataTable
        rows={rows}
        empty="No audit events yet."
        getSearchText={(row) => `${row.action} ${row.entity_type} ${row.actor_user_id || ""}`}
        columns={[
          { key: "when", header: "When", render: (row) => formatWhen(row.created_at) },
          { key: "actor", header: "Actor", render: (row) => row.actor_user_id || "—" },
          { key: "action", header: "Action", render: (row) => row.action },
          { key: "entity", header: "Entity", render: (row) => `${row.entity_type} ${row.entity_id || ""}` },
        ]}
      />
    </DashboardFrame>
  );
}
