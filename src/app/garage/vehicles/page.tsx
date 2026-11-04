"use client";

import { useState, type FormEvent } from "react";
import { CarFront, Search } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { FormActions, FormField, FormGrid, FormSection } from "@/components/form/FormUI";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { friendlySearchError, lookupVehicle } from "@/hooks/useVehicleSearch";
import type { Vehicle } from "@/types/api";
import { MANAGER_ROLES } from "@/utils/roles";
import { validateVin } from "@/utils/validation";

export default function GarageVehiclesPage() {
  return (
    <ProtectedRoute allow={MANAGER_ROLES}>
      <VehiclesBody />
    </ProtectedRoute>
  );
}

function VehiclesBody() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);
  const [searchVin, setSearchVin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const find = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vin = String(data.get("vin") || "").trim();
    setSearchVin(vin);
    setError(null);
    setNote(null);
    setCreating(false);
    try {
      setVehicle(await lookupVehicle("vin", vin));
    } catch (err) {
      setVehicle(null);
      if (err instanceof ApiError && err.status === 404) setCreating(true);
      setError(friendlySearchError(err));
    }
  };

  const createIdentity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vin = validateVin(String(data.get("vin") || ""));
    if (!vin.ok || !vin.value) {
      setError(vin.message || "Enter a valid VIN.");
      return;
    }
    try {
      const created = await endpoints.createVehicle({
        vin: vin.value,
        make: String(data.get("make") || ""),
        model: String(data.get("model") || ""),
        year: Number(data.get("year") || 0),
        body_type: String(data.get("body_type") || "SEDAN"),
        fuel_type: String(data.get("fuel_type") || "PETROL"),
        color: String(data.get("color") || "UNKNOWN"),
        initial_plate: String(data.get("plate") || "") || undefined,
      });
      setVehicle(created);
      setCreating(false);
      setError(null);
      const photo = data.get("photo");
      if (photo instanceof File && photo.size > 0) {
        try {
          await endpoints.uploadImage(created.id, photo, "FRONT", "GARAGE");
          setNote("Vehicle registered and photo added.");
        } catch (err) {
          setNote(
            err instanceof ApiError
              ? `Vehicle registered, but the photo could not be uploaded: ${err.message}`
              : "Vehicle registered, but the photo could not be uploaded. You can add it later.",
          );
        }
      } else {
        setNote("Vehicle identity saved.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The vehicle could not be created.");
    }
  };

  const uploadVehiclePhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicle) return;
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const photo = data.get("photo");
    if (!(photo instanceof File) || photo.size === 0) {
      setError("Choose a vehicle photo to upload.");
      return;
    }
    setError(null);
    try {
      await endpoints.uploadImage(vehicle.id, photo, "FRONT", "GARAGE");
      setNote("Vehicle photo uploaded. Generate a new report to include it.");
      form.reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The vehicle photo could not be uploaded.");
    }
  };

  return (
    <DashboardFrame
      title="Find or register a vehicle"
      subtitle="Search the vehicle registry first. If the VIN is new, add the vehicle details to create its registry record."
    >
      <div className="mx-auto max-w-4xl space-y-5">
        {error ? <Alert>{creating ? "No vehicle was found for this VIN. Add its details below to register it." : error}</Alert> : null}
        {note ? <Alert tone="ok">{note}</Alert> : null}
        <PendingForm onSubmit={find}>
          <FormSection
            title="1. Search the registry"
            description="Enter the vehicle identification number (VIN) to check whether the vehicle is already registered."
          >
            <FormGrid className="sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <FormField
                label="Vehicle identification number (VIN)"
                htmlFor="vehicle-lookup-vin"
                hint="A VIN contains 17 letters and numbers."
              >
                <input
                  id="vehicle-lookup-vin"
                  name="vin"
                  required
                  maxLength={17}
                  autoCapitalize="characters"
                  autoComplete="off"
                  placeholder="e.g. JH4TB2H26CC000000"
                  className={fieldClass}
                />
              </FormField>
              <div className="sm:pb-6">
                <SubmitButton busyLabel="Searching…" className="ac-btn w-full gap-2 px-5 sm:w-auto">
                  <Search size={16} aria-hidden="true" />
                  Search vehicles
                </SubmitButton>
              </div>
            </FormGrid>
          </FormSection>
        </PendingForm>
        {creating ? (
          <PendingForm onSubmit={createIdentity}>
            <FormSection
              title="2. Add vehicle details"
              description="Complete the required information. You can add the current plate and other identifying details if available."
            >
              <FormGrid>
                <FormField label="VIN" htmlFor="vehicle-create-vin" hint="Use the same VIN you searched for.">
                  <input
                    id="vehicle-create-vin"
                    name="vin"
                    required
                    maxLength={17}
                    defaultValue={searchVin}
                    autoCapitalize="characters"
                    autoComplete="off"
                    placeholder="17-character VIN"
                    className={fieldClass}
                  />
                </FormField>
                <FormField label="Year" htmlFor="vehicle-create-year">
                  <input
                    id="vehicle-create-year"
                    name="year"
                    required
                    type="number"
                    min={1900}
                    max={2100}
                    placeholder="e.g. 2022"
                    className={fieldClass}
                  />
                </FormField>
                <FormField label="Make" htmlFor="vehicle-create-make">
                  <input id="vehicle-create-make" name="make" required placeholder="e.g. Toyota" className={fieldClass} />
                </FormField>
                <FormField label="Model" htmlFor="vehicle-create-model">
                  <input id="vehicle-create-model" name="model" required placeholder="e.g. Corolla" className={fieldClass} />
                </FormField>
                <FormField label="Current plate" htmlFor="vehicle-create-plate" hint="Optional">
                  <input
                    id="vehicle-create-plate"
                    name="plate"
                    autoComplete="off"
                    placeholder="e.g. RAA 123 A"
                    className={fieldClass}
                  />
                </FormField>
                <FormField label="Body type" htmlFor="vehicle-create-body-type" hint="Optional">
                  <input id="vehicle-create-body-type" name="body_type" defaultValue="SEDAN" className={fieldClass} />
                </FormField>
                <FormField label="Fuel type" htmlFor="vehicle-create-fuel-type" hint="Optional">
                  <input id="vehicle-create-fuel-type" name="fuel_type" defaultValue="PETROL" className={fieldClass} />
                </FormField>
                <FormField label="Colour" htmlFor="vehicle-create-color" hint="Optional">
                  <input id="vehicle-create-color" name="color" placeholder="e.g. White" className={fieldClass} />
                </FormField>
                <FormField label="Vehicle photo" htmlFor="vehicle-create-photo" hint="Optional · JPG, PNG, or WebP">
                  <input
                    id="vehicle-create-photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={fieldClass}
                  />
                </FormField>
              </FormGrid>
              <FormActions>
                <SubmitButton busyLabel="Registering vehicle…" className="ac-btn gap-2 px-5">
                  <CarFront size={16} aria-hidden="true" />
                  Register vehicle
                </SubmitButton>
              </FormActions>
            </FormSection>
          </PendingForm>
        ) : null}
        {vehicle ? (
          <div className="space-y-4">
            <VehicleIdentityCard vehicle={vehicle} mask={false} />
            <PendingForm onSubmit={uploadVehiclePhoto}>
              <FormSection title="Add a vehicle photo" description="Upload a clear photo so it can appear on reports generated for this vehicle.">
                <FormGrid className="sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <FormField label="Vehicle photo" htmlFor="vehicle-photo" hint="JPG, PNG, or WebP">
                    <input
                      id="vehicle-photo"
                      name="photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      required
                      className={fieldClass}
                    />
                  </FormField>
                  <FormActions>
                    <SubmitButton busyLabel="Uploading…" className="ac-btn w-full gap-2 px-5 sm:w-auto">
                      <CarFront size={16} aria-hidden="true" />
                      Upload photo
                    </SubmitButton>
                  </FormActions>
                </FormGrid>
              </FormSection>
            </PendingForm>
          </div>
        ) : null}
      </div>
    </DashboardFrame>
  );
}
