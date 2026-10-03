"use client";

import { useAuth } from "@/hooks/useAuth";
import { ADMIN_ROLES, GARAGE_ROLES, OWNER_ROLES, roleAllowed } from "@/utils/roles";

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role ?? "PUBLIC";
  return {
    role,
    isAuthenticated,
    isAdmin: roleAllowed(role, ADMIN_ROLES),
    canUseGarage: roleAllowed(role, GARAGE_ROLES),
    canUseOwnerPortal: roleAllowed(role, OWNER_ROLES),
  };
}
