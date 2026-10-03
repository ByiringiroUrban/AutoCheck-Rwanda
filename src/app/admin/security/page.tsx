"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { useAuth } from "@/hooks/useAuth";
import { SUPER_ROLES } from "@/utils/roles";

export default function SecurityPage() {
  return (
    <ProtectedRoute allow={SUPER_ROLES}>
      <Security />
    </ProtectedRoute>
  );
}

function Security() {
  const { user } = useAuth();

  return (
    <DashboardFrame title="Security and API keys" subtitle="Session for this browser. The live API does not issue or rotate API keys.">
      <div className="max-w-xl space-y-3 rounded-[8px] bg-white p-5 text-[14px] shadow-sm">
        <p className="m-0">Signed in as {user?.email}.</p>
        <p className="m-0">Role: {user?.role}.</p>
        <p className="m-0">
          Access is a bearer token stored in this browser. Sign out removes it from this device. There is no API-key screen because the backend does not expose one.
        </p>
      </div>
    </DashboardFrame>
  );
}
