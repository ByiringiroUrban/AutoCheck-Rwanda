import type { MileageHistory, Report, TimelineItem } from "@/types/api";

export function isAiEvent(item: TimelineItem) {
  const text = `${item.event_type} ${item.title} ${item.source_type}`.toUpperCase();
  return text.includes("AI");
}

export function reportView(report: Report, mileage: MileageHistory | null) {
  const snapshot = report.snapshot;
  const vehicle = snapshot?.vehicle;
  const events = (snapshot?.timeline || []).filter((item) => !isAiEvent(item));
  const services = snapshot?.service_history || [];
  const inspections = snapshot?.inspection_history || [];
  const incidents = events.filter(
    (item) => item.event_type.toUpperCase().includes("INCIDENT") || item.title.toUpperCase().includes("ACCIDENT"),
  );
  const rollback = Boolean(mileage?.has_rollback_anomaly || snapshot?.mileage_rollback_warning);
  const latestMileage = mileage?.records?.at(-1)?.mileage ?? snapshot?.latest_mileage;
  const age = vehicle ? Math.max(0, new Date().getFullYear() - vehicle.year) : 0;
  const damageRows = (report.score_breakdown?.deductions || []).filter((item) => !item.category.toUpperCase().includes("AI"));
  return { snapshot, vehicle, events, services, inspections, incidents, rollback, latestMileage, age, damageRows };
}
