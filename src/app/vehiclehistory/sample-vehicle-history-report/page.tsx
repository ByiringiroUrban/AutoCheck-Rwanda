import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Vehicle History Report | AutoCheck Rwanda",
  description:
    "See a sample AutoCheck Rwanda vehicle history report to understand what information is included before you purchase.",
};

// ── Small reusable atoms ────────────────────────────────────────────────────

function GreenCheck() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#28a745] flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function AmberWarn() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#fd7e14] flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M6 2v5M6 9v.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function RedAlert() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#dc3545] flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

type GlanceCardProps = {
  icon: React.ReactNode;
  title: string;
  status: "ok" | "warn" | "bad";
  statusLabel: string;
};

function GlanceCard({ icon, title, status, statusLabel }: GlanceCardProps) {
  const colors = {
    ok: "text-[#28a745]",
    warn: "text-[#fd7e14]",
    bad: "text-[#dc3545]",
  };
  const badges = { ok: <GreenCheck />, warn: <AmberWarn />, bad: <RedAlert /> };
  return (
    <div className="flex flex-col items-center justify-between border border-solid border-[#ddd] rounded-[6px] p-3 text-center min-h-[120px]">
      <div className="text-[32px] mb-1">{icon}</div>
      <p className="m-0 text-[11px] font-semibold text-ac-ink leading-[1.3]">{title}</p>
      <div className="flex items-center gap-1 mt-2">
        {badges[status]}
        <span className={`text-[11px] font-bold ${colors[status]}`}>{statusLabel}</span>
      </div>
    </div>
  );
}

// ── Score gauge (CSS-only arc) ──────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  // We draw a half-circle arc using SVG
  const pct = score / 100;
  const r = 44;
  const cx = 54;
  const cy = 54;
  const arcLen = Math.PI * r; // half-circle circumference
  const dash = pct * arcLen;
  return (
    <div className="relative flex flex-col items-center">
      <svg width="108" height="60" viewBox="0 0 108 60">
        {/* Track */}
        <path
          d={`M 10 54 A ${r} ${r} 0 0 1 98 54`}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M 10 54 A ${r} ${r} 0 0 1 98 54`}
          fill="none"
          stroke="#28a745"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${arcLen}`}
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center" style={{ bottom: -4 }}>
        <span className="text-[28px] font-bold text-ac-ink leading-none">{score}</span>
      </div>
    </div>
  );
}

// ── Section heading bar ─────────────────────────────────────────────────────
function SectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1e427a] text-white text-center py-2 px-4 text-[14px] font-bold rounded-t-[6px] mb-0">
      {children}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function SampleReportPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f2f2f2] pb-[40px]">
        {/* Page label */}
        <div className="bg-white border-b border-solid border-[#ddd] py-3">
          <div className="ac-container text-center">
            <span className="inline-block bg-[#af1685] text-white text-[12px] font-bold px-4 py-1 rounded-full tracking-wide uppercase">
              Sample Report — for illustration purposes only
            </span>
          </div>
        </div>

        <div className="ac-container mt-[20px]">
          {/* ════════════════════════════════════════════════════════
              REPORT WRAPPER
          ════════════════════════════════════════════════════════ */}
          <div className="bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)] rounded-[8px] overflow-hidden">

            {/* ── REPORT HEADER ── */}
            <div
              className="relative px-5 pt-4 pb-4"
              style={{
                background: "linear-gradient(135deg, #f0f4ff 0%, #e8edf8 60%, #f5f0ff 100%)",
                borderBottom: "3px solid #1e427a",
              }}
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-48 h-32 opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle at 80% 20%, #af1685 0%, transparent 70%)" }} />

              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Left: AutoCheck Rwanda logo */}
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo-desktop.png"
                    alt="AutoCheck Rwanda"
                    width={180}
                    className="h-auto"
                    style={{ maxWidth: 180 }}
                  />
                </div>

                {/* Centre: report meta */}
                <div className="text-center flex-1 text-[11px] text-[#444] leading-[1.6]">
                  <p className="m-0 font-semibold text-[#1e427a]">
                    This report was generated on <span className="font-bold">August 15, 2024 | 10:22:47 CAT</span>
                  </p>
                  <p className="m-0">and brought to you by:</p>
                  <span className="inline-block mt-1 bg-[#1e427a] text-white text-[11px] font-bold px-3 py-[2px] rounded">
                    Kigali Elite Dealers
                  </span>
                  <p className="m-0 mt-1">
                    14 KN 3 Ave, Kigali, Rwanda 00000<br />
                    +250 788 123 456 | www.kigalielitedealers.rw
                  </p>
                </div>

                {/* Right: empty for balance on mobile */}
                <div className="hidden md:block w-[180px]" />
              </div>
            </div>

            {/* ── PRE-QUALIFY BANNER ── */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              style={{ background: "linear-gradient(90deg, #1e427a 0%, #2d60b0 100%)" }}
            >
              <div className="text-white">
                <p className="m-0 text-[16px] font-bold">Pre-qualify Online</p>
                <p className="m-0 text-[12px] opacity-85">
                  Get a financing offer in minutes without affecting your credit score.<br />
                  <span className="text-[11px]">Brought to you by Kigali Elite Dealers</span>
                </p>
              </div>
              <button
                type="button"
                className="flex-shrink-0 bg-[#af1685] hover:bg-[#d81ba4] text-white font-bold text-[14px] px-6 py-2 rounded-full cursor-pointer border-0 transition-colors duration-150 shadow"
              >
                Get Prequalified! →
              </button>
            </div>

            {/* ── VEHICLE SUMMARY ROW ── */}
            <div className="px-5 py-5 border-b border-solid border-[#e8e8e8]">
              <div className="flex flex-wrap gap-6 items-start">
                {/* Vehicle details */}
                <div className="flex-1 min-w-[200px]">
                  <h2 className="m-0 text-[18px] font-bold text-ac-ink">2019 Toyota Land Cruiser Prado</h2>
                  <p className="m-0 text-[12px] text-[#666]">TX-L 2.8 Diesel 4WD</p>
                  <table className="mt-3 text-[12px] border-collapse w-full">
                    <tbody>
                      {[
                        ["VIN", "JTEBH3FJ2LK123456"],
                        ["Class", "SUV – Luxury"],
                        ["Country of Assembly", "Japan"],
                        ["Vehicle Age", "5 year(s)"],
                        ["Rwanda Plate", "RAB 456C"],
                      ].map(([label, val]) => (
                        <tr key={label} className="border-b border-solid border-[#f0f0f0]">
                          <td className="py-[3px] pr-3 font-semibold text-[#555] whitespace-nowrap">{label}:</td>
                          <td className="py-[3px] text-ac-ink">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Owners */}
                <div className="flex flex-col items-center min-w-[110px]">
                  <div className="flex gap-[-4px] mb-1">
                    {[1, 2].map((i) => (
                      <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill="#1e427a" className={i > 1 ? "-ml-2" : ""}>
                        <circle cx="12" cy="7" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    ))}
                  </div>
                  <p className="m-0 text-[20px] font-bold text-ac-ink">Owners – 2</p>
                  <p className="m-0 mt-1 text-[11px] text-[#666]">Vehicle Usage</p>
                  <p className="m-0 text-[12px] font-semibold text-ac-ink">Personal</p>
                </div>

                {/* AutoCheck Score */}
                <div className="flex flex-col items-center min-w-[130px]">
                  <p className="m-0 mb-1 text-[13px] font-bold text-ac-ink">AutoCheck Score</p>
                  <ScoreGauge score={88} />
                  <p className="m-0 mt-3 text-[10px] text-center text-[#666] leading-[1.4]">
                    Similar vehicles usually range between<br />
                    <span className="font-bold text-ac-ink">80 and 95</span>
                  </p>
                  <a href="#" className="mt-1 text-[11px] text-ac-blue hover:underline">More Information ℹ</a>
                </div>

                {/* Damage table */}
                <div className="min-w-[180px]">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#f5f5f5]">
                        <th className="text-left py-[4px] px-2 font-semibold text-[#555]">Damage Type</th>
                        <th className="text-left py-[4px] px-2 font-semibold text-[#555]">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Damage", ""],
                        ["Collision/Damage", "Severe"],
                        ["Collision/Damage", "Minor"],
                        ["Fire", ""],
                        ["Damage", "Minor"],
                      ].map(([type, sev], i) => (
                        <tr key={i} className="border-b border-solid border-[#f0f0f0]">
                          <td className="py-[3px] px-2">{type}</td>
                          <td className={`py-[3px] px-2 font-bold ${sev === "Severe" ? "text-[#dc3545]" : sev === "Minor" ? "text-[#444]" : ""}`}>
                            {sev}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-[10px] text-[#666] leading-[1.4]">
                    See Vehicle History Details Section for more information on these accident/damage events.
                  </p>
                </div>
              </div>
            </div>

            {/* ── VEHICLE HISTORY AT A GLANCE ── */}
            <div className="px-5 pb-5 pt-0">
              <SectionBar>Vehicle History at a Glance</SectionBar>
              <div
                className="border border-solid border-[#ddd] border-t-0 rounded-b-[6px] p-4"
              >
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <GlanceCard
                    icon="🛡️"
                    title="State Title Brand"
                    status="ok"
                    statusLabel="No Issue"
                  />
                  <GlanceCard
                    icon="🔨"
                    title="Auction Brand / Issues"
                    status="warn"
                    statusLabel="Auction Issue Reported"
                  />
                  <GlanceCard
                    icon="💥"
                    title="Accident / Damage Airbag deployed"
                    status="bad"
                    statusLabel="Severe"
                  />
                  <GlanceCard
                    icon="🔁"
                    title="Open Recall Check"
                    status="ok"
                    statusLabel="No Open Recalls"
                  />
                  <GlanceCard
                    icon="📋"
                    title="Insurance Loss / Transfer"
                    status="ok"
                    statusLabel="No Issue"
                  />
                  <GlanceCard
                    icon="🔢"
                    title="Odometer Check Last reported: 94,948 (08/31/2023)"
                    status="ok"
                    statusLabel="No Issue"
                  />
                  <GlanceCard
                    icon="📄"
                    title="CPO Sold as CPO on 7/15/18"
                    status="ok"
                    statusLabel="Certified Pre-Owned"
                  />
                  <GlanceCard
                    icon="🔧"
                    title="Service / Repair"
                    status="ok"
                    statusLabel="No Issue"
                  />
                  <GlanceCard
                    icon="📑"
                    title="Additional History Theft recovered history, Inspection Performed"
                    status="warn"
                    statusLabel="Problem Reported"
                  />
                </div>

                {/* Buyback assurance */}
                <div className="mt-4 flex flex-wrap items-center gap-4 border border-solid border-[#cde0f5] rounded-[6px] bg-[#f4f9ff] p-4">
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/BuybackProtection.png" alt="Buyback Protection" width={64} className="h-auto" />
                  </div>
                  <div className="flex-1">
                    <p className="m-0 text-[13px] font-bold text-ac-ink">This vehicle is AutoCheck Assured™</p>
                    <p className="m-0 text-[11px] text-[#555] leading-[1.5]">
                      This vehicle does not have any state title brands or other major problems reported.{" "}
                      <a href="/vehiclehistory/vehicle-buyback-protection" className="text-ac-blue hover:underline">
                        Terms &amp; Conditions
                      </a>
                    </p>
                  </div>
                  <a
                    href="/vehiclehistory/vehicle-buyback-protection"
                    className="flex-shrink-0 ac-btn px-6 py-2 text-[13px] no-underline"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>

            {/* ── VEHICLE HISTORY DETAILS ── */}
            <div className="px-5 pb-5">
              <SectionBar>Vehicle History Details</SectionBar>
              <div className="border border-solid border-[#ddd] border-t-0 rounded-b-[6px] overflow-hidden">

                {/* Reported to AutoCheck Rwanda */}
                <div className="p-4 border-b border-solid border-[#eee]">
                  <p className="m-0 text-[12px] text-[#555]">
                    The following events have been reported to AutoCheck Rwanda:
                  </p>
                </div>

                {/* Accident record */}
                <div className="p-4 border-b border-solid border-[#eee]">
                  <div className="flex items-start gap-3">
                    <RedAlert />
                    <div className="flex-1">
                      <p className="m-0 text-[12px] font-bold text-ac-ink">Accident / Damage Reported</p>
                      <div className="mt-2 bg-[#fff8f8] border border-solid border-[#f5c6cb] rounded p-3 text-[11px] leading-[1.6]">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr>
                              <td className="pr-4 font-semibold text-[#555] whitespace-nowrap">Date:</td>
                              <td>March 14, 2023</td>
                            </tr>
                            <tr>
                              <td className="pr-4 font-semibold text-[#555]">Source:</td>
                              <td>Rwanda National Police Traffic Division</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-2">
                          <p className="m-0 font-bold text-[#333]">Details</p>
                          <p className="m-0 text-[#555]">
                            VEHICLE INSPECTION PERFORMED<br />
                            INSPECTION FOUND VERY MINOR DAMAGE<br />
                            FRONT REPAIR REPORTED
                          </p>
                          <a href="#" className="text-ac-blue hover:underline text-[11px]">View the complete Report</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recall record */}
                <div className="p-4 border-b border-solid border-[#eee]">
                  <div className="flex items-start gap-3">
                    <GreenCheck />
                    <div className="flex-1">
                      <p className="m-0 text-[12px] font-bold text-ac-ink">Open Recall Check</p>
                      <p className="m-0 mt-1 text-[11px] text-[#666]">
                        Parts replaced or fixed. Service bulletins if available are not part of open recalls.
                      </p>

                      <div className="mt-3 bg-[#fffbf2] border border-solid border-[#ffe69c] rounded p-3 text-[11px] leading-[1.6]">
                        <p className="m-0 font-bold text-[#333]">Campaign Description</p>
                        <p className="m-0 text-[#555]">
                          Safety Recall 2022-19 ILX DRIVESHAFT<br />
                          SEPARATION SAFETY RECALL
                        </p>
                        <p className="m-0 mt-1">
                          Contact an authorized{" "}
                          <a href="#" className="text-ac-blue hover:underline">Accra Dealer</a>
                          {" "}to schedule repair.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Odometer */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <GreenCheck />
                    <div className="flex-1">
                      <p className="m-0 text-[12px] font-bold text-ac-ink">Odometer Calculation Check</p>
                      <div className="mt-2 bg-[#f4fff6] border border-solid border-[#b7e4c7] rounded p-3 text-[11px] leading-[1.6]">
                        <div className="flex items-center gap-2">
                          <GreenCheck />
                          <span className="font-semibold text-[#28a745]">No issues reported.</span>
                        </div>
                        <p className="m-0 mt-1 text-[#555]">
                          No odometer rollback or discrepancy detected. Last recorded: <strong>94,948 km</strong> (August 31, 2023).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── REPORT FOOTER ── */}
            <div className="border-t border-solid border-[#ddd] bg-[#f8f9fa] px-5 py-3 text-[10px] text-[#777] flex flex-wrap justify-between gap-2">
              <span>VIN: JTEBH3FJ2LK123456 | RAB 456C | 2019 Toyota Land Cruiser Prado TX-L</span>
              <span>No issues reported on title</span>
            </div>
          </div>

          {/* ── CTA below report ── */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-[#555] mb-3">
              This is a sample report. Run a real report on any vehicle in Rwanda.
            </p>
            <a
              href="/#vehiclehistoryreport"
              className="ac-btn inline-flex px-8 py-3 text-[15px] font-semibold no-underline"
            >
              Search a Vehicle Now
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
