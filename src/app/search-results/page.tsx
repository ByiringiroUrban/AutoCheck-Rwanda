"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell, Alert, PageHeading, Spinner } from "@/components/ui";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import { useAuth } from "@/hooks/useAuth";
import type { Vehicle } from "@/types/api";

function SearchResultsBody() {
  const params = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const vin = params.get("vin") || "";
  const plate = params.get("plate") || "";
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const found = vin ? await lookupVehicle("vin", vin) : plate ? await lookupVehicle("plate", plate) : null;
        if (!cancelled) {
          if (!found) setError("Enter a VIN or Rwanda plate to search.");
          setVehicle(found);
        }
      } catch (err) {
        if (!cancelled) setError(friendlySearchError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [plate, vin]);

  const viewReport = async () => {
    if (!vehicle) return;
    setBuying(true);
    setError(null);
    try {
      const report = await endpoints.generateReport(vehicle.id);
      router.push(`/reports/${report.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The report could not be generated.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <AppShell>
      <PageHeading title="Vehicle match" subtitle="Confirm this is the vehicle before you open a history report." />
      <div className="ac-container mt-6 space-y-4">
        {loading ? <Spinner label="Searching the registry…" /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {vehicle ? (
          <>
            <VehicleIdentityCard vehicle={vehicle} />
            <div className="flex flex-wrap gap-3">
              <button type="button" className="ac-btn px-5" onClick={() => void viewReport()} disabled={buying}>
                {buying ? "Building report…" : "View full report"}
              </button>
              <Link
                href={isAuthenticated ? `/dashboard/my-vehicles?vin=${encodeURIComponent(vehicle.vin)}` : "/vehiclehistory/login"}
                className="ac-btn px-5 no-underline"
              >
                Claim ownership
              </Link>
              <Link
                href={isAuthenticated ? `/support/dispute?vin=${encodeURIComponent(vehicle.vin)}` : "/vehiclehistory/login"}
                className="inline-flex items-center text-[14px] font-semibold text-ac-blue"
              >
                Submit a correction
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="ac-container py-10">
            <Spinner />
          </div>
        </AppShell>
      }
    >
      <SearchResultsBody />
    </Suspense>
  );
}
