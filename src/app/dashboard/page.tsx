"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { BarChart, DashboardSkeleton, MixChart, StatGrid } from "@/components/dashboard/OverviewCharts";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Dispute, Ownership, Report } from "@/types/api";
import { OWNER_ROLES } from "@/utils/roles";
import { ReportPreview } from "@/components/report/ReportPreview";
import { formatWhen } from "@/utils/validation";

function DashboardBody() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [vehicles, setVehicles] = useState<Ownership[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const [reportRows, vehicleRows, disputeRows] = await Promise.all([
          endpoints.myReports(),
          endpoints.myVehicles(),
          endpoints.myDisputes(),
        ]);
        if (cancelled) return;
        setReports(reportRows);
        setVehicles(vehicleRows);
        setDisputes(disputeRows);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Dashboard data could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const openDisputes = disputes.filter((item) => item.status === "OPEN" || item.status === "UNDER_REVIEW").length;
  const scoreBars = [...reports]
    .sort((a, b) => a.generated_at.localeCompare(b.generated_at))
    .slice(-8)
    .map((row) => ({ label: formatWhen(row.generated_at).slice(0, 6), value: row.score }));
  const disputeMix = ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"].map((status, index) => ({
    label: status,
    value: disputes.filter((item) => item.status === status).length,
    color: ["#f37920", "#0b4c4c", "#198754", "#dc3545"][index],
  }));

  return (
    <DashboardFrame title={`Hello, ${user?.first_name || "there"}`} subtitle="Your vehicles, saved reports, and open corrections.">
      <div className="space-y-5">
        {loading ? <DashboardSkeleton /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {!loading ? (
          <>
            <StatGrid
              items={[
                { label: "Reports", value: reports.length },
                { label: "Claimed vehicles", value: vehicles.length },
                { label: "Open disputes", value: openDisputes },
              ]}
            />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <BarChart title="Report scores" items={scoreBars} />
              <MixChart title="Dispute status" items={disputeMix} />
            </div>
          </>
        ) : null}
        <section>
          <h2 className="mb-3 text-[18px] font-bold">My reports</h2>
          <DataTable
            rows={reports}
            empty="You have not generated a report yet."
            getSearchText={(row) => `${row.id} ${row.vehicle_id} ${row.score}`}
            columns={[
              { key: "when", header: "Generated", render: (row) => formatWhen(row.generated_at) },
              { key: "score", header: "Score", render: (row) => row.score },
              { key: "status", header: "Status", render: (row) => row.status },
            ]}
            rowActions={(row) => [{ label: "Open report", onClick: () => setOpenReportId(row.id) }]}
          />
        </section>
        {openReportId ? <ReportPreview reportId={openReportId} onClose={() => setOpenReportId(null)} /> : null}
      </div>
    </DashboardFrame>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allow={OWNER_ROLES}>
      <DashboardBody />
    </ProtectedRoute>
  );
}
