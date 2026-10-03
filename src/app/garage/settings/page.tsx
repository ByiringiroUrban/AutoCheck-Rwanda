"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, Spinner } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Organization } from "@/types/api";
import { MANAGER_ROLES } from "@/utils/roles";

export default function GarageSettingsPage() {
  return (
    <ProtectedRoute allow={MANAGER_ROLES}>
      <ProfileBody />
    </ProtectedRoute>
  );
}

function ProfileBody() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints
      .myGarage()
      .then(setOrg)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Garage profile could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardFrame title="Garage profile" subtitle="The business record tied to this manager account.">
      {loading ? <Spinner /> : null}
      {error ? <Alert>{error}</Alert> : null}
      {org ? (
        <dl className="max-w-xl rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
          {[
            ["Name", org.name],
            ["Type", org.type],
            ["Status", org.status],
            ["TIN", org.tin],
            ["Location", org.location],
            ["Email", org.email],
            ["Phone", org.phone],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-3 gap-2 border-b border-solid border-[#eee] py-2 text-[14px]">
              <dt className="font-semibold text-[#666]">{label}</dt>
              <dd className="col-span-2 m-0">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </DashboardFrame>
  );
}
