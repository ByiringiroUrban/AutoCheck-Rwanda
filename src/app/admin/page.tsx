"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  DashboardGridIcon,
  DocumentListIcon,
  UsersGroupIcon,
  CreditCardIcon,
  AlertCircleIcon,
  DatabaseSyncIcon,
  SettingsSliderIcon,
  BellAlertIcon,
  SearchGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldProtectionIcon,
  CarFrontIcon,
  LightningIcon,
} from "@/components/icons";

type AdminTab =
  | "overview"
  | "reports"
  | "transactions"
  | "users"
  | "dealers"
  | "buyback"
  | "disputes"
  | "integrations"
  | "settings";

type SettingsSubTab = "profile" | "security" | "pricing" | "gateways" | "company" | "notifications";

interface RecentReport {
  id: string;
  vin: string;
  plate: string;
  vehicle: string;
  score: number;
  customer: string;
  paymentMethod: string;
  amount: string;
  status: "Completed" | "Pending" | "Flagged";
  date: string;
}

interface Transaction {
  id: string;
  refCode: string;
  customer: string;
  phone: string;
  method: "MTN MoMo" | "Airtel Money" | "Visa Card" | "Mastercard" | "Bank Transfer";
  amount: number;
  type: "Single Report" | "5-Report Pack" | "25-Report Pack" | "Dealer Wholesale";
  status: "Completed" | "Pending" | "Refunded" | "Failed";
  date: string;
}

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Data Inspector" | "Finance Analyst" | "Dealer Member" | "Consumer";
  status: "Active" | "Suspended" | "Pending";
  reportsCount: number;
  joinedDate: string;
}

interface PendingDealer {
  id: string;
  businessName: string;
  tin: string;
  contactName: string;
  phone: string;
  location: string;
  monthlyVolume: string;
  status: "Pending" | "Approved" | "Rejected";
}

const INITIAL_REPORTS: RecentReport[] = [
  {
    id: "REP-2026-9041",
    vin: "JTDKN3DU5A1234567",
    plate: "RAC 452B",
    vehicle: "2019 Toyota RAV4 Limited AWD",
    score: 91,
    customer: "Jean Paul N.",
    paymentMethod: "MTN MoMo",
    amount: "35,000 Rfw",
    status: "Completed",
    date: "10 mins ago",
  },
  {
    id: "REP-2026-9040",
    vin: "1HGCR2F83HA789012",
    plate: "RAD 118C",
    vehicle: "2017 Honda Accord EX-L Sedan",
    score: 84,
    customer: "Kigali Car Mart",
    paymentMethod: "Dealer Wholesale",
    amount: "28,000 Rfw",
    status: "Completed",
    date: "25 mins ago",
  },
  {
    id: "REP-2026-9039",
    vin: "WAUZZZ8V1GA345678",
    plate: "RAE 772A",
    vehicle: "2018 Audi A3 Sportback",
    score: 62,
    customer: "Emmanuel K.",
    paymentMethod: "Airtel Money",
    amount: "35,000 Rfw",
    status: "Flagged",
    date: "1 hour ago",
  },
  {
    id: "REP-2026-9038",
    vin: "KMHD35LH9KU987654",
    plate: "RAC 890F",
    vehicle: "2020 Hyundai Tucson GLS",
    score: 89,
    customer: "Alice M.",
    paymentMethod: "Visa Card",
    amount: "75,000 Rfw",
    status: "Completed",
    date: "2 hours ago",
  },
  {
    id: "REP-2026-9037",
    vin: "JN8AY2NC7M9123456",
    plate: "RAD 304K",
    vehicle: "2021 Nissan X-Trail Hybrid",
    score: 95,
    customer: "Rwanda Motors Direct",
    paymentMethod: "Dealer Wholesale",
    amount: "150,000 Rfw",
    status: "Completed",
    date: "3 hours ago",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-8821",
    refCode: "MOMO-RW-908124",
    customer: "Jean Paul N.",
    phone: "+250 788 412 890",
    method: "MTN MoMo",
    amount: 35000,
    type: "Single Report",
    status: "Completed",
    date: "2026-09-26 14:48",
  },
  {
    id: "TXN-8820",
    refCode: "AIRTEL-RW-302194",
    customer: "Emmanuel K.",
    phone: "+250 722 901 445",
    method: "Airtel Money",
    amount: 35000,
    type: "Single Report",
    status: "Completed",
    date: "2026-09-26 13:20",
  },
  {
    id: "TXN-8819",
    refCode: "VISA-3DS-551029",
    customer: "Alice Mukamana",
    phone: "+250 783 112 004",
    method: "Visa Card",
    amount: 75000,
    type: "5-Report Pack",
    status: "Completed",
    date: "2026-09-26 12:15",
  },
  {
    id: "TXN-8818",
    refCode: "BANK-BNR-994102",
    customer: "Kigali Prime Autos Ltd",
    phone: "+250 788 445 120",
    method: "Bank Transfer",
    amount: 150000,
    type: "25-Report Pack",
    status: "Completed",
    date: "2026-09-26 11:05",
  },
  {
    id: "TXN-8817",
    refCode: "MOMO-RW-908119",
    customer: "Eric Habimana",
    phone: "+250 788 667 890",
    method: "MTN MoMo",
    amount: 35000,
    type: "Single Report",
    status: "Refunded",
    date: "2026-09-25 18:30",
  },
  {
    id: "TXN-8816",
    refCode: "MOMO-RW-908110",
    customer: "David Tuyisenge",
    phone: "+250 788 223 109",
    method: "MTN MoMo",
    amount: 75000,
    type: "5-Report Pack",
    status: "Completed",
    date: "2026-09-25 15:40",
  },
];

const INITIAL_USERS: PlatformUser[] = [
  {
    id: "USR-001",
    name: "Byiringiro Urban",
    email: "byiringirourban20@gmail.com",
    phone: "+250 788 123 456",
    role: "Super Admin",
    status: "Active",
    reportsCount: 420,
    joinedDate: "2025-10-15",
  },
  {
    id: "USR-002",
    name: "Diane Uwase",
    email: "diane.u@autocheck.rw",
    phone: "+250 783 998 120",
    role: "Data Inspector",
    status: "Active",
    reportsCount: 184,
    joinedDate: "2026-01-08",
  },
  {
    id: "USR-003",
    name: "Fabrice Hakizimana",
    email: "fabrice@kigaliprimeautos.rw",
    phone: "+250 788 445 120",
    role: "Dealer Member",
    status: "Active",
    reportsCount: 88,
    joinedDate: "2026-02-14",
  },
  {
    id: "USR-004",
    name: "Patrick Ndayisaba",
    email: "patrick.n@musanzemotors.rw",
    phone: "+250 722 884 910",
    role: "Dealer Member",
    status: "Active",
    reportsCount: 45,
    joinedDate: "2026-03-01",
  },
  {
    id: "USR-005",
    name: "Jean Paul Nkurunziza",
    email: "jeanpaul.n@gmail.com",
    phone: "+250 788 412 890",
    role: "Consumer",
    status: "Active",
    reportsCount: 3,
    joinedDate: "2026-09-20",
  },
  {
    id: "USR-006",
    name: "Claude Mugisha",
    email: "claude.m@finance.rw",
    phone: "+250 788 771 200",
    role: "Finance Analyst",
    status: "Active",
    reportsCount: 65,
    joinedDate: "2026-04-10",
  },
];

const INITIAL_DEALERS: PendingDealer[] = [
  {
    id: "DLR-101",
    businessName: "Kigali Prime Autos Ltd",
    tin: "109847291",
    contactName: "Fabrice Hakizimana",
    phone: "+250 788 445 120",
    location: "Gikondo Industrial Park, Kigali",
    monthlyVolume: "31 - 100 vehicles/mo",
    status: "Pending",
  },
  {
    id: "DLR-102",
    businessName: "Great Lakes Import & Fleet",
    tin: "103829104",
    contactName: "Diane Mukamana",
    phone: "+250 783 901 345",
    location: "Nyarutarama, Kigali",
    monthlyVolume: "100+ vehicles/mo",
    status: "Pending",
  },
  {
    id: "DLR-103",
    businessName: "Musanze Premium Motors",
    tin: "108392019",
    contactName: "Patrick Ndayisaba",
    phone: "+250 722 884 910",
    location: "Musanze Town, Northern Province",
    monthlyVolume: "11 - 30 vehicles/mo",
    status: "Pending",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Data states
  const [reportsList] = useState<RecentReport[]>(INITIAL_REPORTS);
  const [transactionsList] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [usersList, setUsersList] = useState<PlatformUser[]>(INITIAL_USERS);
  const [dealersList, setDealersList] = useState<PendingDealer[]>(INITIAL_DEALERS);

  // New User Form Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState<PlatformUser["role"]>("Consumer");

  // Settings Sub-tab state
  const [settingsTab, setSettingsTab] = useState<SettingsSubTab>("profile");

  // Settings Profile state
  const [adminName, setAdminName] = useState("Byiringiro Urban");
  const [adminEmail, setAdminEmail] = useState("byiringirourban20@gmail.com");
  const [adminPhone, setAdminPhone] = useState("+250 788 123 456");
  const [adminTitle, setAdminTitle] = useState("Lead Platform Engineer & Super Administrator");

  // Password state
  const [currentAdminPassword, setCurrentAdminPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Pricing configuration
  const [pricingSingle, setPricingSingle] = useState("35000");
  const [pricingPack5, setPricingPack5] = useState("75000");
  const [pricingPack25, setPricingPack25] = useState("150000");
  const [dealerDiscountPercent, setDealerDiscountPercent] = useState("20");
  const [accessDurationDays, setAccessDurationDays] = useState("21");

  // Company & Localization
  const [companyAddress, setCompanyAddress] = useState("KG 7 Ave, Kigali Heights Floor 4, Gasabo, Kigali");
  const [supportPhone, setSupportPhone] = useState("+250 788 123 456");
  const [supportEmail, setSupportEmail] = useState("support@autocheck.rw");
  const [rraTinNumber, setRraTinNumber] = useState("102938475");

  // Payment Gateway Config
  const [momoMerchantId, setMomoMerchantId] = useState("MOMO-RW-883921");
  const [airtelMerchantId, setAirtelMerchantId] = useState("AIRTEL-RW-44109");
  const [bnrSettlementIban, setBnrSettlementIban] = useState("BK-0041-00293841-RW");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveDealer = (id: string) => {
    setDealersList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
    );
    showToast("Dealer approved! Wholesale credentials & API keys dispatched.");
  };

  const handleRejectDealer = (id: string) => {
    setDealersList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Rejected" } : d))
    );
    showToast("Dealer application updated to Rejected.");
  };

  const handleAddUser = (e: FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: PlatformUser = {
      id: `USR-${String(usersList.length + 1).padStart(3, "0")}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || "+250 788 000 000",
      role: newUserRole,
      status: "Active",
      reportsCount: 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUsersList([newUser, ...usersList]);
    setShowUserModal(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("");
    showToast(`User ${newUser.name} added successfully as ${newUser.role}.`);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Active" ? "Suspended" : "Active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    showToast("User status updated.");
  };

  const handleSaveAdminProfile = (e: FormEvent) => {
    e.preventDefault();
    showToast("Admin profile information updated successfully.");
  };

  const handleSaveAdminPassword = (e: FormEvent) => {
    e.preventDefault();
    if (newAdminPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    setCurrentAdminPassword("");
    setNewAdminPassword("");
    setConfirmAdminPassword("");
    showToast("Admin password changed successfully with 2FA verified.");
  };

  const totalRevenueRfw = transactionsList
    .filter((t) => t.status === "Completed")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f1f5f9] text-ac-ink flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#1e293b] text-white px-5 py-3 rounded-lg shadow-2xl text-[14px] flex items-center gap-2 border-l-4 border-ac-magenta animate-fade-in">
          <span className="text-green-400 font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-ac-ink mb-1">Add Platform User</h2>
            <p className="text-[13px] text-gray-500 mb-4">
              Create an administrative, inspector, dealer, or consumer account in Rwanda.
            </p>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Marie Claire Uwera"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="user@autocheck.rw"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Phone Number (MTN / Airtel)</label>
                <input
                  type="tel"
                  placeholder="+250 78... / +250 72..."
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Account Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as PlatformUser["role"])}
                  className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] bg-white focus:outline-none focus:border-ac-blue"
                >
                  <option value="Consumer">Consumer (Car Buyer)</option>
                  <option value="Dealer Member">Dealer Member</option>
                  <option value="Data Inspector">Data Inspector (Police / Inspection)</option>
                  <option value="Finance Analyst">Finance Analyst</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer border-0 bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ac-btn px-6 py-2 text-[13px] font-semibold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Admin Header - Static at top */}
      <header className="h-[64px] bg-white border-b border-[#e2e8f0] px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-[#f1f5f9] text-[#475569] transition cursor-pointer border border-[#e2e8f0]"
            title={sidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon width={18} height={18} />
            ) : (
              <ChevronLeftIcon width={18} height={18} />
            )}
          </button>

          <div className="flex items-center gap-2">
            <Link href="/" className="font-extrabold text-[19px] tracking-tight text-[#004990] no-underline flex items-center gap-1.5">
              <span className="text-ac-magenta font-black">✓</span>
              <span>AutoCheck</span>
              <span className="text-[12px] font-bold px-1.5 py-0.5 rounded bg-[#004990] text-white uppercase tracking-wider ml-1">
                Admin
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-[#e2e8f0]">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              RRA & Police Sync: Active
            </span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex items-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Quick search VIN, Rwanda Plate, User, or Transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[38px] pl-9 pr-4 text-[13px] bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-ac-blue focus:bg-white transition"
            />
            <SearchGlassIcon
              width={16}
              height={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/vehiclehistory/vehicle-history-reports"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-ac-blue bg-[#f0f6fa] hover:bg-[#e0effa] border border-[#cde0f5] px-3 py-1.5 rounded-lg no-underline transition"
          >
            <span>View Public Site ↗</span>
          </Link>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-[#f1f5f9] text-[#475569] transition relative cursor-pointer border border-transparent"
              aria-label="Notifications"
            >
              <BellAlertIcon width={20} height={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-ac-magenta"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                  <span className="font-bold text-[14px] text-ac-ink">System Alerts</span>
                  <span className="text-[11px] font-semibold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[12px]">
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#edf2f7]">
                    <p className="font-bold text-ac-ink">New MoMo Payment Received</p>
                    <p className="text-gray-500">35,000 Rfw received from +250 788 412 890.</p>
                    <span className="text-[10px] text-gray-400">5 mins ago</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#edf2f7]">
                    <p className="font-bold text-ac-ink">New Dealer Application</p>
                    <p className="text-gray-500">Kigali Prime Autos Ltd submitted TIN 109847291.</p>
                    <span className="text-[10px] text-gray-400">12 mins ago</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#edf2f7]">
                    <p className="font-bold text-ac-ink">Odometer Discrepancy Flagged</p>
                    <p className="text-gray-500">VIN WAUZZZ8V1GA345678 flagged with 60,000 km rollback.</p>
                    <span className="text-[10px] text-gray-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("settings");
              setSettingsTab("profile");
            }}
            className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0] bg-transparent border-0 cursor-pointer text-left"
          >
            <div className="h-9 w-9 rounded-full bg-ac-navy text-white font-bold flex items-center justify-center text-[14px] shadow-xs">
              BU
            </div>
            <div className="hidden xl:block text-left text-[12px] leading-tight">
              <div className="font-bold text-ac-ink">{adminName}</div>
              <div className="text-gray-500">Super Administrator</div>
            </div>
          </button>
        </div>
      </header>

      {/* Main Body Workspace - Static Sidebar + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Static Sidebar (Fixed height, independent scroll, never moves on main page scroll) */}
        <aside
          className={`h-full bg-white border-r border-[#e2e8f0] transition-all duration-300 flex flex-col justify-between shrink-0 select-none z-20 ${
            sidebarCollapsed ? "w-[72px]" : "w-[240px] lg:w-[260px]"
          }`}
        >
          {/* Navigation Menu Links */}
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Platform Management
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "overview"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Overview & Stats"
            >
              <DashboardGridIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && <span>Overview & Stats</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "reports"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Vehicle Reports"
            >
              <DocumentListIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Vehicle Reports</span>
                  <span className="text-[11px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
                    1.2k
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("transactions")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "transactions"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Transactions & Payments"
            >
              <CreditCardIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Transactions</span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    MoMo
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "users"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="User Management"
            >
              <UsersGroupIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>User Management</span>
                  <span className="text-[11px] font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                    {usersList.length}
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dealers")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "dealers"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Dealer Members"
            >
              <CarFrontIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Dealer Members</span>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    3 New
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("buyback")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "buyback"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Buyback Protection"
            >
              <ShieldProtectionIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && <span>Buyback Protection</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("disputes")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "disputes"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Disputes & Tickets"
            >
              <AlertCircleIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && <span>Disputes & Tickets</span>}
            </button>

            {!sidebarCollapsed && (
              <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Integrations & Config
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("integrations")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "integrations"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="RRA / Police Sync"
            >
              <DatabaseSyncIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && <span>RRA / Police Sync</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold transition cursor-pointer border-0 ${
                activeTab === "settings"
                  ? "bg-ac-blue text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-ac-ink"
              }`}
              title="Settings & Administration"
            >
              <SettingsSliderIcon width={20} height={20} className="shrink-0" />
              {!sidebarCollapsed && <span>Settings & Administration</span>}
            </button>
          </div>

          {/* Sidebar Footer Minimize/Maximize Control */}
          <div className="p-3 border-t border-[#e2e8f0] bg-white shrink-0">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-semibold text-gray-500 hover:text-ac-ink hover:bg-[#f8fafc] rounded-lg transition cursor-pointer border-0 bg-transparent"
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon width={16} height={16} />
              ) : (
                <>
                  <ChevronLeftIcon width={16} height={16} />
                  <span>Minimize Sidebar</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 h-full overflow-y-auto p-6 max-w-[1600px] w-full">
          {/* ========================================================================= */}
          {/* VIEW 1: OVERVIEW & STATS */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome & Quick Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#004990] to-[#1e427a] text-white p-6 rounded-2xl shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    AutoCheck Rwanda Platform Control
                  </h1>
                  <p className="text-white/80 text-[14px]">
                    Overview of vehicle lookups, MoMo revenue settlements, and nationwide registry synchronization.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      showToast("Triggered real-time synchronization with RRA and Rwanda National Police.");
                    }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-4 py-2.5 rounded-lg text-[13px] transition cursor-pointer"
                  >
                    <DatabaseSyncIcon width={16} height={16} />
                    <span>Sync Registry APIs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    className="flex items-center gap-2 bg-ac-magenta hover:bg-[#d81ba4] text-white font-semibold px-4 py-2.5 rounded-lg text-[13px] shadow-sm transition cursor-pointer border-0"
                  >
                    <CarFrontIcon width={16} height={16} />
                    <span>+ Generate Report</span>
                  </button>
                </div>
              </div>

              {/* 4 Key Metric Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-[13px] font-semibold">Total Revenue (This Month)</span>
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-[12px]">
                      +14.2%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-ac-ink mb-1">
                    48,750,000 Rfw
                  </div>
                  <p className="text-[12px] text-gray-500">
                    MTN MoMo: 36.2M | Cards/Bank: 12.5M
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-[13px] font-semibold">Reports Generated</span>
                    <span className="p-2 rounded-lg bg-blue-50 text-ac-blue font-bold text-[12px]">
                      84 Today
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-ac-ink mb-1">
                    1,284 Reports
                  </div>
                  <p className="text-[12px] text-gray-500">
                    94% Delivered in &lt; 3 seconds
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-[13px] font-semibold">Active Dealer Accounts</span>
                    <span className="p-2 rounded-lg bg-amber-50 text-amber-700 font-bold text-[12px]">
                      3 Pending
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-ac-ink mb-1">
                    86 Dealerships
                  </div>
                  <p className="text-[12px] text-gray-500">
                    Kigali, Rubavu, Musanze & Huye
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-[13px] font-semibold">Registry Match Rate</span>
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[12px]">
                      99.4%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-ac-ink mb-1">
                    100% Online
                  </div>
                  <p className="text-[12px] text-gray-500">
                    RRA Customs & Police Inspection
                  </p>
                </div>
              </div>

              {/* Data Visualization & Live Streams Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Monthly Volume Chart */}
                <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-ac-ink">
                        Report Search & Revenue Volume
                      </h2>
                      <p className="text-[13px] text-gray-500">
                        Daily trend of VIN lookups and Rwanda license plate checks
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg text-[12px] font-semibold">
                      <button className="px-3 py-1 rounded-md bg-white text-ac-ink shadow-xs border-0 cursor-pointer">
                        Last 7 Days
                      </button>
                      <button className="px-3 py-1 rounded-md text-gray-500 hover:text-ac-ink border-0 bg-transparent cursor-pointer">
                        30 Days
                      </button>
                    </div>
                  </div>

                  {/* Simulated Bar Chart */}
                  <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#e2e8f0]">
                    {[
                      { day: "Mon", count: 72, height: "60%" },
                      { day: "Tue", count: 85, height: "70%" },
                      { day: "Wed", count: 96, height: "80%" },
                      { day: "Thu", count: 110, height: "92%" },
                      { day: "Fri", count: 125, height: "100%" },
                      { day: "Sat", count: 104, height: "86%" },
                      { day: "Sun", count: 68, height: "55%" },
                    ].map((bar) => (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[11px] font-bold text-ac-blue opacity-0 group-hover:opacity-100 transition">
                          {bar.count}
                        </span>
                        <div
                          style={{ height: bar.height }}
                          className="w-full max-w-[42px] bg-gradient-to-t from-ac-blue to-[#1e427a] rounded-t-md transition-all duration-300 group-hover:from-ac-magenta group-hover:to-[#d81ba4]"
                        />
                        <span className="text-[12px] font-semibold text-gray-500">
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-gray-500 mt-4 px-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-ac-blue inline-block"></span>
                      Standard Lookups (35k Rfw)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-ac-magenta inline-block"></span>
                      Dealer Packages (150k Rfw)
                    </span>
                  </div>
                </div>

                {/* Right: Integration Health Status */}
                <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-4">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">
                    Registry Connections
                  </h2>
                  <p className="text-[13px] text-gray-500 mb-4">
                    Real-time status of government & international feeds
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[13px] text-ac-ink">RRA Vehicle Registry</div>
                        <div className="text-[11px] text-gray-500">Plate & Title Transfer API</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Connected
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[13px] text-ac-ink">Contrôle Technique (Police)</div>
                        <div className="text-[11px] text-gray-500">Inspection & Odometer Logs</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Connected
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[13px] text-ac-ink">MTN MoMo Gateway</div>
                        <div className="text-[11px] text-gray-500">Direct Push Payment API</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Operational
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[13px] text-ac-ink">Global Auction (Japan/Dubai/US)</div>
                        <div className="text-[11px] text-gray-500">Pre-Import History Database</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Synced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: VEHICLE REPORTS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "reports" && (
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h1 className="text-2xl font-bold text-ac-ink">Vehicle Reports Database</h1>
                  <p className="text-[13px] text-gray-500">
                    Search and manage generated vehicle history reports in Rwanda
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Filter by VIN, Plate, or Make..."
                    className="h-[36px] px-3 border border-[#cbd5e1] rounded-lg text-[13px] focus:outline-none focus:border-ac-blue"
                  />
                  <button
                    type="button"
                    onClick={() => showToast("Exported vehicle reports list to CSV.")}
                    className="ac-btn py-2 px-4 text-[13px] font-semibold"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-gray-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Report ID</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Chassis / VIN</th>
                      <th className="py-3 px-4">Plate</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4">RRA Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {reportsList.map((r) => (
                      <tr key={r.id} className="hover:bg-[#f8fafc] transition">
                        <td className="py-3 px-4 font-mono font-bold text-ac-blue">{r.id}</td>
                        <td className="py-3 px-4 font-bold text-ac-ink">{r.vehicle}</td>
                        <td className="py-3 px-4 font-mono text-[12px]">{r.vin}</td>
                        <td className="py-3 px-4 font-semibold">{r.plate}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded font-bold bg-blue-100 text-ac-blue">
                            {r.score}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            ✓ Verified Clean
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link
                            href={`/vehiclehistory/sample-vehicle-history-report?vin=${r.vin}`}
                            target="_blank"
                            className="text-ac-blue font-bold hover:underline"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => showToast(`Synchronized fresh police inspection logs for ${r.plate}.`)}
                            className="text-gray-500 hover:text-ac-ink font-semibold bg-transparent border-0 cursor-pointer"
                          >
                            Re-sync
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: TRANSACTIONS & PAYMENT MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "transactions" && (
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h1 className="text-2xl font-bold text-ac-ink">Transactions & Payment Gateway</h1>
                  <p className="text-[13px] text-gray-500">
                    Monitor MTN MoMo, Airtel Money, and Card payments in Rwandan Francs (Rfw)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => showToast("Settlement batch dispatched to National Bank of Rwanda (BNR) account.")}
                    className="ac-btn py-2 px-4 text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-700"
                  >
                    Request Payout Settlement
                  </button>
                </div>
              </div>

              {/* Transactions Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">
                    Total Processed (Rfw)
                  </span>
                  <div className="text-2xl font-black text-ac-ink mt-1">
                    {totalRevenueRfw.toLocaleString()} Rfw
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    100% Settled via BNR Integration
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">
                    MTN MoMo Share
                  </span>
                  <div className="text-2xl font-black text-ac-ink mt-1">
                    78.4%
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Primary consumer channel in Rwanda
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">
                    Transaction Success Rate
                  </span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    99.8%
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Zero timeout dropoffs today
                  </span>
                </div>
              </div>

              {/* Transactions Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-gray-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Txn ID / Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {transactionsList.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#f8fafc] transition">
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-ac-blue">{tx.id}</div>
                          <div className="text-[11px] text-gray-400">{tx.refCode}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-ac-ink">{tx.customer}</div>
                          <div className="text-[11px] text-gray-500">{tx.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                            {tx.method === "MTN MoMo" && <span className="h-2 w-2 rounded-full bg-amber-400"></span>}
                            {tx.method === "Airtel Money" && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                            {tx.method === "Visa Card" && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                            {tx.method === "Bank Transfer" && <span className="h-2 w-2 rounded-full bg-green-600"></span>}
                            {tx.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-medium">{tx.type}</td>
                        <td className="py-3 px-4 font-bold text-ac-ink">
                          {tx.amount.toLocaleString()} Rfw
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              tx.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : tx.status === "Refunded"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => showToast(`Receipt generated for ${tx.refCode}`)}
                            className="text-ac-blue font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Receipt »
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: USER MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h1 className="text-2xl font-bold text-ac-ink">User & Access Management</h1>
                  <p className="text-[13px] text-gray-500">
                    Manage administrators, vehicle inspectors, dealer accounts, and registered buyers
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(true)}
                    className="ac-btn py-2 px-5 text-[13px] font-semibold flex items-center gap-1.5"
                  >
                    <span>+ Add New User</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-gray-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-center">Reports Run</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Joined</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#f8fafc] transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#f0f6fa] text-ac-blue font-bold flex items-center justify-center text-[12px] border border-[#cde0f5]">
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-ac-ink">{u.name}</div>
                              <div className="text-[11px] text-gray-400 font-mono">{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-700">{u.email}</div>
                          <div className="text-[11px] text-gray-500">{u.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                              u.role === "Super Admin"
                                ? "bg-ac-blue text-white"
                                : u.role === "Data Inspector"
                                ? "bg-purple-100 text-purple-800"
                                : u.role === "Dealer Member"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-ac-ink">
                          {u.reportsCount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              u.status === "Active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-[12px]">
                          {u.joinedDate}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="text-ac-blue hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                          >
                            {u.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: DEALERSHIP APPROVALS */}
          {/* ========================================================================= */}
          {activeTab === "dealers" && (
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h1 className="text-2xl font-bold text-ac-ink">
                    Dealership Applications & Members
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    Manage wholesale accounts, approve dealership registrations, and configure bulk tiers
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {dealersList.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="p-5 rounded-xl border border-[#e2e8f0] bg-[#fbfbfb] hover:shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-ac-ink">{dealer.businessName}</h3>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            dealer.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : dealer.status === "Rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {dealer.status}
                        </span>
                      </div>
                      <div className="text-[13px] text-gray-600">
                        Contact: <span className="font-semibold text-ac-ink">{dealer.contactName}</span> ({dealer.phone})
                      </div>
                      <div className="text-[12px] text-gray-500">
                        TIN: {dealer.tin} | Location: {dealer.location} | Volume: {dealer.monthlyVolume}
                      </div>
                    </div>

                    {dealer.status === "Pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApproveDealer(dealer.id)}
                          className="ac-btn py-2 px-5 text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-700"
                        >
                          Approve Wholesale Account
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectDealer(dealer.id)}
                          className="px-4 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md cursor-pointer transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: SETTINGS & ADMINISTRATION (UPGRADED ENTERPRISE MODULE) */}
          {/* ========================================================================= */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden space-y-0">
              {/* Header Title */}
              <div className="p-6 border-b border-[#e2e8f0] bg-white">
                <h1 className="text-2xl font-bold text-ac-ink">Platform Settings & Administration</h1>
                <p className="text-[13px] text-gray-500">
                  Manage administrator credentials, security, pricing rules in Rfw, payment gateways, and company profiles.
                </p>

                {/* Sub-tabs Navigation */}
                <div className="flex items-center gap-2 mt-6 border-b border-[#e2e8f0] overflow-x-auto pb-0">
                  {[
                    { id: "profile", label: "Admin Profile" },
                    { id: "security", label: "Password & Security" },
                    { id: "pricing", label: "Report Pricing & Plans" },
                    { id: "gateways", label: "Payment Gateways (MoMo/Cards)" },
                    { id: "company", label: "Organization & HQ" },
                    { id: "notifications", label: "Alerts & Webhooks" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSettingsTab(st.id as SettingsSubTab)}
                      className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                        settingsTab === st.id
                          ? "border-ac-blue text-ac-blue bg-[#f8fafc]"
                          : "border-transparent text-gray-500 hover:text-ac-ink bg-transparent"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-tab 1: Admin Profile */}
              {settingsTab === "profile" && (
                <div className="p-6 max-w-2xl">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">Administrator Profile</h2>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Update your account details and contact information.
                  </p>
                  <form onSubmit={handleSaveAdminProfile} className="space-y-4">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#f1f5f9]">
                      <div className="h-16 w-16 rounded-full bg-ac-navy text-white text-2xl font-bold flex items-center justify-center shadow-sm">
                        BU
                      </div>
                      <div>
                        <div className="font-bold text-ac-ink text-[16px]">{adminName}</div>
                        <div className="text-[13px] text-gray-500">{adminTitle}</div>
                        <span className="inline-block mt-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Super Admin Role
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Email Address (Login ID)</label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Direct Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Role Title / Designation</label>
                      <input
                        type="text"
                        value={adminTitle}
                        onChange={(e) => setAdminTitle(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="ac-btn px-6 py-2.5 font-bold text-[14px]">
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-tab 2: Password & Security */}
              {settingsTab === "security" && (
                <div className="p-6 max-w-2xl">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">Change Password & Security</h2>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Ensure your administrative account is protected with strong credentials and two-factor authentication.
                  </p>

                  <form onSubmit={handleSaveAdminPassword} className="space-y-4 mb-8">
                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Current Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={currentAdminPassword}
                        onChange={(e) => setCurrentAdminPassword(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">New Password * (at least 8 characters)</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="ac-btn px-6 py-2.5 font-bold text-[14px]">
                        Update Admin Password
                      </button>
                    </div>
                  </form>

                  {/* 2FA Card */}
                  <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-ac-ink text-[14px]">Two-Factor Authentication (2FA)</h3>
                      <p className="text-[12px] text-gray-500">
                        Require an SMS OTP on +250 788 123 456 when logging into the Admin console.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        showToast(`2FA status toggled: ${!twoFactorEnabled ? "Enabled" : "Disabled"}`);
                      }}
                      className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition cursor-pointer border-0 ${
                        twoFactorEnabled
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {twoFactorEnabled ? "Enabled ✓" : "Disabled"}
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Pricing & Wholesale */}
              {settingsTab === "pricing" && (
                <div className="p-6 max-w-2xl">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">Report Pricing & Wholesale Rules</h2>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Configure consumer prices and wholesale dealership rates in Rwandan Francs (Rfw).
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast("Pricing and package configurations updated successfully.");
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">
                        Single Vehicle History Report (Rfw)
                      </label>
                      <input
                        type="number"
                        value={pricingSingle}
                        onChange={(e) => setPricingSingle(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue font-semibold"
                      />
                      <p className="text-[12px] text-gray-500 mt-1">Default consumer single check: 35,000 Rfw</p>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">
                        5-Report Shopper Package (Rfw)
                      </label>
                      <input
                        type="number"
                        value={pricingPack5}
                        onChange={(e) => setPricingPack5(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue font-semibold"
                      />
                      <p className="text-[12px] text-gray-500 mt-1">Default 5-car comparison package: 75,000 Rfw</p>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">
                        25-Report Importer Package (Rfw)
                      </label>
                      <input
                        type="number"
                        value={pricingPack25}
                        onChange={(e) => setPricingPack25(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue font-semibold"
                      />
                      <p className="text-[12px] text-gray-500 mt-1">Default high volume pack: 150,000 Rfw</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-ac-ink mb-1">
                          Dealer Wholesale Discount (%)
                        </label>
                        <input
                          type="number"
                          value={dealerDiscountPercent}
                          onChange={(e) => setDealerDiscountPercent(e.target.value)}
                          className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-ac-ink mb-1">
                          Report Access Term (Days)
                        </label>
                        <input
                          type="number"
                          value={accessDurationDays}
                          onChange={(e) => setAccessDurationDays(e.target.value)}
                          className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="ac-btn px-6 py-2.5 font-bold text-[14px]">
                        Save Pricing Rules
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-tab 4: Payment Gateways */}
              {settingsTab === "gateways" && (
                <div className="p-6 max-w-2xl">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">Payment Gateways & Settlements</h2>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Manage Mobile Money APIs (MTN & Airtel) and National Bank of Rwanda settlement channels.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast("Payment gateway credentials updated.");
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">
                        MTN Mobile Money Merchant Code
                      </label>
                      <input
                        type="text"
                        value={momoMerchantId}
                        onChange={(e) => setMomoMerchantId(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">
                        Airtel Money Merchant Code
                      </label>
                      <input
                        type="text"
                        value={airtelMerchantId}
                        onChange={(e) => setAirtelMerchantId(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">
                        BNR Domestic Bank Settlement Account
                      </label>
                      <input
                        type="text"
                        value={bnrSettlementIban}
                        onChange={(e) => setBnrSettlementIban(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue font-mono"
                      />
                      <p className="text-[12px] text-gray-500 mt-1">Bank of Kigali / I&M Bank settlement IBAN</p>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="ac-btn px-6 py-2.5 font-bold text-[14px]">
                        Save Gateway Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-tab 5: Company & Localization */}
              {settingsTab === "company" && (
                <div className="p-6 max-w-2xl">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">Company & HQ Localization</h2>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Official organizational details displayed on invoices and legal documents.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast("Company information saved.");
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Registered Business Name</label>
                      <input
                        type="text"
                        defaultValue="AutoCheck Experian Rwanda Ltd"
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">RRA Tax Identification Number (TIN)</label>
                      <input
                        type="text"
                        value={rraTinNumber}
                        onChange={(e) => setRraTinNumber(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-ac-ink mb-1">Kigali Headquarters Address</label>
                      <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-ac-ink mb-1">Support Phone</label>
                        <input
                          type="tel"
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-ac-ink mb-1">Support Email</label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded-lg text-[14px] focus:outline-none focus:border-ac-blue"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="ac-btn px-6 py-2.5 font-bold text-[14px]">
                        Save Organization Details
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-tab 6: Notifications & Webhooks */}
              {settingsTab === "notifications" && (
                <div className="p-6 max-w-2xl space-y-4">
                  <h2 className="text-lg font-bold text-ac-ink mb-1">System Alerts & Webhooks</h2>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Configure real-time notifications sent to your operations team.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e2e8f0] bg-[#fbfbfb] cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-ac-magenta" />
                      <div>
                        <span className="font-bold text-[14px] text-ac-ink block">Instant MoMo Payment Notifications</span>
                        <span className="text-[12px] text-gray-500">Receive an email alert whenever a vehicle report payment is completed.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e2e8f0] bg-[#fbfbfb] cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-ac-magenta" />
                      <div>
                        <span className="font-bold text-[14px] text-ac-ink block">Dealer Membership Application Alerts</span>
                        <span className="text-[12px] text-gray-500">Alert operations staff when a Rwandan car dealership submits verification documents.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e2e8f0] bg-[#fbfbfb] cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-ac-magenta" />
                      <div>
                        <span className="font-bold text-[14px] text-ac-ink block">Odometer Tampering & Salvage Flags</span>
                        <span className="text-[12px] text-gray-500">High priority alert when a vehicle lookup detects severe mileage rollbacks or flood brands.</span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => showToast("Notification webhook preferences updated.")}
                      className="ac-btn px-6 py-2.5 font-bold text-[14px]"
                    >
                      Save Alert Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: INTEGRATIONS & API */}
          {/* ========================================================================= */}
          {activeTab === "integrations" && (
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#e2e8f0]">
                <h1 className="text-2xl font-bold text-ac-ink">Registry APIs & Data Connectors</h1>
                <p className="text-[13px] text-gray-500">
                  Manage connection endpoints, webhook secrets, and registry polling frequencies
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#e2e8f0] p-5 rounded-xl bg-[#fbfbfb] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ac-ink text-[16px]">Rwanda Revenue Authority (RRA)</h3>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Live
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600">
                    Endpoint: <code className="bg-gray-200 px-1 rounded text-[12px]">https://api.rra.gov.rw/v1/vehicles</code>
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast("Tested RRA API endpoint: 200 OK (Latency: 142ms)")}
                    className="text-[13px] font-semibold text-ac-blue hover:underline bg-transparent border-0 cursor-pointer p-0"
                  >
                    Test Connection & Ping »
                  </button>
                </div>

                <div className="border border-[#e2e8f0] p-5 rounded-xl bg-[#fbfbfb] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ac-ink">Rwanda National Police (Contrôle Technique)</h3>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Live
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600">
                    Endpoint: <code className="bg-gray-200 px-1 rounded text-[12px]">https://inspections.police.gov.rw/api/v2</code>
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast("Tested Police Inspection API: 200 OK (Latency: 98ms)")}
                    className="text-[13px] font-semibold text-ac-blue hover:underline bg-transparent border-0 cursor-pointer p-0"
                  >
                    Test Connection & Ping »
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8, 9: BUYBACK & DISPUTES */}
          {/* ========================================================================= */}
          {["buyback", "disputes"].includes(activeTab) && (
            <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] shadow-xs text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f6fa] text-ac-blue">
                <ShieldProtectionIcon width={28} height={28} />
              </div>
              <h2 className="text-2xl font-bold text-ac-ink capitalize">{activeTab} Management</h2>
              <p className="text-[14px] text-gray-500 max-w-md mx-auto">
                All registered Buyback Protection policies and customer dispute tickets are synchronized with RRA/Police databases.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="ac-btn inline-block text-white font-semibold px-6 py-2"
              >
                Return to Overview
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
