"use client";

import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { MANAGER_ROLES } from "@/utils/roles";

export default function DealerApplicationPage() {
  return (
    <ProtectedRoute allow={MANAGER_ROLES}>
      <ApplicationBody />
    </ProtectedRoute>
  );
}

function ApplicationBody() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    try {
      await endpoints.applyOrganization({
        name: String(data.get("name") || ""),
        type: String(data.get("type") || "DEALER"),
        tin: String(data.get("tin") || ""),
        location: String(data.get("location") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The application could not be submitted.");
    }
  };

  return (
    <DashboardFrame title="Membership application" subtitle="Submit a garage or dealer business for INGOGA AUTO review.">
      {done ? <Alert tone="ok">Application submitted. An administrator reviews TIN, location, and contact details.</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      <PendingForm onSubmit={onSubmit} className="max-w-xl space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-5">
        <input name="name" required placeholder="Business name" className={fieldClass} />
        <select name="type" className={fieldClass} defaultValue="DEALER">
          <option value="DEALER">Dealer</option>
          <option value="GARAGE">Garage</option>
        </select>
        <input name="tin" required placeholder="TIN" className={fieldClass} />
        <input name="location" required placeholder="Location" className={fieldClass} />
        <input name="email" required type="email" placeholder="Business email" className={fieldClass} />
        <input name="phone" required placeholder="Phone" className={fieldClass} />
        <SubmitButton busyLabel="Submitting…">Submit application</SubmitButton>
      </PendingForm>
    </DashboardFrame>
  );
}
