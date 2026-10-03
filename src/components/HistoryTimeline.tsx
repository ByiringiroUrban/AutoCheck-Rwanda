import type { TimelineItem } from "@/types/api";
import { formatWhen } from "@/utils/validation";

const BADGES: Record<string, { label: string; className: string }> = {
  APPROVED_GARAGE: { label: "Verified Garage Record", className: "bg-emerald-100 text-emerald-800" },
  INSPECTION_GARAGE: { label: "Verified Garage Record", className: "bg-emerald-100 text-emerald-800" },
  GARAGE: { label: "Verified Garage Record", className: "bg-emerald-100 text-emerald-800" },
  VEHICLE_OWNER: { label: "Owner Submitted", className: "bg-blue-100 text-blue-800" },
  SYSTEM_ADMIN: { label: "Verified Admin Record", className: "bg-purple-100 text-purple-800" },
  SYSTEM: { label: "Verified Admin Record", className: "bg-purple-100 text-purple-800" },
  REGISTRY: { label: "Verified Admin Record", className: "bg-purple-100 text-purple-800" },
  AI_ANALYSIS: { label: "AI Visual Finding", className: "bg-orange-100 text-orange-800" },
};

export function ProvenanceBadge({ source }: { source: string }) {
  const key = (source || "SYSTEM_ADMIN").toUpperCase();
  const badge = BADGES[key] || { label: source.replaceAll("_", " "), className: "bg-gray-100 text-gray-700" };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${badge.className}`}>{badge.label}</span>;
}

export function HistoryTimeline({ items }: { items: TimelineItem[] }) {
  if (!items.length) {
    return <p className="text-[14px] text-[#666]">No history events are stored for this vehicle yet.</p>;
  }
  const ordered = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <ol className="m-0 list-none p-0">
      {ordered.map((item) => (
        <li key={item.id} className="relative border-l-2 border-solid border-[#d6e4f0] pb-5 pl-4">
          <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-ac-magenta" />
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 text-[15px] font-bold text-ac-ink">{item.title}</p>
            <ProvenanceBadge source={item.source_type} />
          </div>
          <p className="m-0 mt-1 text-[12px] text-[#777]">{formatWhen(item.date)}</p>
          <p className="m-0 mt-1 text-[14px] text-[#444]">{item.description}</p>
          {item.mileage != null ? <p className="m-0 mt-1 text-[12px] text-ac-blue">{item.mileage.toLocaleString()} km</p> : null}
        </li>
      ))}
    </ol>
  );
}
