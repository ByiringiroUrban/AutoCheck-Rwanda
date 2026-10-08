import type { MileageHistory, Report } from "@/types/api";
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

function ScoreGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const radius = 44;
  const arc = Math.PI * radius;
  const risk = riskLevel(score);
  const stroke = risk === "Low" ? "#28a745" : risk === "Moderate" ? "#fd7e14" : "#dc3545";
  return (
    <div className="relative flex flex-col items-center">
      <svg width="108" height="60" viewBox="0 0 108 60" aria-hidden="true">
        <path d="M 10 54 A 44 44 0 0 1 98 54" fill="none" stroke="#e0e0e0" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 54 A 44 44 0 0 1 98 54"
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${pct * arc} ${arc}`}
        />
      </svg>
      <span className="absolute bottom-0 text-[22px] font-medium leading-none text-ac-ink">{score}</span>
    </div>
  );
}

function GlanceCard({ title, status, statusLabel }: { title: string; status: "ok" | "warn" | "bad"; statusLabel: string }) {
  const color = status === "ok" ? "text-[#28a745]" : status === "warn" ? "text-[#fd7e14]" : "text-[#dc3545]";
  return (
    <div className="flex min-h-[96px] flex-col items-center justify-between rounded-[6px] border border-solid border-[#ddd] p-3 text-center">
      <p className="m-0 text-[11px] font-medium leading-[1.3] text-ac-ink">{title}</p>
      <div className="mt-2 flex items-center gap-1">
        <Mark tone={status} />
        <span className={`text-[11px] font-medium ${color}`}>{statusLabel}</span>
      </div>
    </div>
  );
}

export function ReportSheet({ report, mileage }: { report: Report; mileage: MileageHistory | null }) {
  const view = reportView(report, mileage);
  const { snapshot, vehicle, events, services, inspections, incidents, rollback, latestMileage, age, damageRows } = view;
  if (!snapshot || !vehicle) return null;

  return (
    <article className="overflow-hidden rounded-[8px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
      <header className="border-b-[3px] border-solid border-ac-navy bg-[#f4f7fb] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-desktop.png" alt="AutoCheck Rwanda" width={180} className="h-auto max-w-[180px]" />
          <div className="min-w-[220px] flex-1 text-center text-[11px] leading-[1.6] text-[#444]">
            <p className="m-0 font-medium text-ac-navy">
              This report was generated on <span className="font-medium">{formatWhen(report.generated_at)}</span>
            </p>
            <p className="m-0">and brought to you by:</p>
            <span className="mt-1 inline-block rounded bg-ac-navy px-3 py-[2px] text-[11px] font-medium text-white">AutoCheck Rwanda</span>
            <p className="m-0 mt-1">Kigali, Rwanda</p>
          </div>
          <div className="hidden w-[180px] md:block" />
        </div>
      </header>

      <section className="border-b border-solid border-[#e8e8e8] px-5 py-5">
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-[200px] flex-1">
            <h1 className="m-0 text-[18px] font-medium text-ac-ink">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="m-0 text-[12px] text-[#666]">
              {vehicle.body_type} · {vehicle.fuel_type}
            </p>
            <table className="mt-3 w-full border-collapse text-[12px]">
              <tbody>
                {[
                  ["VIN", vehicle.vin],
                  ["Class", vehicle.body_type],
                  ["Vehicle age", `${age} year(s)`],
                  ["Rwanda plate", snapshot.current_plate || "Not recorded"],
                  ["Colour", vehicle.color],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-solid border-[#f0f0f0]">
                    <td className="whitespace-nowrap py-[3px] pr-3 font-medium text-[#555]">{label}:</td>
                    <td className="py-[3px] text-ac-ink">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex min-w-[110px] flex-col items-center">
            <p className="m-0 text-[16px] font-medium text-ac-ink">Owners – {snapshot.ownership_count}</p>
            <p className="m-0 mt-1 text-[11px] text-[#666]">Ownership check</p>
            <p className="m-0 text-[12px] font-medium text-ac-ink">{snapshot.verified_ownership ? "Verified" : "Not verified"}</p>
          </div>

          <div className="flex min-w-[130px] flex-col items-center">
            <p className="m-0 mb-1 text-[13px] font-medium text-ac-ink">AutoCheck Score</p>
            <ScoreGauge score={report.score} />
            <p className="m-0 mt-3 text-center text-[10px] leading-[1.4] text-[#666]">{riskLevel(report.score)} risk</p>
          </div>

          <div className="min-w-[180px]">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="px-2 py-[4px] text-left font-medium text-[#555]">Record</th>
                  <th className="px-2 py-[4px] text-left font-medium text-[#555]">Effect</th>
                </tr>
              </thead>
              <tbody>
                {damageRows.length === 0 ? (
                  <tr>
                    <td className="px-2 py-[3px]" colSpan={2}>
                      No score deductions
                    </td>
                  </tr>
                ) : (
                  damageRows.map((item) => (
                    <tr key={`${item.category}-${item.reason}`} className="border-b border-solid border-[#f0f0f0]">
                      <td className="px-2 py-[3px]">{item.category}</td>
                      <td className="px-2 py-[3px] font-medium text-[#dc3545]">−{item.points_deducted}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 pb-5">
        <div className="rounded-t-[6px] bg-ac-navy py-2 text-center text-[14px] font-medium text-white">Vehicle History at a Glance</div>
        <div className="rounded-b-[6px] border border-t-0 border-solid border-[#ddd] p-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <GlanceCard
              title={latestMileage != null ? `Odometer check. Last recorded ${latestMileage.toLocaleString()} km` : "Odometer check"}
              status={rollback ? "bad" : latestMileage == null ? "warn" : "ok"}
              statusLabel={rollback ? "Rollback reported" : latestMileage == null ? "No reading" : "No issue"}
            />
            <GlanceCard
              title="Service / repair"
              status={services.length ? "ok" : "warn"}
              statusLabel={services.length ? `${services.length} record(s)` : "None recorded"}
            />
            <GlanceCard
              title="Inspection"
              status={inspections.length ? "ok" : "warn"}
              statusLabel={inspections.length ? `${inspections.length} recorded` : "None recorded"}
            />
            <GlanceCard
              title="Accident / damage"
              status={incidents.length ? "bad" : "ok"}
              statusLabel={incidents.length ? `${incidents.length} reported` : "No issue"}
            />
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
