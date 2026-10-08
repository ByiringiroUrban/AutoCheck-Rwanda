"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, Spinner, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { OrganizationMember } from "@/types/api";
import { MANAGER_ROLES } from "@/utils/roles";

export default function GarageStaffPage() {
  return (
    <ProtectedRoute allow={MANAGER_ROLES}>
      <StaffBody />
    </ProtectedRoute>
  );
}

function StaffBody() {
  const [rows, setRows] = useState<OrganizationMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await endpoints.garageStaff();
    setRows(data);
  };

  useEffect(() => {
    endpoints
      .garageStaff()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Staff could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const [first, ...rest] = String(data.get("name") || "").trim().split(/\s+/);
    setError(null);
    try {
      await endpoints.inviteStaff({
        first_name: first || "Staff",
        last_name: rest.join(" ") || "Member",
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || "") || undefined,
        role: String(data.get("role") || "STAFF"),
      });
      setNote("Invitation saved.");
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The invitation could not be sent.");
    }
  };

  const toggle = async (member: OrganizationMember) => {
    try {
      await endpoints.updateStaff(member.id, { status: member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Status could not be changed.");
    }
  };

  return (
    <DashboardFrame title="Garage staff" subtitle="Invite a mechanic or change whether an existing member is active.">
      <div className="space-y-5">
        {loading ? <Spinner /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {note ? <Alert tone="ok">{note}</Alert> : null}
        <DataTable
          rows={rows}
          empty="No staff are linked to your garage yet."
          getSearchText={(row) => `${row.user?.email || ""} ${row.user?.first_name || ""} ${row.role} ${row.status}`}
          columns={[
            {
              key: "name",
              header: "Name",
              render: (row) => (row.user ? `${row.user.first_name} ${row.user.last_name}` : row.user_id),
            },
            { key: "email", header: "Email", render: (row) => row.user?.email || "—" },
            { key: "role", header: "Role", render: (row) => row.role },
            { key: "status", header: "Status", render: (row) => row.status },
          ]}
          rowActions={(row) => [
            {
              label: row.status === "ACTIVE" ? "Deactivate" : "Activate",
              danger: row.status === "ACTIVE",
              onClick: () => toggle(row),
            },
          ]}
        />
        <PendingForm onSubmit={invite} className="grid max-w-xl grid-cols-1 gap-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-4 sm:grid-cols-2">
          <h2 className="m-0 sm:col-span-2 text-[16px] font-bold">Invite staff</h2>
          <input name="name" required placeholder="Full name" className={fieldClass} />
          <input name="email" type="email" required placeholder="Email" className={fieldClass} />
          <input name="phone" placeholder="Phone" className={fieldClass} />
          <select name="role" className={fieldClass} defaultValue="STAFF">
            <option value="STAFF">Staff</option>
            <option value="MANAGER">Manager</option>
          </select>
          <SubmitButton busyLabel="Sending…" className="ac-btn px-5 sm:col-span-2">
            Send invite
          </SubmitButton>
        </PendingForm>
      </div>
    </DashboardFrame>
  );
}
