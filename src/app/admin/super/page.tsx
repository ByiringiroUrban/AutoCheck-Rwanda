"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BarChart, DashboardSkeleton, MixChart, StatGrid } from "@/components/dashboard/OverviewCharts";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { AdminStats } from "@/types/api";
import { SUPER_ROLES } from "@/utils/roles";

export default function SuperDashboardPage() {
  return (
    <ProtectedRoute allow={SUPER_ROLES}>
      <SuperHome />
    </ProtectedRoute>
  );
}

function SuperHome() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    endpoints
      .adminStats()
      .then(setStats)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "System stats could not be loaded."));
  }, []);

  return (
    <DashboardFrame title="Global system dashboard" subtitle="Platform totals for the super administrator.">
      {error ? <Alert>{error}</Alert> : null}
      {!stats && !error ? <DashboardSkeleton /> : null}
      {stats ? (
        <div className="space-y-4">
          <p className="m-0 text-[14px]">System status: {stats.system_status}</p>
          <StatGrid
            items={[
              { label: "Vehicles", value: stats.total_vehicles },
              { label: "Users", value: stats.total_users },
              { label: "Garages", value: stats.total_garages },
              { label: "Reports", value: stats.total_reports_generated },
              { label: "Inspections", value: stats.total_inspections },
              { label: "Open disputes", value: stats.open_disputes },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <BarChart
              title="Platform totals"
              items={[
                { label: "Vehicles", value: stats.total_vehicles },
                { label: "Users", value: stats.total_users },
                { label: "Garages", value: stats.total_garages },
                { label: "Reports", value: stats.total_reports_generated },
                { label: "Checks", value: stats.total_inspections },
                { label: "Disputes", value: stats.open_disputes },
              ]}
            />
            <MixChart
              title="Workload mix"
              items={[
                { label: "Vehicles", value: stats.total_vehicles, color: "#0b4c4c" },
                { label: "Reports", value: stats.total_reports_generated, color: "#f37920" },
                { label: "Inspections", value: stats.total_inspections, color: "#198754" },
                { label: "Open disputes", value: stats.open_disputes, color: "#dc3545" },
              ]}
            />
          </div>
        </div>
      ) : null}
    </DashboardFrame>
  );
}
