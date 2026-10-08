"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import { Alert, Spinner } from "@/components/ui";
import { ReportSheet } from "@/components/report/ReportSheet";
import { downloadReportPdf } from "@/components/report/reportPdf";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { MileageHistory, Report } from "@/types/api";

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

  return (
    <div className="min-h-screen bg-[#f2f2f2] py-6">
      <div className="mx-auto max-w-[980px] px-3">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            className="ac-btn inline-flex items-center gap-2 px-4"
            disabled={!report?.snapshot?.vehicle}
            onClick={() => report && downloadReportPdf(report, mileage)}
          >
            <Download size={15} />
            Download PDF
          </button>
        </div>
        {!report && !error ? <Spinner label="Loading report…" /> : null}
        {error ? <Alert>{error}</Alert> : null}
        {report ? <ReportSheet report={report} mileage={mileage} /> : null}
      </div>
    </div>
  );
}
