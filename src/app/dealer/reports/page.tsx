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
import { MANAGER_ROLES } from "@/utils/roles";
import { formatWhen } from "@/utils/validation";

export default function DealerReportsPage() {
  return (
    <ProtectedRoute allow={MANAGER_ROLES}>
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
    <DashboardFrame title="Bulk reports" subtitle="Reports requested by this dealership account.">
      {loading ? <Spinner /> : null}
      {error ? <Alert>{error}</Alert> : null}
      <DataTable
        rows={rows}
        empty="No reports yet. Find a vehicle in Dealer inventory and generate one."
        getSearchText={(row) => `${row.vehicle_id} ${row.score} ${row.status}`}
        columns={[
          { key: "when", header: "Generated", render: (row) => formatWhen(row.generated_at) },
          { key: "vehicle", header: "Vehicle", render: (row) => row.vehicle_id },
          { key: "score", header: "Score", render: (row) => row.score },
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
