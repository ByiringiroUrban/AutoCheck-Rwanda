"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ImageUploader, emptySlots, type UploadSlot } from "@/components/ImageUploader";
import { ProvenanceBadge } from "@/components/HistoryTimeline";
import { DashboardFrame } from "@/components/DashboardFrame";
import { Alert, Spinner, fieldClass } from "@/components/ui";
import { ApiError, apiUrl } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { lookupVehicle } from "@/hooks/useVehicleSearch";
import type { AiInspection } from "@/types/api";
import { OWNER_ROLES } from "@/utils/roles";

const ANGLES = [
  { viewType: "FRONT", label: "Front" },
  { viewType: "REAR", label: "Rear" },
  { viewType: "LEFT_SIDE", label: "Left side" },
  { viewType: "RIGHT_SIDE", label: "Right side" },
  { viewType: "DAMAGE_DETAIL", label: "Close-up" },
];

export default function AiInspectionPage() {
  return (
    <ProtectedRoute allow={OWNER_ROLES}>
      <AiBody />
    </ProtectedRoute>
  );
}

function AiBody() {
  const [vin, setVin] = useState("");
  const [slots, setSlots] = useState<UploadSlot[]>(() => emptySlots(ANGLES));
  const [job, setJob] = useState<AiInspection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "running" | "done">("form");

  const run = async () => {
    setError(null);
    const chosen = slots.filter((slot) => slot.file);
    if (!chosen.length) {
      setError("Add at least one exterior photo.");
      return;
    }
    setPhase("running");
    try {
      const vehicle = await lookupVehicle("vin", vin);
      const urls: string[] = [];
      for (const slot of chosen) {
        if (!slot.file) continue;
        const uploaded = await endpoints.uploadImage(vehicle.id, slot.file, slot.viewType, "VEHICLE_OWNER");
        urls.push(uploaded.upload_url);
      }
      const created = await endpoints.createAiInspection({ vehicle_id: vehicle.id, image_urls: urls });
      let current = created;
      for (let attempt = 0; attempt < 5 && current.status !== "COMPLETED" && current.status !== "FAILED"; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        current = await endpoints.getAiInspection(created.id);
      }
      setJob(current);
      setPhase("done");
      if (current.status === "FAILED") setError(current.error_message || "The inspection failed.");
    } catch (err) {
      setPhase("form");
      setError(err instanceof ApiError ? err.message : "The inspection could not be started.");
    }
  };

  return (
    <DashboardFrame title="AI image inspection" subtitle="Upload exterior photos. Findings include a defect, severity, and confidence.">
      <div className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        {phase === "running" ? <Spinner label="Uploading photos and waiting for the inspection…" /> : null}
        {phase !== "done" ? (
          <>
            <input value={vin} onChange={(event) => setVin(event.target.value.toUpperCase())} maxLength={17} placeholder="Vehicle VIN" className={`${fieldClass} max-w-md`} />
            <ImageUploader slots={slots} onChange={setSlots} />
            <button type="button" className="ac-btn px-5" onClick={() => void run()} disabled={phase === "running"}>
              Run inspection
            </button>
          </>
        ) : null}
        {job ? (
          <section className="space-y-3">
            <p className="text-[14px]">
              Job {job.id} · {job.status} · {job.model_version} · {job.total_defects_found} finding{job.total_defects_found === 1 ? "" : "s"}
            </p>
            {job.findings.length === 0 ? <Alert tone="ok">No visible defects were returned.</Alert> : null}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {job.findings.map((finding) => {
                const src = finding.image_url ? (finding.image_url.startsWith("http") ? finding.image_url : apiUrl(finding.image_url)) : null;
                return (
                  <article key={finding.id} className="rounded-[8px] border border-solid border-[#ddd] bg-white p-4">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt="" className="mb-2 w-full rounded" />
                    ) : null}
                    <ProvenanceBadge source="AI_ANALYSIS" />
                    <h2 className="m-0 mt-2 text-[16px] font-bold">{finding.defect_type.replaceAll("_", " ")}</h2>
                    <p className="m-0 text-[13px] text-[#555]">
                      {finding.location.replaceAll("_", " ")} · {finding.severity} · {Math.round(finding.confidence * 100)}% confidence
                    </p>
                  </article>
                );
              })}
            </div>
            <button type="button" className="text-[14px] font-semibold text-ac-blue" onClick={() => setPhase("form")}>
              Run another inspection
            </button>
          </section>
        ) : null}
      </div>
    </DashboardFrame>
  );
}
