"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, Spinner } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Report } from "@/types/api";
import { OWNER_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

export default function SavedReportsPage() {
  return (
    <ProtectedRoute allow={OWNER_ROLES}>
      <ReportsBody />
    </ProtectedRoute>
  );
}

function ReportsBody() {
  const [rows, setRows] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints
      .myReports()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Reports could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardFrame title="My saved reports" subtitle="History reports generated while you were signed in.">
      {loading ? <Spinner /> : null}
      {error ? <Alert>{error}</Alert> : null}
      <DataTable
        rows={rows}
        empty="You have not generated a report yet. Search a VIN on the home page, then open the full report."
        getSearchText={(row) => `${row.id} ${row.vehicle_id} ${row.score}`}
        columns={[
          { key: "when", header: "Generated", render: (row) => formatWhen(row.generated_at) },
          { key: "score", header: "Score", render: (row) => row.score },
          { key: "status", header: "Status", render: (row) => row.status },
          {
            key: "open",
            header: "Report",
            render: (row) => (
              <Link href={`/reports/${row.id}`} className="font-semibold text-ac-blue">
                View
              </Link>
            ),
          },
        ]}
      />
    </DashboardFrame>
  );
}
