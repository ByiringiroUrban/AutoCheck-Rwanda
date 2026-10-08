"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HistoryTimeline } from "@/components/HistoryTimeline";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import type { TimelineItem, Vehicle } from "@/types/api";
import { GARAGE_ROLES } from "@/utils/roles";

export default function GarageHistoryPage() {
  return (
    <ProtectedRoute allow={GARAGE_ROLES}>
      <Suspense>
        <HistoryBody />
      </Suspense>
    </ProtectedRoute>
  );
}

function HistoryBody() {
  const params = useSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadVin = async (vin: string) => {
    setError(null);
    try {
      const found = await lookupVehicle("vin", vin);
      setVehicle(found);
      setItems(await endpoints.vehicleTimeline(found.id));
    } catch (err) {
      setVehicle(null);
      setItems([]);
      setError(friendlySearchError(err));
    }
  };

  useEffect(() => {
    const vin = params.get("vin");
    if (vin) void loadVin(vin);
    // The query string is the only trigger for the automatic lookup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

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
        <PendingForm onSubmit={find} className="flex flex-col gap-3 sm:flex-row">
          <input name="vin" required maxLength={17} placeholder="VIN" defaultValue={params.get("vin") || ""} className={fieldClass} />
          <SubmitButton busyLabel="Looking up…">Look up</SubmitButton>
        </PendingForm>
        {vehicle ? <VehicleIdentityCard vehicle={vehicle} mask={false} /> : null}
        {vehicle ? <HistoryTimeline items={items} /> : null}
      </div>
    </DashboardFrame>
  );
}
