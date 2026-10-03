"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import type { Vehicle } from "@/types/api";
import { MANAGER_ROLES } from "@/utils/roles";

export default function DealerInventoryPage() {
  return (
    <ProtectedRoute allow={MANAGER_ROLES}>
      <InventoryBody />
    </ProtectedRoute>
  );
}

function InventoryBody() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setReportId(null);
    const vin = String(data.get("vin") || "").trim();
    const plate = String(data.get("plate") || "").trim();
    try {
      const found = vin ? await lookupVehicle("vin", vin) : await lookupVehicle("plate", plate);
      setVehicle(found);
    } catch (err) {
      setVehicle(null);
      setError(friendlySearchError(err));
    }
  };

  const openReport = async () => {
    if (!vehicle) return;
    setError(null);
    try {
      const report = await endpoints.generateReport(vehicle.id);
      setReportId(report.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The report could not be generated.");
    }
  };

  return (
    <DashboardFrame title="Dealer inventory" subtitle="Find a stock vehicle by VIN or plate. A full inventory list is not provided by the live API.">
      <div className="max-w-xl space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <form method="post" onSubmit={find} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
          <input name="vin" maxLength={17} placeholder="VIN" className={fieldClass} />
          <input name="plate" placeholder="Or Rwanda plate" className={fieldClass} />
          <button type="submit" className="ac-btn px-5">Find vehicle</button>
        </form>
        {vehicle ? (
          <div className="space-y-3">
            <VehicleIdentityCard vehicle={vehicle} mask={false} />
            <button type="button" className="ac-btn px-5" onClick={() => void openReport()}>
              Generate history report
            </button>
            {reportId ? (
              <Link href={`/reports/${reportId}`} className="block font-semibold text-ac-blue">
                Open report
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </DashboardFrame>
  );
}
