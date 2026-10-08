"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, FilePlus, Files, Settings, Users, Warehouse, Wrench } from "lucide-react";
import { ActionCard } from "@/components/dashboard/kit";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VehicleSearchForm } from "@/components/VehicleSearchForm";
import { BarChart, DashboardSkeleton, StatGrid } from "@/components/dashboard/OverviewCharts";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Organization, Report } from "@/types/api";
import { formatWhen } from "@/utils/validation";
import { GARAGE_ROLES } from "@/utils/roles";

export default function GarageDashboardPage() {
  return (
    <ProtectedRoute allow={GARAGE_ROLES}>
      <GarageHome />
    </ProtectedRoute>
  );
}

function GarageHome() {
  const { user } = useAuth();
  const staff = (user?.role || "").toUpperCase() === "GARAGE_STAFF";
  const [org, setOrg] = useState<Organization | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const garage = await endpoints.myGarage();
        if (cancelled) return;
        setOrg(garage);
        if (!staff) {
          const [reportRows, members] = await Promise.all([endpoints.myReports(), endpoints.garageStaff()]);
          if (cancelled) return;
          setReports(reportRows);
          setStaffCount(members.length);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Garage profile could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [staff]);

  return (
    <DashboardFrame
      title={staff ? "Garage home" : "Manager overview"}
      subtitle={
        staff
          ? "Look up a vehicle, then record a service or inspection."
          : "Your garage or dealership, staff, and membership."
      }
    >
      <div className="space-y-5">
        {loading ? <DashboardSkeleton /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {!loading && !staff ? (
          <>
            <StatGrid
              items={[
                { label: "Staff", value: staffCount },
                { label: "Reports", value: reports.length },
                { label: "Status", value: org?.status || "—" },
              ]}
            />
            <BarChart
              title="Generated report scores"
              items={[...reports]
                .sort((a, b) => a.generated_at.localeCompare(b.generated_at))
                .slice(-8)
                .map((row) => ({ label: formatWhen(row.generated_at).slice(0, 6), value: row.score }))}
            />
          </>
        ) : null}
        {org ? (
          <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-4 shadow-sm">
            <h2 className="m-0 text-[18px] font-bold">{org.name}</h2>
            <p className="m-0 text-[13px] text-[#555]">
              {org.type} · {org.status} · {org.location} · TIN {org.tin}
            </p>
          </section>
        ) : null}
        {staff ? (
          <>
            <VehicleSearchForm />
            <div className="flex flex-wrap gap-3">
              <Link href="/garage/records/new" className="ac-btn gap-2 px-5 no-underline active:scale-[0.98]">
                <Wrench size={16} />
                Add service record
              </Link>
              <Link href="/garage/inspections/new" className="ac-btn gap-2 px-5 no-underline active:scale-[0.98]">
                <ClipboardCheck size={16} />
                New inspection
              </Link>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { href: "/garage/staff", title: "Staff management", text: "Invite mechanics and turn accounts on or off.", icon: <Users size={18} /> },
              { href: "/dealer/inventory", title: "Dealer inventory", text: "Look up cars in the registry by VIN or plate.", icon: <Warehouse size={18} /> },
              { href: "/dealer/reports", title: "Bulk reports", text: "Open reports you have already generated.", icon: <Files size={18} /> },
              { href: "/dealer/application", title: "Membership application", text: "Submit a garage or dealer onboarding request.", icon: <FilePlus size={18} /> },
              { href: "/garage/settings", title: "Garage profile", text: "Business name, TIN, and approval status.", icon: <Settings size={18} /> },
            ].map((item) => (
              <ActionCard key={item.href} {...item} />
            ))}
          </div>
        )}
      </div>
    </DashboardFrame>
  );
}
