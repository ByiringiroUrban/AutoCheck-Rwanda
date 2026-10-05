"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, fieldClass, Spinner } from "@/components/ui";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setUploadingAvatar(true);
    setError(null);
    setNote(null);

    try {
      const res = await endpoints.uploadAvatar(file);
      await refreshUser();
      setNote("Profile photo uploaded to Cloudinary successfully!");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload profile photo.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;

    setUploadingAvatar(true);
    setError(null);
    setNote(null);

    try {
      await endpoints.deleteAvatar();
      await refreshUser();
      setNote("Profile photo removed.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setNote(null);
    setSavingProfile(true);

    const password = String(data.get("password") || "").trim();
    try {
      await endpoints.updateMe({
        first_name: String(data.get("first_name") || "").trim(),
        last_name: String(data.get("last_name") || "").trim(),
        phone: String(data.get("phone") || "").trim() || undefined,
        password: password || undefined,
      });
      await refreshUser();
      setNote("Profile changes saved successfully.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Profile could not be saved.");
    } finally {
      setSavingProfile(false);
    }
  };

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() || "AC";

  return (
    <DashboardFrame
      title="Profile & Account Settings"
      subtitle="Manage your personal details, Cloudinary profile photo, and password security."
    >
      <div className="max-w-2xl space-y-6">
        {/* Profile Photo Card */}
        <div className="rounded-[10px] border border-solid border-[#e2e8f0] bg-white p-6 shadow-sm">
          <h3 className="m-0 text-[16px] font-bold text-[#0f172a]">Profile Photo</h3>
          <p className="m-0 mt-1 text-[13px] text-[#64748b]">
            Your avatar is stored securely on Cloudinary and displayed across your reports and comments.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-solid border-[#cbd5e1] bg-[#f1f5f9] flex items-center justify-center text-[22px] font-bold text-[#475569] shadow-inner">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              {uploadingAvatar ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <Spinner />
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
                id="avatar-upload-input"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="ac-btn h-[36px] px-4 text-[13px] font-semibold"
                >
                  {uploadingAvatar ? "Uploading to Cloudinary…" : "Upload New Photo"}
                </button>
                {user?.avatar_url ? (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar}
                    className="h-[36px] rounded-[6px] border border-solid border-[#e2e8f0] bg-white px-3 text-[13px] font-medium text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="text-[11px] text-[#94a3b8] m-0">
                Supports JPG, PNG, WebP up to 10MB. Automatically centered and optimized on Cloudinary.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info Form */}
        <form
          method="post"
          onSubmit={saveProfile}
          className="rounded-[10px] border border-solid border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4"
        >
          <div className="border-b border-[#f1f5f9] pb-3">
            <h3 className="m-0 text-[16px] font-bold text-[#0f172a]">Account Details</h3>
            <p className="m-0 mt-1 text-[13px] text-[#64748b]">
              Signed in as <strong>{user?.email}</strong> &bull; Role: <span className="inline-block rounded bg-[#e2e8f0] px-1.5 py-0.5 text-[11px] font-semibold text-[#334155]">{user?.role}</span>
            </p>
          </div>

          {note ? <Alert tone="ok">{note}</Alert> : null}
          {error ? <Alert>{error}</Alert> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="profile-firstname">
                First Name
              </label>
              <input
                id="profile-firstname"
                name="first_name"
                defaultValue={user?.first_name}
                required
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="profile-lastname">
                Last Name
              </label>
              <input
                id="profile-lastname"
                name="last_name"
                defaultValue={user?.last_name}
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="profile-phone">
              Phone Number
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={user?.phone || ""}
              placeholder="+250 788 123 456"
              className={fieldClass}
            />
          </div>

          <div className="pt-2 border-t border-[#f1f5f9]">
            <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="profile-password">
              Change Password <span className="text-[12px] font-normal text-[#94a3b8]">(leave blank to keep current)</span>
            </label>
            <input
              id="profile-password"
              name="password"
              type="password"
              placeholder="Enter new password (min. 6 chars)"
              className={fieldClass}
              autoComplete="new-password"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="ac-btn h-[40px] px-6 text-[14px] font-semibold"
              disabled={savingProfile}
            >
              {savingProfile ? "Saving Changes…" : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardFrame>
  );
}
