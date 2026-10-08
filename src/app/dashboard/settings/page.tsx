"use client";

import { useState, type FormEvent } from "react";
import { Lock, Mail, Phone, UserRound } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { FieldLabel, ProfileLayout, profileFieldClass } from "@/components/dashboard/ProfileLayout";
import { Panel } from "@/components/dashboard/kit";
import { Alert } from "@/components/ui";
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
    const newPassword = String(data.get("new_password") || "");
    const oldPassword = String(data.get("old_password") || "");
    try {
      await endpoints.updateMe({
        first_name: String(data.get("first_name") || ""),
        last_name: String(data.get("last_name") || ""),
        phone: String(data.get("phone") || "") || undefined,
        old_password: newPassword ? oldPassword : undefined,
        new_password: newPassword || undefined,
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

  const name = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Owner";

  return (
    <DashboardFrame title="Profile and security" subtitle="Name, phone, and password for this account.">
      <ProfileLayout name={name} email={user?.email} badge={user?.role || "OWNER"} detail="Signed in on this browser.">
        <PendingForm onSubmit={saveProfile} className="space-y-4">
          <Panel title="Personal details" subtitle="The name and phone stored on this account.">
            <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
              <FieldLabel label="First name">
                <span className="relative block">
                  <UserRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8686]" />
                  <input name="first_name" defaultValue={user?.first_name} className={`${profileFieldClass} pl-9`} />
                </span>
              </FieldLabel>
              <FieldLabel label="Last name">
                <input name="last_name" defaultValue={user?.last_name} className={profileFieldClass} />
              </FieldLabel>
              <FieldLabel label="Email">
                <span className="flex h-10 items-center gap-2 rounded-lg border border-solid border-[#e3ebeb] bg-[#f4f8f8] px-3 text-[14px] text-ac-ink">
                  <Mail size={15} className="text-[#7a8686]" />
                  {user?.email}
                </span>
              </FieldLabel>
              <FieldLabel label="Phone">
                <span className="relative block">
                  <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8686]" />
                  <input name="phone" defaultValue={user?.phone || ""} className={`${profileFieldClass} pl-9`} />
                </span>
              </FieldLabel>
            </div>
          </Panel>
          <Panel title="Password" subtitle="Leave these blank if you only want to update your name or phone.">
            <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
              <FieldLabel label="Current password">
                <span className="relative block">
                  <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8686]" />
                  <input name="old_password" type="password" autoComplete="current-password" className={`${profileFieldClass} pl-9`} />
                </span>
              </FieldLabel>
              <FieldLabel label="New password">
                <input name="new_password" type="password" autoComplete="new-password" className={profileFieldClass} />
              </FieldLabel>
            </div>
          </Panel>
          {note ? <Alert tone="ok">{note}</Alert> : null}
          {error ? <Alert>{error}</Alert> : null}
          <SubmitButton busyLabel="Saving…">Save profile</SubmitButton>
        </PendingForm>
      </ProfileLayout>
    </DashboardFrame>
  );
}
