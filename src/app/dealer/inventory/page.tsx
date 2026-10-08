"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { AsyncButton, PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import type { InventoryVehicle, Vehicle } from "@/types/api";
import { ReportPreview } from "@/components/report/ReportPreview";
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
  const [stock, setStock] = useState<InventoryVehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  useEffect(() => {
    endpoints
      .garageInventory()
      .then(setStock)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Inventory could not be loaded."));
  }, []);

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
      setOpenReportId(report.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The report could not be generated.");
    }
  };

  return (
    <DashboardFrame title="Dealer inventory" subtitle="Cars this garage has serviced or inspected, plus a VIN or plate search.">
      <div className="space-y-4">
        <DataTable
          rows={stock}
          empty="No serviced vehicles are linked to this garage yet."
          getSearchText={(row) => `${row.vin} ${row.current_plate || ""} ${row.make} ${row.model}`}
          columns={[
            { key: "vin", header: "VIN", render: (row) => row.vin },
            { key: "plate", header: "Plate", render: (row) => row.current_plate || "—" },
            { key: "year", header: "Year", render: (row) => row.year },
            { key: "car", header: "Vehicle", render: (row) => `${row.make} ${row.model}` },
            { key: "km", header: "Mileage", render: (row) => (row.latest_mileage == null ? "—" : `${row.latest_mileage.toLocaleString()} km`) },
          ]}
          rowActions={(row) => [
            {
              label: "Open report",
              onClick: () =>
                endpoints.generateReport(row.id).then((report) => {
                  setReportId(report.id);
                  setOpenReportId(report.id);
                }),
            },
          ]}
        />
        {error ? <Alert>{error}</Alert> : null}
        <PendingForm onSubmit={find} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
          <input name="vin" maxLength={17} placeholder="VIN" className={fieldClass} />
          <input name="plate" placeholder="Or Rwanda plate" className={fieldClass} />
          <SubmitButton busyLabel="Searching…">Find vehicle</SubmitButton>
        </PendingForm>
        {vehicle ? (
          <div className="space-y-3">
            <VehicleIdentityCard vehicle={vehicle} mask={false} />
            <AsyncButton busyLabel="Generating…" onClick={openReport}>
              Generate history report
            </AsyncButton>
            {reportId ? (
              <button type="button" className="bg-transparent p-0 text-[14px] font-medium text-ac-blue" onClick={() => setOpenReportId(reportId)}>
                Open report
              </button>
            ) : null}
          </div>
        ) : null}
        {openReportId ? <ReportPreview reportId={openReportId} onClose={() => setOpenReportId(null)} /> : null}
      </div>
    </DashboardFrame>
  );
}
