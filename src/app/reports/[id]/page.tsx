"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell, Alert, PageHeading, Spinner } from "@/components/ui";
import { VehicleIdentityCard } from "@/components/VehicleIdentityCard";
import { AutoCheckScoreCard } from "@/components/AutoCheckScoreCard";
import { HistoryTimeline } from "@/components/HistoryTimeline";
import { MileageHistoryChart } from "@/components/MileageHistoryChart";
import { ProvenanceBadge } from "@/components/HistoryTimeline";
import { ApiError, apiUrl } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { MileageHistory, Report } from "@/types/api";
import { formatWhen } from "@/utils/validation";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [mileage, setMileage] = useState<MileageHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const next = await endpoints.getReport(params.id);
        if (cancelled) return;
        setReport(next);
        try {
          const history = await endpoints.vehicleMileage(next.vehicle_id);
          if (!cancelled) setMileage(history);
        } catch {
          if (!cancelled) setMileage(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "This report could not be loaded.");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const snapshot = report?.snapshot;

  return (
    <AppShell>
      <PageHeading title="Vehicle history report" subtitle={report ? `Generated ${formatWhen(report.generated_at)} · ${report.id}` : "Loading snapshot"} />
      <div className="ac-container mt-6 space-y-5">
        {!report && !error ? <Spinner label="Loading report…" /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {report && snapshot ? (
          <>
            <VehicleIdentityCard vehicle={{ ...snapshot.vehicle, current_plate: snapshot.current_plate }} mask={false} />
            <AutoCheckScoreCard score={report.score} breakdown={report.score_breakdown} />
            <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
              <h2 className="m-0 mb-4 text-[18px] font-bold">History timeline</h2>
              <HistoryTimeline items={snapshot.timeline || []} />
            </section>
            <MileageHistoryChart
              records={mileage?.records || []}
              anomaly={mileage?.has_rollback_anomaly || snapshot.mileage_rollback_warning}
              anomalyDetails={mileage?.anomaly_details}
            />
            <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
              <h2 className="m-0 mb-3 text-[18px] font-bold">Service records</h2>
              {(snapshot.service_history || []).length === 0 ? <p className="text-[14px] text-[#666]">No service records in this snapshot.</p> : null}
              <ul className="m-0 list-none space-y-3 p-0">
                {(snapshot.service_history || []).map((record) => (
                  <li key={record.id} className="rounded-[6px] bg-[#f8f9fa] p-3 text-[14px]">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <strong>{record.service_type.replaceAll("_", " ")}</strong>
                      <ProvenanceBadge source={record.source_type} />
                    </div>
                    <p className="m-0 text-[#444]">{record.description}</p>
                    <p className="m-0 mt-1 text-[12px] text-[#777]">
                      {formatWhen(record.service_date)} · {record.mileage.toLocaleString()} km
                      {record.organization_name ? ` · ${record.organization_name}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
              <h2 className="m-0 mb-3 text-[18px] font-bold">Inspections</h2>
              {(snapshot.inspection_history || []).length === 0 ? <p className="text-[14px] text-[#666]">No physical inspections in this snapshot.</p> : null}
              {(snapshot.inspection_history || []).map((inspection) => (
                <article key={inspection.id} className="mb-4">
                  <p className="m-0 font-bold">
                    {inspection.inspection_type.replaceAll("_", " ")} · {inspection.status}
                  </p>
                  <p className="m-0 text-[13px] text-[#666]">
                    {formatWhen(inspection.inspected_at)} · {inspection.mileage.toLocaleString()} km
                  </p>
                  <ul className="mt-2 list-none p-0 text-[13px]">
                    {(inspection.items || []).map((item) => (
                      <li key={item.id} className="border-b border-solid border-[#f1f1f1] py-1">
                        {item.category}: {item.item} — {item.condition}
                        {item.severity !== "NONE" ? ` (${item.severity})` : ""}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
            <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
              <h2 className="m-0 mb-3 text-[18px] font-bold">AI exterior findings</h2>
              {(snapshot.ai_visible_defects || []).length === 0 ? (
                <p className="text-[14px] text-[#666]">No AI findings are attached to this snapshot.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {snapshot.ai_visible_defects.map((finding) => {
                    const src = finding.image_url
                      ? finding.image_url.startsWith("http")
                        ? finding.image_url
                        : apiUrl(finding.image_url)
                      : null;
                    const box = finding.bbox;
                    return (
                      <article key={finding.id} className="rounded-[6px] border border-solid border-[#eee] p-3">
                        {src && box && box.length === 4 ? (
                          <div className="relative mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" className="w-full rounded" />
                            <span
                              className="absolute border-2 border-solid border-ac-magenta"
                              style={{
                                top: `${box[0] * 100}%`,
                                left: `${box[1] * 100}%`,
                                height: `${(box[2] - box[0]) * 100}%`,
                                width: `${(box[3] - box[1]) * 100}%`,
                              }}
                            />
                          </div>
                        ) : null}
                        <ProvenanceBadge source="AI_ANALYSIS" />
                        <p className="m-0 mt-2 font-bold">{finding.defect_type.replaceAll("_", " ")}</p>
                        <p className="m-0 text-[13px] text-[#555]">
                          {finding.location.replaceAll("_", " ")} · {finding.severity} · {Math.round(finding.confidence * 100)}% confidence
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
            {snapshot.disclaimer ? <p className="text-[12px] text-[#777]">{snapshot.disclaimer}</p> : null}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
