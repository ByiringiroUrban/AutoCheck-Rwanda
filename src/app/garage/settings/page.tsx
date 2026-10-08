"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { FieldLabel, ProfileLayout, profileFieldClass } from "@/components/dashboard/ProfileLayout";
import { Panel } from "@/components/dashboard/kit";
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
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints
      .myGarage()
      .then(setOrg)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Garage profile could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setNote(null);
    try {
      const updated = await endpoints.updateMyGarage({
        name: String(data.get("name") || ""),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        location: String(data.get("location") || ""),
      });
      setOrg(updated);
      setNote("Garage profile saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The garage profile could not be saved.");
    }
  };

  return (
    <DashboardFrame title="Garage profile" subtitle="The business record tied to this manager account.">
      {loading ? <Spinner /> : null}
      {error ? <Alert>{error}</Alert> : null}
      {note ? <Alert tone="ok">{note}</Alert> : null}
      {org ? (
        <ProfileLayout name={org.name} email={org.email} badge={org.status} detail={`${org.type} · TIN ${org.tin}`}>
          <PendingForm onSubmit={save}>
            <Panel title="Business details" subtitle="Name, contact, and location shown on service records.">
              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel label="Garage name">
                    <input name="name" defaultValue={org.name} required className={profileFieldClass} />
                  </FieldLabel>
                </div>
                <FieldLabel label="TIN">
                  <span className="flex h-10 items-center rounded-lg border border-solid border-[#e3ebeb] bg-[#f4f8f8] px-3 text-[14px]">{org.tin}</span>
                </FieldLabel>
                <FieldLabel label="Phone">
                  <span className="relative block">
                    <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8686]" />
                    <input name="phone" defaultValue={org.phone} required className={`${profileFieldClass} pl-9`} />
                  </span>
                </FieldLabel>
                <FieldLabel label="Email">
                  <span className="relative block">
                    <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8686]" />
                    <input name="email" type="email" defaultValue={org.email} required className={`${profileFieldClass} pl-9`} />
                  </span>
                </FieldLabel>
                <div className="sm:col-span-2">
                  <FieldLabel label="Location">
                    <span className="relative block">
                      <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8686]" />
                      <input name="location" defaultValue={org.location} required className={`${profileFieldClass} pl-9`} />
                    </span>
                  </FieldLabel>
                </div>
              </div>
            </Panel>
            <div className="mt-4">
              <SubmitButton busyLabel="Saving…">Save garage profile</SubmitButton>
            </div>
          </PendingForm>
        </ProfileLayout>
      ) : null}
    </DashboardFrame>
  );
}
