import {
  LayoutDashboard,
  Car,
  ScanLine,
  FileText,
  AlertCircle,
  ShieldCheck,
  Search,
  Wrench,
  ClipboardCheck,
  History,
  Users,
  List,
  Files,
  FileSignature,
  Store,
  Building2,
  ListTodo,
  Database,
  UsersRound,
  Settings,
  Key,
  ScrollText,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export interface PortalLink {
  label: string;
  href: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export interface PortalGroup {
  label: string;
  links: PortalLink[];
}

const OWNER_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/dashboard", label: "My Dashboard", icon: LayoutDashboard }] },
  {
    label: "Vehicles",
    links: [
      { href: "/dashboard/my-vehicles", label: "My Vehicles", icon: Car },
      { href: "/dashboard/ai-inspection", label: "AI Damage Inspection", icon: ScanLine },
    ],
  },
  {
    label: "Records",
    links: [
      { href: "/dashboard/reports", label: "My Saved Reports", icon: FileText },
      { href: "/dashboard/disputes", label: "Disputes & Corrections", icon: AlertCircle },
    ],
  },
  { label: "Account", links: [{ href: "/dashboard/settings", label: "Profile & Security", icon: ShieldCheck }] },
];

const STAFF_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/garage/dashboard", label: "Garage Home", icon: LayoutDashboard }] },
  {
    label: "Workshop",
    links: [
      { href: "/garage/vehicles", label: "Find / Register Vehicle", icon: Search },
      { href: "/garage/records/new", label: "Add Service Record", icon: Wrench },
      { href: "/garage/inspections/new", label: "Add Inspection Checklist", icon: ClipboardCheck },
    ],
  },
  { label: "History", links: [{ href: "/garage/history", label: "Recent Garage History", icon: History }] },
];

const MANAGER_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/garage/dashboard", label: "Manager Overview", icon: LayoutDashboard }] },
  {
    label: "Workshop",
    links: [
      { href: "/garage/vehicles", label: "Find / Register Vehicle", icon: Search },
      { href: "/garage/records/new", label: "Add Service Record", icon: Wrench },
      { href: "/garage/inspections/new", label: "Add Inspection Checklist", icon: ClipboardCheck },
    ],
  },
  { label: "People", links: [{ href: "/garage/staff", label: "Staff Management", icon: Users }] },
  {
    label: "Dealership",
    links: [
      { href: "/dealer/inventory", label: "Dealer Inventory", icon: List },
      { href: "/dealer/reports", label: "Bulk Reports", icon: Files },
      { href: "/dealer/application", label: "Membership Application", icon: FileSignature },
    ],
  },
  { label: "Business", links: [{ href: "/garage/settings", label: "Garage Profile", icon: Store }] },
];

const ADMIN_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard }] },
  {
    label: "Operations",
    links: [
      { href: "/admin/organizations", label: "Organization Approvals", icon: Building2 },
      { href: "/admin/disputes", label: "Dispute Queue", icon: ListTodo },
    ],
  },
  { label: "Registry", links: [{ href: "/admin/vehicles", label: "Vehicle Master Registry", icon: Database }] },
  {
    label: "Platform",
    links: [
      { href: "/admin/users", label: "User Management", icon: UsersRound },
      { href: "/admin/settings", label: "Reference Data & Rules", icon: Settings },
    ],
  },
];

const SUPER_GROUPS: PortalGroup[] = [
  { label: "Overview", links: [{ href: "/admin/super", label: "Global System Dashboard", icon: LayoutDashboard }] },
  {
    label: "Access",
    links: [
      { href: "/admin/users", label: "Users & Role Assignment", icon: UsersRound },
      { href: "/admin/security", label: "Security & API Keys", icon: Key },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
      { href: "/admin/settings", label: "System Configurations", icon: Settings },
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
      return { href: "/dashboard/settings", label: "Profile & security", icon: ShieldCheck };
    case "GARAGE_MANAGER":
    case "DEALER":
      return { href: "/garage/settings", label: "Garage profile", icon: Store };
    case "ADMIN":
      return { href: "/admin/settings", label: "Reference data", icon: Settings };
    case "SUPER_ADMIN":
      return { href: "/admin/security", label: "Security", icon: Key };
    default:
      return null;
  }
}

const EXACT = new Set(["/dashboard", "/admin", "/garage/dashboard"]);

export function linkIsActive(pathname: string, href: string): boolean {
  if (EXACT.has(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
