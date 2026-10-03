"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { useAuth } from "@/hooks/useAuth";
import { PLATFORM_ROLES } from "@/utils/roles";

const RULES = [
  ["Base score", "100"],
  ["Severe incident", "−25"],
  ["Major incident", "−15"],
  ["Odometer rollback", "−20"],
  ["Service categories", "Routine maintenance, oil change, brake service, major repair"],
  ["Inspection areas", "Engine, brakes, suspension, tires, electrical, exterior, interior"],
];

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute allow={PLATFORM_ROLES}>
      <Settings />
    </ProtectedRoute>
  );
}

function Settings() {
  const { user } = useAuth();
  const superAdmin = (user?.role || "").toUpperCase() === "SUPER_ADMIN";

  return (
    <DashboardFrame
      title={superAdmin ? "System configurations" : "Reference data and rules"}
      subtitle="The scoring rules shipped with this API. There is no settings endpoint to change them from the console."
    >
      <dl className="max-w-2xl rounded-[8px] bg-white p-5 shadow-sm">
        {RULES.map(([label, value]) => (
          <div key={label} className="grid grid-cols-1 gap-1 border-b border-solid border-[#eee] py-3 sm:grid-cols-3">
            <dt className="font-semibold text-[#555]">{label}</dt>
            <dd className="m-0 sm:col-span-2">{value}</dd>
          </div>
        ))}
      </dl>
    </DashboardFrame>
  );
}
