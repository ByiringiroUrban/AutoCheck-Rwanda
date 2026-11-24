import {
  AlertTriangle,
  CarFront,
  ClipboardCheck,
  Gauge,
  Gavel,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { MileageHistory, Report } from "@/types/api";
import { apiUrl } from "@/services/api";
import { formatWhen, riskLevel } from "@/utils/validation";
import { reportView } from "@/components/report/reportModel";

function Mark({ tone }: { tone: "ok" | "warn" | "bad" }) {
  const color = tone === "ok" ? "#28a745" : tone === "warn" ? "#fd7e14" : "#dc3545";
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: color }}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {tone === "bad" ? (
          <path d="M2 2l8 8M10 2l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        ) : tone === "warn" ? (
          <path d="M6 2v5M6 9v.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  );
}

function ScoreGauge({ score, gradientId }: { score: number; gradientId: string }) {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const radius = 44;
  const arc = Math.PI * radius;
  return (
    <div className="relative flex flex-col items-center">
      <svg width="108" height="60" viewBox="0 0 108 60" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="10" y1="54" x2="98" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f37920" />
            <stop offset="42%" stopColor="#ffc247" />
            <stop offset="72%" stopColor="#55ad68" />
            <stop offset="100%" stopColor="#0b4c4c" />
          </linearGradient>
        </defs>
        <path d="M 10 54 A 44 44 0 0 1 98 54" fill="none" stroke="#e0e0e0" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 54 A 44 44 0 0 1 98 54"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${pct * arc} ${arc}`}
        />
      </svg>
      <span className="absolute bottom-0 text-[22px] font-medium leading-none text-ac-ink">{score}</span>
    </div>
  );
}

function GlanceCard({
  title,
  status,
  statusLabel,
  icon: Icon,
}: {
  title: string;
  status: "ok" | "warn" | "bad";
  statusLabel: string;
  icon: LucideIcon;
}) {
  const color = status === "ok" ? "text-[#28a745]" : status === "warn" ? "text-[#fd7e14]" : "text-[#dc3545]";
  const iconColor = status === "ok" ? "text-[#0b4c4c]" : status === "warn" ? "text-[#f37920]" : "text-[#dc3545]";
  const band = status === "ok" ? "bg-[#eaf6ee]" : status === "warn" ? "bg-[#fff4e8]" : "bg-[#fff0ef]";
  return (
    <div className="flex min-h-[132px] flex-col overflow-hidden rounded-md border border-solid border-[#dfe5e3] bg-white">
      <div className="flex flex-1 items-start gap-2.5 p-3">
        <Icon size={31} strokeWidth={1.8} className={`mt-0.5 shrink-0 ${iconColor}`} aria-hidden="true" />
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-bold leading-[1.3] text-ac-ink">{title}</p>
          <p className="m-0 mt-1 text-[10px] leading-[1.4] text-[#66716d]">{statusLabel}</p>
        </div>
      </div>
      <div className={`flex min-h-8 items-center gap-2 px-2.5 py-1.5 ${band}`}>
        <Mark tone={status} />
        <span className={`text-[10px] font-bold ${color}`}>{status === "ok" ? "No issue found" : status === "warn" ? "Check details" : "Issue reported"}</span>
      </div>
    </div>
  );
}

export function ReportSheet({ report, mileage }: { report: Report; mileage: MileageHistory | null }) {
  const view = reportView(report, mileage);
  const { snapshot, vehicle, events, services, inspections, incidents, rollback, latestMileage, age, damageRows } = view;
  if (!snapshot || !vehicle) return null;
  const photo = snapshot.vehicle_image_url || snapshot.ai_visible_defects?.find((item) => item.image_url)?.image_url;
  const photoUrl = photo ? (/^https?:\/\//i.test(photo) ? photo : apiUrl(photo)) : null;
  const scoreColor = riskLevel(report.score) === "Low" ? "#28a745" : riskLevel(report.score) === "Moderate" ? "#fd7e14" : "#dc3545";

  return (
    <article className="ac-report-sheet overflow-hidden rounded-lg bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
      <header
        className="relative min-h-[112px] overflow-hidden border-b-[3px] border-solid border-ac-navy bg-cover bg-center px-4 py-3 sm:px-6"
        style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.88) 45%,rgba(255,255,255,.12) 100%),url('/images/home-hero.jpg')" }}
      >
        <div className="relative flex min-h-[84px] flex-wrap items-start justify-between gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-desktop.png" alt="AutoCheck Rwanda" width={180} className="h-auto max-w-[160px] rounded bg-white/90 p-1" />
          <div className="ml-auto rounded bg-white/85 px-3 py-1.5 text-right text-ac-navy shadow-sm">
            <p className="m-0 text-[13px] font-bold leading-tight">Vehicle History Report</p>
            <p className="m-0 mt-1 text-[9px] leading-tight">
              Report generated {formatWhen(report.generated_at)}
            </p>
            <p className="m-0 text-[9px] leading-tight">Report ID: {report.id.slice(0, 12).toUpperCase()}</p>
            <p className="m-0 text-[9px] font-semibold leading-tight">AutoCheck Rwanda · Kigali</p>
          </div>
        </div>
      </header>

      <section
        className="relative flex min-h-[72px] flex-wrap items-center justify-between gap-3 overflow-hidden bg-cover bg-center px-4 py-3 text-white sm:px-6"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(243,121,32,.98) 0%,rgba(236,100,20,.96) 58%,rgba(217,77,10,.48) 100%),url('${photoUrl || "/images/home-hero.jpg"}')`,
          backgroundPosition: "center, right 38%",
        }}
      >
        <div className="relative z-10">
          <h1 className="m-0 text-[16px] font-bold leading-tight sm:text-[18px]">Vehicle history at a glance</h1>
          <p className="m-0 mt-1 max-w-[580px] text-[10px] leading-[1.45] text-white/95 sm:text-[11px]">
            Review vehicle records before you buy. Report data reflects information currently available in the registry.
          </p>
        </div>
      </section>

      <section className="border-b border-solid border-[#e8e8e8] px-3 py-3 sm:px-4">
        <div className="grid gap-2 md:grid-cols-2 min-[760px]:grid-cols-[minmax(0,1.4fr)_minmax(0,.72fr)_minmax(0,.78fr)_minmax(0,1fr)]">
          <div className="min-w-0 rounded-md border border-solid border-[#e1e7e5] bg-white p-2.5">
            <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(115px,38%)] gap-2">
              <div className="min-w-0">
                <h2 className="m-0 text-[14px] font-bold leading-tight text-ac-navy sm:text-[16px]">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <p className="m-0 mt-0.5 text-[10px] text-[#626c68]">{vehicle.body_type} · {vehicle.fuel_type}</p>
                <table className="mt-2 w-full border-collapse text-[9px] sm:text-[10px]">
                  <tbody>
                    {[
                      ["VIN", vehicle.vin],
                      ["Class", vehicle.body_type],
                      ["Vehicle age", `${age} year(s)`],
                      ["Rwanda plate", snapshot.current_plate || "Not recorded"],
                    ].map(([label, value]) => (
                      <tr key={label} className="border-b border-solid border-[#edf0ef]">
                        <td className="whitespace-nowrap py-[3px] pr-1.5 font-semibold text-[#555]">{label}:</td>
                        <td className="break-all py-[3px] text-ac-ink">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="relative min-h-[112px] self-stretch overflow-hidden rounded border border-solid border-[#e6e9e8] bg-[#f3f5f3]">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#0b4c4c]/55">
                    <CarFront size={42} strokeWidth={1.4} aria-hidden="true" />
                    <span className="rounded bg-white/90 px-1.5 py-0.5 text-[7px] font-semibold text-[#555]">No vehicle photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-[150px] flex-col items-center justify-center rounded-md border border-solid border-[#e1e7e5] bg-white p-3 text-center">
            <div className="mb-1 flex items-center text-ac-magenta">
              <Users size={44} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <p className="m-0 text-[13px] font-bold text-ac-navy">Owners – {snapshot.ownership_count}</p>
            <p className="m-0 mt-1 text-[9px] text-[#66716d]">Ownership check</p>
            <p className="m-0 text-[10px] font-semibold text-ac-ink">{snapshot.verified_ownership ? "Verified" : "Not verified"}</p>
          </div>

          <div className="flex min-h-[150px] flex-col items-center justify-center rounded-md border border-solid border-[#e1e7e5] bg-white p-3 text-center">
            <p className="m-0 text-[11px] font-bold text-ac-navy">AutoCheck Score</p>
            <ScoreGauge score={report.score} gradientId={`report-score-gradient-${report.id}`} />
            <p className="m-0 mt-1 text-[9px] text-[#66716d]">{riskLevel(report.score)} risk · out of 100</p>
            <div className="mt-2 w-full max-w-[120px]">
              <div className="relative h-2 overflow-hidden rounded-full bg-[#e8ecea]">
                <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, report.score))}%`, backgroundColor: scoreColor }} />
              </div>
              <div className="mt-0.5 flex justify-between text-[8px] text-[#77817d]"><span>0</span><span>100</span></div>
            </div>
          </div>

          <div className="min-w-0 rounded-md border border-solid border-[#e1e7e5] bg-white p-2.5">
            <p className="m-0 mb-1 text-[10px] font-bold text-ac-navy">Damage / score factors</p>
            <table className="w-full border-collapse text-[9px] sm:text-[10px]">
              <thead>
                <tr className="bg-[#f3f5f4] text-[#4c5753]">
                  <th className="px-1.5 py-1 text-left font-semibold">Record</th>
                  <th className="px-1.5 py-1 text-right font-semibold">Effect</th>
                </tr>
              </thead>
              <tbody>
                {damageRows.length === 0 ? (
                  <tr><td className="px-1.5 py-1.5 text-[#59635f]" colSpan={2}>No score deductions recorded</td></tr>
                ) : (
                  damageRows.slice(0, 5).map((item) => (
                    <tr key={`${item.category}-${item.reason}`} className="border-b border-solid border-[#edf0ef]">
                      <td className="px-1.5 py-1">{item.category.replaceAll("_", " ")}</td>
                      <td className="px-1.5 py-1 text-right font-bold text-[#dc3545]">−{item.points_deducted}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <p className="m-0 mt-1 text-[8px] leading-tight text-[#6b7470]">Based on records currently available to this report.</p>
          </div>
        </div>
      </section>

      <section className="px-3 pb-3 pt-2 sm:px-4">
        <div className="flex items-center justify-between gap-2 rounded-t-md bg-[#063838] px-3 py-2 text-white">
          <h2 className="m-0 text-[12px] font-bold sm:text-[13px]">Vehicle History at a Glance</h2>
          <span className="text-[8px] sm:text-[9px]">{events.length + services.length + inspections.length} record(s) reviewed</span>
        </div>
        <div className="rounded-b-md border border-t-0 border-solid border-[#dfe5e3] p-2 sm:p-2.5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 min-[760px]:grid-cols-3">
            <GlanceCard
              icon={ShieldCheck}
              title="State / title brand"
              status="warn"
              statusLabel="No title-brand data available"
            />
            <GlanceCard
              icon={Gavel}
              title="Auction / import issues"
              status="warn"
              statusLabel="No auction or import data available"
            />
            <GlanceCard
              icon={AlertTriangle}
              title="Accident / damage"
              status={incidents.length ? "bad" : "ok"}
              statusLabel={incidents.length ? `${incidents.length} incident(s) reported` : "No incidents recorded"}
            />
            <GlanceCard
              icon={RefreshCw}
              title="Open recall check"
              status="warn"
              statusLabel="Recall data not available"
            />
            <GlanceCard
              icon={ShieldAlert}
              title="Insurance loss / transfer"
              status="warn"
              statusLabel="Insurance data not available"
            />
            <GlanceCard
              icon={Gauge}
              title="Odometer check"
              status={rollback ? "bad" : latestMileage == null ? "warn" : "ok"}
              statusLabel={rollback ? "Possible rollback detected" : latestMileage == null ? "No readings recorded" : `Last recorded ${latestMileage.toLocaleString()} km`}
            />
            <GlanceCard
              icon={CarFront}
              title="Certified pre-owned"
              status="warn"
              statusLabel="Certification data not available"
            />
            <GlanceCard
              icon={Wrench}
              title="Service / repair"
              status={services.length ? "ok" : "warn"}
              statusLabel={services.length ? `${services.length} service record(s)` : "No service records"}
            />
            <GlanceCard
              icon={ClipboardCheck}
              title="Additional history"
              status={inspections.length || snapshot.dispute_count ? "warn" : "ok"}
              statusLabel={inspections.length ? `${inspections.length} inspection(s) · ${snapshot.dispute_count} dispute(s)` : snapshot.dispute_count ? `${snapshot.dispute_count} dispute(s) recorded` : "No additional records"}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 rounded-md border border-solid border-[#f2d5bd] bg-[#fff8f1] p-2.5 sm:gap-4 sm:px-3">
            <ShieldCheck size={30} className="shrink-0 text-ac-magenta" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[10px] font-bold text-ac-navy">A clearer view of the vehicle&apos;s recorded history</p>
              <p className="m-0 text-[9px] leading-[1.4] text-[#5f6864]">
                This report reflects information currently available in the registry. A missing record does not confirm that an event never occurred.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-5">
        <div className="rounded-t-[6px] bg-ac-navy py-2 text-center text-[14px] font-medium text-white">Vehicle History Details</div>
        <div className="overflow-hidden rounded-b-[6px] border border-t-0 border-solid border-[#ddd]">
          <div className="border-b border-solid border-[#eee] p-4">
            <p className="m-0 text-[12px] text-[#555]">The following events have been reported to AutoCheck Rwanda.</p>
          </div>
          {events.length === 0 ? <p className="m-0 p-4 text-[13px] text-[#666]">No history events are stored for this vehicle.</p> : null}
          {events.map((item) => {
            const bad = (item.severity || "").toUpperCase() === "SEVERE" || (item.severity || "").toUpperCase() === "MAJOR" || item.title.toUpperCase().includes("ACCIDENT");
            const warn = rollback && item.title.toUpperCase().includes("ODOMETER");
            const tone = bad ? "bad" : warn ? "warn" : "ok";
            return (
              <div key={item.id} className="border-b border-solid border-[#eee] p-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <Mark tone={tone} />
                  <div className="flex-1">
                    <p className="m-0 text-[12px] font-medium text-ac-ink">{item.title}</p>
                    <div className="mt-2 rounded border border-solid border-[#eee] bg-[#fafafa] p-3 text-[11px] leading-[1.6]">
                      <p className="m-0">
                        <span className="font-medium text-[#555]">Date: </span>
                        {formatWhen(item.date)}
                      </p>
                      <p className="m-0">
                        <span className="font-medium text-[#555]">Source: </span>
                        {item.source_name || item.source_type}
                      </p>
                      {item.mileage != null ? (
                        <p className="m-0">
                          <span className="font-medium text-[#555]">Mileage: </span>
                          {item.mileage.toLocaleString()} km
                        </p>
                      ) : null}
                      <p className="m-0 mt-1 text-[#555]">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-t border-solid border-[#eee] p-4">
            <div className="flex items-start gap-3">
              <Mark tone={rollback ? "bad" : "ok"} />
              <div>
                <p className="m-0 text-[12px] font-medium text-ac-ink">Odometer calculation check</p>
                <p className="m-0 mt-1 text-[11px] text-[#555]">
                  {rollback
                    ? mileage?.anomaly_details || "A later reading is lower than an earlier one."
                    : latestMileage != null
                      ? `No odometer rollback detected. Last recorded ${latestMileage.toLocaleString()} km.`
                      : "No odometer readings have been recorded."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap justify-between gap-2 border-t border-solid border-[#ddd] bg-[#f8f9fa] px-5 py-3 text-[10px] text-[#777]">
        <span>
          VIN {vehicle.vin} | {snapshot.current_plate || "No plate"} | {vehicle.year} {vehicle.make} {vehicle.model}
        </span>
        <span>Score {report.score}</span>
      </footer>
    </article>
  );
}
