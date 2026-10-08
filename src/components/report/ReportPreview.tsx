"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, X } from "lucide-react";
import { Alert, Spinner } from "@/components/ui";
import { ReportSheet } from "@/components/report/ReportSheet";
import { downloadReportPdf } from "@/components/report/reportPdf";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { MileageHistory, Report } from "@/types/api";

export function ReportPreview({ reportId, onClose }: { reportId: string; onClose: () => void }) {
  const [report, setReport] = useState<Report | null>(null);
  const [mileage, setMileage] = useState<MileageHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setReport(null);
      setMileage(null);
      setError(null);
      try {
        const next = await endpoints.getReport(reportId);
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
  }, [reportId]);

  const vehicle = report?.snapshot?.vehicle;
  const title = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Vehicle report";

  return createPortal(
    <div className="fixed inset-0 z-[450] flex items-center justify-center p-3 md:p-6">
      <button type="button" aria-label="Close preview" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-solid border-[#e3ebeb] px-4 py-3">
          <div className="min-w-0">
            <p className="m-0 flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-[#7a8686]">
              <Eye size={14} />
              Preview
            </p>
            <h2 className="m-0 mt-1 truncate text-[16px] font-medium text-ac-navy">{title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="ac-btn inline-flex items-center gap-2 px-4"
              disabled={!report?.snapshot?.vehicle}
              onClick={() => report && downloadReportPdf(report, mileage)}
            >
              <Download size={15} />
              Download PDF
            </button>
            <button type="button" aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg bg-transparent text-[#667] hover:bg-[#f4f8f8]" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </header>
        <div className="overflow-y-auto bg-[#f2f2f2] p-3 md:p-4">
          {!report && !error ? <Spinner label="Loading report…" /> : null}
          {error ? <Alert>{error}</Alert> : null}
          {report ? <ReportSheet report={report} mileage={mileage} /> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
