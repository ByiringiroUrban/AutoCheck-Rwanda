import type { ScoreBreakdown } from "@/types/api";
import { riskLevel } from "@/utils/validation";

export function AutoCheckScoreCard({ score, breakdown }: { score: number; breakdown?: ScoreBreakdown | null }) {
  const clamped = Math.max(0, Math.min(100, score));
  const risk = riskLevel(clamped);
  const riskColor = risk === "Low" ? "#198754" : risk === "Moderate" ? "#fd7e14" : "#dc3545";
  const radius = 46;
  const length = Math.PI * radius;
  const dash = (clamped / 100) * length;

  return (
    <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
      <h2 className="m-0 mb-3 text-[18px] font-bold text-ac-ink">AutoCheck Score</h2>
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative flex flex-col items-center">
          <svg width="120" height="70" viewBox="0 0 120 70" aria-hidden="true">
            <path d="M14 60 A46 46 0 0 1 106 60" fill="none" stroke="#e9ecef" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M14 60 A46 46 0 0 1 106 60"
              fill="none"
              stroke={riskColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${length}`}
            />
          </svg>
          <span className="absolute bottom-1 text-[28px] font-bold text-ac-ink">{clamped}</span>
        </div>
        <div>
          <p className="m-0 text-[13px] uppercase tracking-wide text-[#777]">Risk level</p>
          <p className="m-0 text-[22px] font-bold" style={{ color: riskColor }}>
            {risk}
          </p>
          <p className="m-0 mt-1 max-w-md text-[13px] text-[#555]">{breakdown?.summary}</p>
        </div>
      </div>
      {breakdown?.deductions?.length ? (
        <ul className="mt-4 mb-0 list-none space-y-2 p-0">
          {breakdown.deductions.map((item, index) => (
            <li key={`${item.category}-${index}`} className="rounded-[6px] bg-[#f8f9fa] px-3 py-2 text-[13px]">
              <span className="font-bold text-ac-danger">−{item.points_deducted}</span>{" "}
              <span className="font-semibold">{item.category.replaceAll("_", " ")}</span>
              <span className="text-[#555]"> — {item.reason}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 mb-0 text-[13px] text-[#555]">No point deductions were applied. The score starts at 100.</p>
      )}
    </section>
  );
}
