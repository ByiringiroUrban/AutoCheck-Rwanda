"use client";

import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import { OWNER_ROLES } from "@/utils/roles";

export default function OwnerSettingsPage() {
  return (
    <ProtectedRoute allow={OWNER_ROLES}>
      <SettingsBody />
    </ProtectedRoute>
  );
}

function SettingsBody() {
  const { user, refreshUser } = useAuth();
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setNote(null);
    const password = String(data.get("password") || "");
    try {
      await endpoints.updateMe({
        first_name: String(data.get("first_name") || ""),
        last_name: String(data.get("last_name") || ""),
        phone: String(data.get("phone") || "") || undefined,
        password: password || undefined,
      });
      await refreshUser();
      setNote("Profile saved.");
    } catch (err) {
      setError(
        err instanceof ApiError && (err.status === 404 || err.status === 405)
          ? "The profile update endpoint is not available on this API. Your sign-in details are unchanged."
          : err instanceof ApiError
            ? err.message
            : "Profile could not be saved.",
      );
    }
  };

  return (
    <DashboardFrame title="Profile and security" subtitle="Name, phone, and password for this owner account.">
      <form method="post" onSubmit={saveProfile} className="max-w-xl space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
        <p className="m-0 text-[13px] text-[#666]">
          Signed in as {user?.email}. Role: {user?.role}.
        </p>
        <input name="first_name" defaultValue={user?.first_name} className={fieldClass} aria-label="First name" />
        <input name="last_name" defaultValue={user?.last_name} className={fieldClass} aria-label="Last name" />
        <input name="phone" defaultValue={user?.phone || ""} className={fieldClass} aria-label="Phone" />
        <input name="password" type="password" placeholder="New password (optional)" className={fieldClass} autoComplete="new-password" />
        {note ? <Alert tone="ok">{note}</Alert> : null}
        {error ? <Alert>{error}</Alert> : null}
        <button type="submit" className="ac-btn px-5">
          Save profile
        </button>
      </form>
    </DashboardFrame>
  );
}
