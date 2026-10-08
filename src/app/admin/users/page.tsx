"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/DataTable";
import { DashboardFrame } from "@/components/DashboardFrame";
import { PendingForm, SubmitButton } from "@/components/dashboard/actions";
import { Alert, fieldClass } from "@/components/ui";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/api";
import { PLATFORM_ROLES } from "@/utils/roles";

const ROLES = ["OWNER", "GARAGE_STAFF", "GARAGE_MANAGER", "DEALER", "ADMIN", "SUPER_ADMIN"];

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allow={PLATFORM_ROLES}>
      <UsersBody />
    </ProtectedRoute>
  );
}

function UsersBody() {
  const { user } = useAuth();
  const superAdmin = (user?.role || "").toUpperCase() === "SUPER_ADMIN";
  const [rows, setRows] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const load = async (nextSearch = search, nextRole = role) => {
    const page = await endpoints.adminUsers({
      search: nextSearch || undefined,
      role: nextRole || undefined,
    });
    setRows(page.items);
    setNote(`${page.total} accounts · page ${page.page} of ${page.pages}`);
  };

  useEffect(() => {
    load().catch((err: unknown) => {
      setRows([]);
      setError(err instanceof ApiError ? err.message : "Users could not be loaded.");
    });
    // Initial directory load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    try {
      await endpoints.updateAdminUser(String(data.get("id") || ""), {
        role: String(data.get("role") || "") || undefined,
        status: String(data.get("status") || "") || undefined,
      });
      setNote("User update sent.");
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError && (err.status === 404 || err.status === 405)
          ? "User role updates are not available on this API."
          : err instanceof ApiError
            ? err.message
            : "The user could not be updated.",
      );
    }
  };

  return (
    <DashboardFrame
      title={superAdmin ? "Users and role assignment" : "User management"}
      subtitle={superAdmin ? "Grant or revoke platform roles." : "Review accounts. Assigning roles is a super-admin action."}
    >
      <div className="space-y-4">
        {note ? <Alert tone="info">{note}</Alert> : null}
        {error ? <Alert>{error}</Alert> : null}
        <PendingForm
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={() => load().catch((err: unknown) => setError(err instanceof ApiError ? err.message : "Users could not be loaded."))}
        >
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className={fieldClass} />
          <select value={role} onChange={(event) => setRole(event.target.value)} className={fieldClass}>
            <option value="">All roles</option>
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <SubmitButton busyLabel="Searching…">Search</SubmitButton>
        </PendingForm>
        <DataTable
          rows={rows}
          empty="No user rows were returned."
          getSearchText={(row) => `${row.email} ${row.first_name} ${row.last_name} ${row.role}`}
          columns={[
            { key: "name", header: "Name", render: (row) => `${row.first_name} ${row.last_name}` },
            { key: "email", header: "Email", render: (row) => row.email },
            { key: "role", header: "Role", render: (row) => row.role },
            { key: "status", header: "Status", render: (row) => row.status },
          ]}
        />
        {superAdmin ? (
          <PendingForm onSubmit={updateUser} className="grid max-w-xl grid-cols-1 gap-3 rounded-[8px] bg-white p-4 sm:grid-cols-3">
            <input name="id" required placeholder="User id" className={fieldClass} />
            <select name="role" className={fieldClass} defaultValue="OWNER">
              {ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
            <select name="status" className={fieldClass} defaultValue="ACTIVE">
              <option>ACTIVE</option>
              <option>SUSPENDED</option>
              <option>PENDING</option>
            </select>
            <SubmitButton busyLabel="Updating…" className="ac-btn px-5 sm:col-span-3">
              Update user
            </SubmitButton>
          </PendingForm>
        ) : null}
      </div>
    </DashboardFrame>
  );
}
