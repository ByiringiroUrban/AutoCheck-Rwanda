import type { MileageRecord } from "@/types/api";
import { formatWhen } from "@/utils/validation";

export function MileageHistoryChart({
  records,
  anomaly,
  anomalyDetails,
}: {
  records: MileageRecord[];
  anomaly?: boolean;
  anomalyDetails?: string | null;
}) {
  const max = Math.max(1, ...records.map((record) => record.mileage));
  return (
    <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
      <h2 className="m-0 mb-3 text-[18px] font-bold text-ac-ink">Odometer history</h2>
      {anomaly ? (
        <div className="mb-4 rounded-[6px] border border-solid border-[#f5c2c7] bg-[#f8d7da] px-3 py-2 text-[13px] text-[#842029]" role="alert">
          Mileage rollback detected. {anomalyDetails}
        </div>
      ) : null}
      {!records.length ? <p className="m-0 text-[14px] text-[#666]">No odometer readings have been recorded.</p> : null}
      <div className="space-y-3">
        {records.map((record) => (
          <div key={record.id}>
            <div className="mb-1 flex justify-between text-[12px] text-[#555]">
              <span>{formatWhen(record.recorded_at)}</span>
              <span className={record.has_rollback_warning ? "font-bold text-ac-danger" : "font-semibold text-ac-ink"}>
                {record.mileage.toLocaleString()} km
                {record.has_rollback_warning ? " · rollback" : ""}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#eee]">
              <div
                className={`h-2 rounded-full ${record.has_rollback_warning ? "bg-ac-danger" : "bg-ac-blue"}`}
                style={{ width: `${Math.max(4, (record.mileage / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
