"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BarChart, DashboardSkeleton, StatGrid } from "@/components/dashboard/OverviewCharts";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { AdminStats } from "@/types/api";
import { ADMIN_ROLES } from "@/utils/roles";

export default function AdminPage() {
  return (
    <ProtectedRoute allow={ADMIN_ROLES}>
      <Overview />
    </ProtectedRoute>
  );
}

function Overview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    endpoints
      .adminStats()
      .then(setStats)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Admin data could not be loaded."));
  }, []);

  return (
    <DashboardFrame title="Admin dashboard" subtitle="INGOGA AUTO operations and data quality.">
      {error ? <Alert>{error}</Alert> : null}
      {!stats && !error ? <DashboardSkeleton /> : null}
      {stats ? (
        <div className="space-y-4">
          <StatGrid
            items={[
              { label: "Vehicles", value: stats.total_vehicles },
              { label: "Active garages", value: stats.total_garages },
              { label: "Open disputes", value: stats.open_disputes },
              { label: "Reports", value: stats.total_reports_generated },
              { label: "Users", value: stats.total_users },
              { label: "Inspections", value: stats.total_inspections },
            ]}
          />
          <BarChart
            title="Platform totals"
            items={[
              { label: "Vehicles", value: stats.total_vehicles },
              { label: "Garages", value: stats.total_garages },
              { label: "Disputes", value: stats.open_disputes },
              { label: "Reports", value: stats.total_reports_generated },
              { label: "Users", value: stats.total_users },
              { label: "Checks", value: stats.total_inspections },
            ]}
          />
        </div>
      ) : null}
    </DashboardFrame>
  );
}
