export interface PortalLink {
  label: string;
  href: string;
}

export interface PortalGroup {
  label: string;
  links: PortalLink[];
}

const OWNER_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/dashboard", label: "My Dashboard" }] },
  {
    label: "Vehicles",
    links: [
      { href: "/dashboard/my-vehicles", label: "My Vehicles" },
      { href: "/dashboard/ai-inspection", label: "AI Damage Inspection" },
    ],
  },
  {
    label: "Records",
    links: [
      { href: "/dashboard/reports", label: "My Saved Reports" },
      { href: "/dashboard/disputes", label: "Disputes & Corrections" },
    ],
  },
  { label: "Account", links: [{ href: "/dashboard/settings", label: "Profile & Security" }] },
];

const STAFF_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/garage/dashboard", label: "Garage Home" }] },
  {
    label: "Workshop",
    links: [
      { href: "/garage/vehicles", label: "Find / Register Vehicle" },
      { href: "/garage/records/new", label: "Add Service Record" },
      { href: "/garage/inspections/new", label: "Add Inspection Checklist" },
    ],
  },
  { label: "History", links: [{ href: "/garage/history", label: "Recent Garage History" }] },
];

const MANAGER_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/garage/dashboard", label: "Manager Overview" }] },
  { label: "People", links: [{ href: "/garage/staff", label: "Staff Management" }] },
  { label: "Workshop", links: [{ href: "/garage/records/new", label: "Add Service Record" }] },
  {
    label: "Dealership",
    links: [
      { href: "/dealer/inventory", label: "Dealer Inventory" },
      { href: "/dealer/reports", label: "Bulk Reports" },
      { href: "/dealer/application", label: "Membership Application" },
    ],
  },
  { label: "Business", links: [{ href: "/garage/settings", label: "Garage Profile" }] },
];

const ADMIN_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/admin", label: "Admin Dashboard" }] },
  {
    label: "Operations",
    links: [
      { href: "/admin/organizations", label: "Organization Approvals" },
      { href: "/admin/disputes", label: "Dispute Queue" },
    ],
  },
  { label: "Registry", links: [{ href: "/admin/vehicles", label: "Vehicle Master Registry" }] },
  {
    label: "Platform",
    links: [
      { href: "/admin/users", label: "User Management" },
      { href: "/admin/settings", label: "Reference Data & Rules" },
    ],
  },
];

const SUPER_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/admin/super", label: "Global System Dashboard" }] },
  {
    label: "Access",
    links: [
      { href: "/admin/users", label: "Users & Role Assignment" },
      { href: "/admin/disputes", label: "Dispute Queue" },
      { href: "/admin/security", label: "Security & API Keys" },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/audit-logs", label: "Audit Logs" },
      { href: "/admin/settings", label: "System Configurations" },
    ],
  },
];

export function groupsForRole(role?: string | null): PortalGroup[] {
  switch ((role || "").toUpperCase()) {
    case "OWNER":
      return OWNER_GROUPS;
    case "GARAGE_STAFF":
      return STAFF_GROUPS;
    case "GARAGE_MANAGER":
    case "DEALER":
      return MANAGER_GROUPS;
    case "ADMIN":
      return ADMIN_GROUPS;
    case "SUPER_ADMIN":
      return SUPER_GROUPS;
    default:
      return [];
  }
}

export function accountLinkForRole(role?: string | null): PortalLink | null {
  switch ((role || "").toUpperCase()) {
    case "OWNER":
      return { href: "/dashboard/settings", label: "Profile & security" };
    case "GARAGE_MANAGER":
    case "DEALER":
      return { href: "/garage/settings", label: "Garage profile" };
    case "ADMIN":
      return { href: "/admin/settings", label: "Reference data" };
    case "SUPER_ADMIN":
      return { href: "/admin/security", label: "Security" };
    default:
      return null;
  }
}

const EXACT = new Set(["/dashboard", "/admin", "/garage/dashboard"]);

export function linkIsActive(pathname: string, href: string): boolean {
  if (EXACT.has(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
