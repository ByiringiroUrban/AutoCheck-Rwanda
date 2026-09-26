"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CarFrontIcon } from "@/components/icons";

type TabType = "reports" | "profile" | "buyback";

interface VehicleReportItem {
  id: string;
  vin: string;
  plate: string;
  name: string;
  score: number;
  buybackEligible: boolean;
  runDate: string;
  accessibleUntil: string;
  owned: boolean;
}

const INITIAL_REPORTS: VehicleReportItem[] = [
  {
    id: "rep-1",
    vin: "JTDKN3DU5A1234567",
    plate: "RAC 452B",
    name: "2019 Toyota RAV4 Limited AWD",
    score: 91,
    buybackEligible: true,
    runDate: "2026-09-20",
    accessibleUntil: "2026-10-11",
    owned: true,
  },
  {
    id: "rep-2",
    vin: "1HGCR2F83HA789012",
    plate: "RAD 118C",
    name: "2017 Honda Accord EX-L Sedan",
    score: 84,
    buybackEligible: true,
    runDate: "2026-09-15",
    accessibleUntil: "2026-10-06",
    owned: false,
  },
];

const inputBase =
  "block w-full h-[34px] px-[12px] py-[6px] text-[14px] leading-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none placeholder:text-[rgba(33,37,41,0.65)] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-[border-color,box-shadow] duration-150";

const errorText = "mt-[4px] text-[12px] text-ac-danger";

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("reports");
  const [reports, setReports] = useState<VehicleReportItem[]>(INITIAL_REPORTS);

  // User Profile State
  const [userName, setUserName] = useState("BYIRINGIRO URBAN");
  const [userEmail, setUserEmail] = useState("byiringirourban20@gmail.com");
  const [marketingOptIn, setMarketingOptIn] = useState(true);

  // Profile Edit Modals / Form Inline states
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(userEmail);

  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search form state
  const [searchVin, setSearchVin] = useState("");
  const [vinError, setVinError] = useState(false);
  const [searchPlate, setSearchPlate] = useState("");
  const [plateError, setPlateError] = useState(false);
  const [plateDistrict, setPlateDistrict] = useState("Kigali");

  // Buyback registration state
  const [buybackSuccess, setBuybackSuccess] = useState(false);
  const [bbVin, setBbVin] = useState("");
  const [bbYear, setBbYear] = useState("2020");
  const [bbMake, setBbMake] = useState("");
  const [bbModel, setBbModel] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleOwned = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, owned: !r.owned } : r))
    );
    showToast("Vehicle ownership status updated.");
  };

  const handleVinSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchVin.trim()) {
      setVinError(true);
    } else {
      setVinError(false);
      window.location.href = `/vehiclehistory/sample-vehicle-history-report?vin=${encodeURIComponent(searchVin.trim())}`;
    }
  };

  const handlePlateSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchPlate.trim()) {
      setPlateError(true);
    } else {
      setPlateError(false);
      window.location.href = `/vehiclehistory/sample-vehicle-history-report?plate=${encodeURIComponent(searchPlate.trim())}`;
    }
  };

  const handleSaveName = (e: FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setEditingName(false);
      showToast("Name updated successfully.");
    }
  };

  const handleSaveEmail = (e: FormEvent) => {
    e.preventDefault();
    if (tempEmail.trim()) {
      setUserEmail(tempEmail.trim());
      setEditingEmail(false);
      showToast("Account email updated successfully.");
    }
  };

  const handleSavePassword = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    setEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password changed successfully.");
  };

  const handleBuybackSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBuybackSuccess(true);
    showToast("Buyback Protection registered successfully!");
  };

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#212529] text-white px-5 py-3 rounded-lg shadow-xl text-[14px] flex items-center gap-2 animate-fade-in border-l-4 border-ac-magenta">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="py-6 bg-white min-h-[600px]">
        <div className="ac-container">
          {/* Main Title Area */}
          <div className="mb-4 pb-2 border-b border-[#e2e8f0]">
            <h1 className="text-[26px] font-bold text-ac-ink">
              {activeTab === "reports"
                ? "My AutoCheck® Dashboard"
                : `Welcome back, ${userName.split(" ")[0] || "BYIRINGIRO"}`}
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[#af1685]">
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-2.5 text-[14px] font-bold rounded-t-[5px] transition-colors cursor-pointer border-0 ${
                activeTab === "reports"
                  ? "bg-ac-magenta text-white"
                  : "bg-[#f8f9fa] text-ac-ink hover:bg-[#eaeaea]"
              }`}
            >
              My Reports
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-2.5 text-[14px] font-bold rounded-t-[5px] transition-colors cursor-pointer border-0 ${
                activeTab === "profile"
                  ? "bg-ac-magenta text-white"
                  : "bg-[#f8f9fa] text-ac-ink hover:bg-[#eaeaea]"
              }`}
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("buyback")}
              className={`px-6 py-2.5 text-[14px] font-bold rounded-t-[5px] transition-colors cursor-pointer border-0 ${
                activeTab === "buyback"
                  ? "bg-ac-magenta text-white"
                  : "bg-[#f8f9fa] text-ac-ink hover:bg-[#eaeaea]"
              }`}
            >
              Buyback Protection
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: MY REPORTS */}
          {/* ========================================================================= */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Top Subscription & Account Box */}
              <div className="rounded-[6px] border border-[#d6e4f0] bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Renew Subscription */}
                  <div className="md:col-span-8 flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#e2e8f0] pb-4 md:pb-0 md:pr-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5]">
                      <CarFrontIcon width={24} height={24} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ac-ink mb-1">
                        Renew your subscription now to restore access to your AutoCheck vehicle history reports.
                      </p>
                      <Link
                        href="/vehiclehistory/subscription-benefits"
                        className="text-[13px] font-bold text-ac-blue hover:underline"
                      >
                        See all subscription options »
                      </Link>
                    </div>
                  </div>

                  {/* Right: Account Details */}
                  <div className="md:col-span-4 pl-0 md:pl-2">
                    <h3 className="text-[13px] font-bold text-[#555] uppercase tracking-wide mb-1">
                      Account Details
                    </h3>
                    <p className="text-[14px] font-bold text-ac-ink uppercase">{userName}</p>
                    <p className="text-[13px] text-gray-600 truncate">{userEmail}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className="mt-1 text-[13px] font-bold text-ac-blue hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Edit »
                    </button>
                  </div>
                </div>
              </div>

              {/* Vehicle History Reports Table Section */}
              <div className="border border-[#e2e8f0] rounded-[6px] bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="text-[20px] font-bold text-ac-blue">
                    Vehicle History Reports
                  </h2>
                  <div className="text-[13px] text-gray-600">
                    You have run{" "}
                    <span className="font-bold text-ac-ink">{reports.length}</span> vehicle history reports.{" "}
                    <Link
                      href="#search-reports-section"
                      className="font-bold text-ac-blue hover:underline"
                    >
                      Run more reports »
                    </Link>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-[#e9ecef] border-b border-[#ced4da] text-ac-ink font-semibold">
                        <th className="py-2.5 px-3 whitespace-nowrap">
                          I Own{" "}
                          <span title="Check if you own this vehicle" className="text-gray-500 cursor-help">
                            ?
                          </span>
                        </th>
                        <th className="py-2.5 px-3">Vehicle</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">
                          AutoCheck Score™{" "}
                          <span title="Patented rating system" className="text-gray-500 cursor-help">
                            ?
                          </span>
                        </th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">
                          Buyback Protection{" "}
                          <span title="Protection against undisclosed severe title brands" className="text-gray-500 cursor-help">
                            ?
                          </span>
                        </th>
                        <th className="py-2.5 px-3 whitespace-nowrap">
                          Run Date{" "}
                          <span title="Date report was generated" className="text-gray-500 cursor-help">
                            ?
                          </span>
                        </th>
                        <th className="py-2.5 px-3 whitespace-nowrap">
                          Accessible Until{" "}
                          <span title="Reports are accessible for 21 days" className="text-gray-500 cursor-help">
                            ?
                          </span>
                        </th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf2f7]">
                      {reports.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            No vehicle history reports found. Enter a VIN or Rwanda License Plate below to run your first report.
                          </td>
                        </tr>
                      ) : (
                        reports.map((rep) => (
                          <tr key={rep.id} className="hover:bg-[#f8f9fa] transition-colors">
                            <td className="py-3 px-3">
                              <input
                                type="checkbox"
                                checked={rep.owned}
                                onChange={() => toggleOwned(rep.id)}
                                className="h-4 w-4 accent-ac-magenta cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-ac-blue text-[14px]">
                                {rep.name}
                              </div>
                              <div className="text-[12px] text-gray-500">
                                VIN: {rep.vin} | Plate: {rep.plate}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-ac-ink">
                              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-ac-blue font-bold text-[13px]">
                                {rep.score}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {rep.buybackEligible ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-[11px] font-bold">
                                  ✓ Qualified
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[12px]">N/A</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-gray-700 whitespace-nowrap">
                              {rep.runDate}
                            </td>
                            <td className="py-3 px-3 text-gray-700 whitespace-nowrap">
                              {rep.accessibleUntil}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <Link
                                href={`/vehiclehistory/sample-vehicle-history-report?vin=${rep.vin}`}
                                className="text-ac-blue font-semibold hover:underline text-[13px]"
                              >
                                View Report »
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KeySavvy Banner */}
              <div className="my-6 flex justify-center">
                <div className="w-full max-w-[620px] overflow-hidden rounded-[14px] shadow-md transition hover:scale-[1.01]">
                  <Link href="/vehiclehistory/secure-shopping">
                    <Image
                      src="/images/KeySavvy-AutoCheck-teamup-bnr.png"
                      alt="AutoCheck and KeySavvy team up"
                      width={620}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </Link>
                </div>
              </div>

              {/* Please Note Disclaimer */}
              <div className="border-t border-[#e2e8f0] pt-3">
                <h4 className="text-[12px] font-bold text-ac-ink mb-1">Please Note</h4>
                <p className="text-[11px] leading-[16px] text-gray-500">
                  That the data shown above reflects events reported to AutoCheck Rwanda as of the displayed run date. Report data changes over time as the reported condition of the vehicle changes. Please run a fresh report to receive the most recently reported data.
                </p>
              </div>

              {/* CarAdvise / Smarter Car Care Maintenance Banner */}
              <div className="rounded-[10px] bg-[#0c2f5e] p-6 md:p-8 text-white shadow-md">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[24px] font-bold tracking-tight text-white">CarAdvise</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00a8cc] text-white text-[12px] font-bold">
                        ✓
                      </span>
                      <span className="text-[22px] font-light text-[#f58220] pl-2 border-l border-white/30">
                        Smarter Car Care
                      </span>
                    </div>
                    <p className="text-[15px] font-medium text-white/90 leading-relaxed">
                      Regular maintenance can help preserve your vehicle&apos;s value. Shop and compare prices for service, and protect your investment from unnecessary work across certified garages in Rwanda.
                    </p>
                  </div>
                  <a
                    href="/vehiclehistory/buyers-guide"
                    className="shrink-0 rounded-[5px] bg-[#f58220] px-8 py-3 text-[15px] font-bold text-white no-underline shadow hover:bg-[#e07110] transition"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              {/* Bottom Search Box */}
              <div id="search-reports-section" className="rounded-[10px] border border-[#cfd6dc] bg-ac-card shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] overflow-hidden scroll-mt-6">
                <div className="bg-ac-navy p-3 text-center">
                  <h2 className="m-0 text-[22px] font-normal text-white">
                    AutoCheck Vehicle History Reports
                  </h2>
                </div>

                <div className="p-6">
                  <p className="mb-4 text-[14px] text-ac-ink font-medium">
                    Two ways to find the vehicle history you&apos;re looking for:
                  </p>

                  {/* VIN Search */}
                  <form noValidate onSubmit={handleVinSearch} className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[15px] font-bold text-ac-ink">Search by VIN</span>
                      <Link
                        href="/vehiclehistory/vin-basics#findVin"
                        className="text-[13px] font-semibold text-ac-blue hover:underline"
                      >
                        Where can I find the VIN? »
                      </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          maxLength={17}
                          placeholder="Vehicle Identification Number"
                          value={searchVin}
                          onChange={(e) => {
                            setSearchVin(e.target.value);
                            if (vinError) setVinError(false);
                          }}
                          className={`${inputBase} ${
                            vinError ? "border-ac-danger" : "border-ac-input-border"
                          }`}
                        />
                        {vinError && (
                          <div className={errorText}>Please enter a vehicle identification number</div>
                        )}
                      </div>
                      <button type="submit" className="ac-btn sm:w-[130px] font-semibold shrink-0">
                        Get Report
                      </button>
                    </div>
                  </form>

                  {/* OR divider */}
                  <div className="flex items-center my-3 text-[15px] font-bold italic text-ac-or-gray">
                    <div className="pr-3">OR</div>
                    <div className="flex-1">
                      <hr className="border-0 border-t border-ac-or-gray opacity-30" />
                    </div>
                  </div>

                  {/* License Plate Search */}
                  <form noValidate onSubmit={handlePlateSearch} className="mb-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[15px] font-bold text-ac-ink">
                        Search by Rwanda License Plate
                      </span>
                      <Link
                        href="/vehiclehistory/search-by-plate"
                        className="text-[13px] font-semibold text-ac-blue hover:underline"
                      >
                        Is it a specialty plate? »
                      </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Rwanda License Plate (e.g. RAC 123A)"
                          value={searchPlate}
                          onChange={(e) => {
                            setSearchPlate(e.target.value);
                            if (plateError) setPlateError(false);
                          }}
                          className={`${inputBase} ${
                            plateError ? "border-ac-danger" : "border-ac-input-border"
                          }`}
                        />
                        {plateError && (
                          <div className={errorText}>Please enter a Rwanda license plate</div>
                        )}
                      </div>

                      <select
                        value={plateDistrict}
                        onChange={(e) => setPlateDistrict(e.target.value)}
                        className="h-[34px] px-3 text-[14px] bg-white border border-ac-input-border text-ac-ink focus:outline-0"
                      >
                        <option value="Kigali">Kigali City</option>
                        <option value="Eastern">Eastern Province</option>
                        <option value="Northern">Northern Province</option>
                        <option value="Southern">Southern Province</option>
                        <option value="Western">Western Province</option>
                      </select>

                      <button type="submit" className="ac-btn sm:w-[130px] font-semibold shrink-0">
                        Get Report
                      </button>
                    </div>
                  </form>

                  <div className="mt-3">
                    <Link
                      href="/vehiclehistory/subscription-benefits"
                      className="text-[13px] font-semibold text-ac-blue hover:underline"
                    >
                      No VIN? Subscribe now, search later »
                    </Link>
                  </div>

                  <div className="mt-4 border-t border-[#eee] pt-2 text-[10px] text-gray-500">
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a href="https://policies.google.com/privacy" className="text-ac-blue hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="https://policies.google.com/terms" className="text-ac-blue hover:underline">
                      Terms of Service
                    </a>{" "}
                    apply.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MY PROFILE */}
          {/* ========================================================================= */}
          {activeTab === "profile" && (
            <div className="rounded-[6px] border border-[#d6e4f0] bg-white p-6 md:p-8 shadow-sm">
              <div className="divide-y divide-[#edf2f7]">
                {/* Row 1: Name */}
                <div className="py-6 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-ac-ink mb-1">Name:</h3>
                      {editingName ? (
                        <form onSubmit={handleSaveName} className="mt-2 flex items-center gap-2 max-w-md">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className={inputBase}
                            placeholder="Full Name"
                            autoFocus
                          />
                          <button type="submit" className="ac-btn py-1.5 px-4 text-[13px]">
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempName(userName);
                              setEditingName(false);
                            }}
                            className="text-[13px] text-gray-500 hover:underline px-2"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <p className="text-[14px] text-gray-700">
                          Edit Your Name - <span className="font-bold text-ac-ink">{userName}</span>
                        </p>
                      )}
                    </div>
                    {!editingName && (
                      <button
                        type="button"
                        onClick={() => setEditingName(true)}
                        className="ac-btn px-6 py-2 text-[14px] font-semibold shrink-0"
                      >
                        Change Name
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 2: Account E-mail */}
                <div className="py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-ac-ink mb-1">Account E-mail:</h3>
                      {editingEmail ? (
                        <form onSubmit={handleSaveEmail} className="mt-2 flex items-center gap-2 max-w-md">
                          <input
                            type="email"
                            value={tempEmail}
                            onChange={(e) => setTempEmail(e.target.value)}
                            className={inputBase}
                            placeholder="Email Address"
                            autoFocus
                          />
                          <button type="submit" className="ac-btn py-1.5 px-4 text-[13px]">
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempEmail(userEmail);
                              setEditingEmail(false);
                            }}
                            className="text-[13px] text-gray-500 hover:underline px-2"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <p className="text-[14px] text-gray-700">
                          Edit Your E-mail - <span className="font-semibold text-ac-ink">{userEmail}</span>
                        </p>
                      )}
                    </div>
                    {!editingEmail && (
                      <button
                        type="button"
                        onClick={() => setEditingEmail(true)}
                        className="ac-btn px-6 py-2 text-[14px] font-semibold shrink-0"
                      >
                        Change E-mail
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 3: Password */}
                <div className="py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-ac-ink mb-1">Your Password:</h3>
                      {editingPassword ? (
                        <form onSubmit={handleSavePassword} className="mt-3 space-y-3 max-w-md">
                          <div>
                            <label className="block text-[12px] text-gray-600 mb-1">Current Password</label>
                            <input
                              type="password"
                              required
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className={inputBase}
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-[12px] text-gray-600 mb-1">New Password (at least 8 chars)</label>
                            <input
                              type="password"
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className={inputBase}
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-[12px] text-gray-600 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={inputBase}
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button type="submit" className="ac-btn py-1.5 px-4 text-[13px]">
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPassword(false)}
                              className="text-[13px] text-gray-500 hover:underline px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-[14px] text-gray-700">Edit Your Password</p>
                      )}
                    </div>
                    {!editingPassword && (
                      <button
                        type="button"
                        onClick={() => setEditingPassword(true)}
                        className="ac-btn px-6 py-2 text-[14px] font-semibold shrink-0"
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 4: Marketing Preferences */}
                <div className="py-6 last:pb-0">
                  <h3 className="text-[15px] font-bold text-ac-ink mb-3">Marketing Preferences:</h3>
                  <label className="flex items-start gap-3 cursor-pointer text-[14px] text-gray-700">
                    <input
                      type="checkbox"
                      checked={marketingOptIn}
                      onChange={(e) => {
                        setMarketingOptIn(e.target.checked);
                        showToast("Marketing preferences updated.");
                      }}
                      className="mt-1 h-4 w-4 accent-ac-magenta cursor-pointer"
                    />
                    <span>Yes: Please send me email updates and exclusive offers from AutoCheck Rwanda</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BUYBACK PROTECTION */}
          {/* ========================================================================= */}
          {activeTab === "buyback" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form */}
              <div className="lg:col-span-8 bg-white border border-[#d6e4f0] rounded-[6px] p-6 md:p-8 shadow-sm">
                <h2 className="text-[22px] font-bold text-ac-blue mb-2">
                  Register for AutoCheck Buyback Protection
                </h2>
                <p className="text-[14px] text-gray-700 leading-relaxed mb-2">
                  Register your qualified vehicle within 90 days of purchase to activate Buyback Protection. Remember: You must (1) purchase the associated vehicle history report prior to purchasing the vehicle and (2) the VHR must display the Qualifies for Buyback Protection shield to ensure that you&apos;re protected.
                </p>
                <Link
                  href="/vehiclehistory/vehicle-buyback-protection"
                  className="text-[13px] font-bold text-ac-blue hover:underline block mb-6"
                >
                  See AutoCheck Buyback Protection terms and conditions for more information »
                </Link>

                {buybackSuccess ? (
                  <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-6 text-center my-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-3">
                      ✓
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-1">
                      Vehicle Registered Successfully!
                    </h3>
                    <p className="text-[14px] text-gray-600 mb-4">
                      Your Buyback Protection certificate for VIN <strong>{bbVin || "JTDKN3DU5A1234567"}</strong> is active for the next 12 months.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBuybackSuccess(false)}
                      className="ac-btn inline-block text-white font-semibold px-6 py-2 text-[14px]"
                    >
                      Register Another Vehicle
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBuybackSubmit} className="space-y-6">
                    {/* Section 1: Contact Info */}
                    <div>
                      <h3 className="text-[16px] font-bold text-ac-ink border-b border-[#e2e8f0] pb-2 mb-4">
                        Your Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">First Name *</label>
                          <input required type="text" defaultValue="BYIRINGIRO" className={inputBase} />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">Last Name *</label>
                          <input required type="text" defaultValue="URBAN" className={inputBase} />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">Address 1 *</label>
                        <input required type="text" placeholder="Street Address / KG Street" className={inputBase} />
                      </div>

                      <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">Address 2 (optional)</label>
                        <input type="text" placeholder="Apartment, suite, unit" className={inputBase} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">City *</label>
                          <input required type="text" defaultValue="Kigali" className={inputBase} />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">Province / District *</label>
                          <select className="w-full h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            <option>Gasabo, Kigali</option>
                            <option>Kicukiro, Kigali</option>
                            <option>Nyarugenge, Kigali</option>
                            <option>Eastern Province</option>
                            <option>Northern Province</option>
                            <option>Southern Province</option>
                            <option>Western Province</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">ZIP / Postal Code</label>
                          <input type="text" placeholder="00000" className={inputBase} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">Phone Number *</label>
                          <input required type="tel" defaultValue="+250 788 123 456" className={inputBase} />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">E-mail Address *</label>
                          <input required type="email" defaultValue={userEmail} className={inputBase} />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Vehicle Info */}
                    <div>
                      <h3 className="text-[16px] font-bold text-ac-ink border-b border-[#e2e8f0] pb-2 mb-4">
                        Your Vehicle Information
                      </h3>

                      <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                          What is the VIN of the vehicle you wish to register for Buyback Protection? *
                        </label>
                        <input
                          required
                          type="text"
                          maxLength={17}
                          placeholder="Vehicle Identification Number"
                          value={bbVin}
                          onChange={(e) => setBbVin(e.target.value)}
                          className={inputBase}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">Vehicle Year *</label>
                          <select
                            value={bbYear}
                            onChange={(e) => setBbYear(e.target.value)}
                            className="w-full h-[34px] px-2 text-[14px] bg-white border border-[#ccc]"
                          >
                            {Array.from({ length: 25 }, (_, i) => 2026 - i).map((yr) => (
                              <option key={yr} value={yr}>
                                {yr}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">Make *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Toyota"
                            value={bbMake}
                            onChange={(e) => setBbMake(e.target.value)}
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-gray-700 mb-1">Model *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. RAV4"
                            value={bbModel}
                            onChange={(e) => setBbModel(e.target.value)}
                            className={inputBase}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                          When did you purchase this vehicle? *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                              <option key={m} value={idx + 1}>{m}</option>
                            ))}
                          </select>
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                          Who sold you the vehicle? Please provide the name and location of the individual or business. *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            <option value="dealer">Licensed Car Dealer in Rwanda</option>
                            <option value="private">Private Party / Individual Seller</option>
                            <option value="auction">Auction / Import Clearing Agent</option>
                          </select>
                          <input required type="text" placeholder="Dealer or Private Seller Name" className={inputBase} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input required type="text" placeholder="Seller City (e.g. Kigali)" className={inputBase} />
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            <option>Kigali City</option>
                            <option>Eastern Province</option>
                            <option>Northern Province</option>
                            <option>Southern Province</option>
                            <option>Western Province</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                          When did you purchase the AutoCheck vehicle history report for this vehicle? *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                              <option key={m} value={idx + 1}>{m}</option>
                            ))}
                          </select>
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <select className="h-[34px] px-2 text-[14px] bg-white border border-[#ccc]">
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
                        <button type="submit" className="ac-btn px-8 py-2.5 font-bold text-[15px]">
                          Register Now
                        </button>
                        <p className="text-[12px] text-gray-600">
                          By clicking &ldquo;Register Now&rdquo;, you agree to the AutoCheck Buyback Registration terms and conditions (see below).
                        </p>
                      </div>

                      {/* Terms Scrollbox */}
                      <div className="h-[120px] overflow-y-scroll border border-[#ccc] p-3 text-[11px] leading-[15px] text-gray-600 bg-[#fbfbfb] rounded font-mono">
                        <p className="mb-2 font-bold">1. Eligibility & Registration Window:</p>
                        <p className="mb-2">The Customer must have previously purchased the vehicle and own the vehicle at the time the claim is made. If the vehicle is subject to a lien in an unpaid amount greater than the amount identified in item 5, this Protection only applies if the Customer pays AutoCheck Rwanda the difference.</p>
                        <p className="mb-2 font-bold">2. Documentation Requirements:</p>
                        <p className="mb-2">The Customer must complete and submit to AutoCheck Rwanda an executed claim form and provide a complete copy of the Report. Any Dealer Customer must have obtained the Report through an AutoCheck Commercial Service prior to the purchase of the vehicle.</p>
                        <p className="mb-2 font-bold">3. Proof of Ownership:</p>
                        <p className="mb-2">The Customer must provide to AutoCheck Rwanda proof of ownership of the vehicle in the form of the original bill of sale and Carte Jaune (RRA motor vehicle registration certificate).</p>
                        <p className="mb-2 font-bold">4. Coverage Limitations:</p>
                        <p>Buyback Protection covers undisclosed branded titles including Salvage, Rebuilt, Flood Damage, Fire Damage, and Odometer Tampering that existed prior to report date but were omitted from the initial report.</p>
                      </div>

                      <div className="mt-2">
                        <Link
                          href="/vehiclehistory/terms-of-use"
                          className="text-[12px] text-ac-blue underline font-semibold"
                        >
                          View terms and conditions on a new screen »
                        </Link>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#f0f6fa] border border-[#cde0f5] rounded-[6px] p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Image
                      src="/images/BuybackProtection.png"
                      alt="AutoCheck Buyback Protection"
                      width={160}
                      height={80}
                      className="h-auto w-[150px] object-contain"
                    />
                  </div>
                  <h3 className="text-[16px] font-bold text-ac-blue mb-4">
                    Learn more about Buyback Protection:
                  </h3>
                  <ul className="space-y-2 text-[13px] text-left">
                    <li>
                      <Link href="/vehiclehistory/vehicle-buyback-protection" className="text-ac-blue font-semibold hover:underline">
                        What&apos;s Covered? »
                      </Link>
                    </li>
                    <li>
                      <Link href="/vehiclehistory/vehicle-buyback-protection" className="text-ac-blue font-semibold hover:underline">
                        What Makes Buyback Protection Different? »
                      </Link>
                    </li>
                    <li>
                      <Link href="/vehiclehistory/vehicle-buyback-protection" className="text-ac-blue font-semibold hover:underline">
                        How Does Buyback Protection Work? »
                      </Link>
                    </li>
                    <li>
                      <Link href="/vehiclehistory/dispute" className="text-ac-blue font-semibold hover:underline">
                        Make a Claim »
                      </Link>
                    </li>
                    <li>
                      <Link href="/vehiclehistory/terms-of-use" className="text-ac-blue font-semibold hover:underline">
                        Terms and Conditions »
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
