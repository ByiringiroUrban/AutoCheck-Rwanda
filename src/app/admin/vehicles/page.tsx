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
import { ADMIN_ROLES } from "@/utils/roles";

export default function AdminVehiclesPage() {
  return (
    <ProtectedRoute allow={ADMIN_ROLES}>
      <Registry />
    </ProtectedRoute>
  );
}

function Registry() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vin = String(data.get("vin") || "").trim();
    const plate = String(data.get("plate") || "").trim();
    setError(null);
    try {
      const found = vin ? await lookupVehicle("vin", vin) : await lookupVehicle("plate", plate);
      setVehicle(found);
      setItems(await endpoints.vehicleTimeline(found.id));
    } catch (err) {
      setVehicle(null);
      setItems([]);
      setError(friendlySearchError(err));
    }
  };

  return (
    <DashboardFrame title="Vehicle master registry" subtitle="Look up a VIN or plate and inspect the provenance on each timeline event.">
      <div className="max-w-2xl space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <form method="post" onSubmit={find} className="space-y-3 rounded-[8px] bg-white p-4">
          <input name="vin" maxLength={17} placeholder="VIN" className={fieldClass} />
          <input name="plate" placeholder="Or Rwanda plate" className={fieldClass} />
          <button type="submit" className="ac-btn px-5">Inspect vehicle</button>
        </form>
        {vehicle ? <VehicleIdentityCard vehicle={vehicle} mask={false} /> : null}
        {vehicle ? <HistoryTimeline items={items} /> : null}
      </div>
    </DashboardFrame>
  );
}
