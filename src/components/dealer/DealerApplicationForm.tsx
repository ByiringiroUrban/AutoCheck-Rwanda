"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { Alert, fieldClass } from "@/components/ui";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { FormSection } from "@/components/form/FormUI";

type ApplicantType = "INDIVIDUAL" | "ORGANIZATION";

export function DealerApplicationForm() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [applicantType, setApplicantType] = useState<ApplicantType>("INDIVIDUAL");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    try {
      await endpoints.applyOrganization({
        type: "DEALER",
        applicant_type: applicantType,
        ...(applicantType === "ORGANIZATION"
          ? {
              name: String(data.get("name") || ""),
              tin: String(data.get("tin") || ""),
              location: String(data.get("location") || ""),
            }
          : {}),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The dealer application could not be submitted.");
    }
  };

  if (isLoading) return <p className="text-sm text-[#555]">Checking your account…</p>;

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-3">
        <Alert tone="info">Sign in or create an AutoCheck account before requesting dealer access.</Alert>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link className="font-semibold text-ac-blue underline" href="/vehiclehistory/login">Sign in</Link>
          <Link className="font-semibold text-ac-blue underline" href="/vehiclehistory/register">Create an account</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <Alert tone="ok">
        Your dealer access request has been submitted for review. If approved, dealer access will be enabled for this account.
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <p className="m-0 text-[14px] text-[#555]">
        Applying as {user.first_name} {user.last_name} ({user.email})
      </p>
      {error ? <Alert>{error}</Alert> : null}
      <PendingForm onSubmit={onSubmit} className="space-y-4">
        <label className="block text-[13px] font-semibold">
          Applicant type
          <select
            name="applicant_type"
            value={applicantType}
            onChange={(event) =>
              setApplicantType(event.target.value === "ORGANIZATION" ? "ORGANIZATION" : "INDIVIDUAL")
            }
            className={`${fieldClass} mt-1`}
          >
            <option value="INDIVIDUAL">Individual dealer</option>
            <option value="ORGANIZATION">Dealer with an organization</option>
          </select>
        </label>

        {applicantType === "ORGANIZATION" ? (
          <FormSection
            title="Organization details"
            description="Provide your registered business details. These fields are not needed for individual applications."
          >
            <div className="space-y-3">
              <input name="name" required minLength={2} placeholder="Organization / dealership name" className={fieldClass} />
              <input name="tin" required minLength={5} placeholder="Organization TIN" className={fieldClass} />
              <input name="location" required minLength={2} placeholder="Business location" className={fieldClass} />
            </div>
          </FormSection>
        ) : null}

        <label className="block text-[13px] font-semibold">
          Contact email
          <input
            name="email"
            type="email"
            required
            defaultValue={user.email}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <label className="block text-[13px] font-semibold">
          Contact phone
          <input
            name="phone"
            type="tel"
            required
            minLength={6}
            defaultValue={user.phone || ""}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <SubmitButton busyLabel="Submitting…">Submit dealer access request</SubmitButton>
      </PendingForm>
    </div>
  );
}
