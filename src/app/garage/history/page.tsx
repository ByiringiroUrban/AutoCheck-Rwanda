"use client";

import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HistoryTimeline } from "@/components/HistoryTimeline";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, fieldClass } from "@/components/ui";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import type { TimelineItem, Vehicle } from "@/types/api";
import { STAFF_ROLES } from "@/utils/roles";

export default function GarageHistoryPage() {
  return (
    <ProtectedRoute allow={STAFF_ROLES}>
      <HistoryBody />
    </ProtectedRoute>
  );
}

function HistoryBody() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    try {
      const found = await lookupVehicle("vin", String(data.get("vin") || ""));
      setVehicle(found);
      setItems(await endpoints.vehicleTimeline(found.id));
    } catch (err) {
      setVehicle(null);
      setItems([]);
      setError(friendlySearchError(err));
    }
  };

  return (
    <DashboardFrame title="Recent garage history" subtitle="Look up a VIN to see the service, inspection, and registry events already stored.">
      <div className="max-w-2xl space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <form method="post" onSubmit={find} className="flex flex-col gap-3 sm:flex-row">
          <input name="vin" required maxLength={17} placeholder="VIN" className={fieldClass} />
          <button type="submit" className="ac-btn px-5">Look up</button>
        </form>
        {vehicle ? <VehicleIdentityCard vehicle={vehicle} mask={false} /> : null}
        {vehicle ? <HistoryTimeline items={items} /> : null}
      </div>
    </DashboardFrame>
  );
}
