export const OWNER_ROLES = ["OWNER"] as const;
export const STAFF_ROLES = ["GARAGE_STAFF"] as const;
export const MANAGER_ROLES = ["GARAGE_MANAGER", "DEALER"] as const;
export const GARAGE_ROLES = ["GARAGE_STAFF", "GARAGE_MANAGER", "DEALER"] as const;
export const ADMIN_ROLES = ["ADMIN"] as const;
export const SUPER_ROLES = ["SUPER_ADMIN"] as const;
export const PLATFORM_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
export const AUTHENTICATED_ROLES = [
  "OWNER",
  "GARAGE_STAFF",
  "GARAGE_MANAGER",
  "DEALER",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export function homeForRole(role?: string | null): string {
  switch ((role || "").toUpperCase()) {
    case "SUPER_ADMIN":
      return "/admin/super";
    case "ADMIN":
      return "/admin";
    case "GARAGE_STAFF":
    case "GARAGE_MANAGER":
    case "DEALER":
      return "/garage/dashboard";
    case "OWNER":
      return "/dashboard";
    default:
      return "/";
  }
}

export function roleAllowed(role: string | undefined | null, allow: readonly string[]): boolean {
  const current = (role || "").toUpperCase();
  return allow.map((item) => item.toUpperCase()).includes(current);
}
