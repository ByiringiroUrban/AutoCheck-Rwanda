"use client";

import { Suspense, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DisputeForm } from "@/components/DisputeForm";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, Spinner } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Dispute } from "@/types/api";
import { OWNER_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

export default function OwnerDisputesPage() {
  return (
    <ProtectedRoute allow={OWNER_ROLES}>
      <Suspense fallback={<div className="p-8"><Spinner /></div>}>
        <DisputesBody />
      </Suspense>
    </ProtectedRoute>
  );
}

function DisputesBody() {
  const [rows, setRows] = useState<Dispute[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    endpoints.myDisputes().then(setRows).catch((err: unknown) => {
      setError(err instanceof ApiError ? err.message : "Disputes could not be loaded.");
    });
  }, []);

  return (
    <DashboardFrame title="Disputes and corrections" subtitle="Cases you opened against a vehicle record.">
      <div className="space-y-6">
        {error ? <Alert>{error}</Alert> : null}
        <DataTable
          rows={rows}
          empty="You have not opened a dispute."
          getSearchText={(row) => `${row.reason} ${row.status} ${row.vehicle_id}`}
          columns={[
            { key: "when", header: "Opened", render: (row) => formatWhen(row.created_at) },
            { key: "reason", header: "Reason", render: (row) => row.reason },
            { key: "status", header: "Status", render: (row) => row.status },
            { key: "target", header: "Target", render: (row) => row.target_type },
          ]}
        />
        <div className="max-w-xl rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
          <h2 className="m-0 mb-3 text-[18px] font-bold">Open a correction</h2>
          <DisputeForm />
        </div>
      </div>
    </DashboardFrame>
  );
}
