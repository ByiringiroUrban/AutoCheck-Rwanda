export function StatGrid({ items }: { items: { label: string; value: number | string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-solid border-[#e6eeee] bg-white p-4 shadow-sm">
          <p className="m-0 text-[12px] font-semibold uppercase tracking-wide text-[#7a8686]">{item.label}</p>
          <p className="m-0 mt-1 text-[30px] font-bold leading-none text-ac-navy">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function BarChart({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <section className="rounded-xl border border-solid border-[#e6eeee] bg-white p-4 shadow-sm">
      <h2 className="m-0 mb-4 text-[16px] font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="m-0 text-[14px] text-[#667]">Nothing to chart yet.</p>
      ) : (
        <div className="flex h-44 items-end gap-2">
          {items.map((item) => (
            <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <span className="mb-1 text-center text-[11px] font-semibold text-ac-navy">{item.value}</span>
              <div
                className="w-full rounded-t-md bg-ac-blue"
                style={{ height: `${Math.max(8, (item.value / max) * 100)}%` }}
                title={`${item.label}: ${item.value}`}
              />
              <span className="mt-2 truncate text-center text-[10px] text-[#667]">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function MixChart({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number; color: string }[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const stops =
    total === 0
      ? "#e6eeee 0% 100%"
      : items
          .map((item) => {
            const start = (cursor / total) * 100;
            cursor += item.value;
            return `${item.color} ${start}% ${(cursor / total) * 100}%`;
          })
          .join(", ");

  return (
    <section className="rounded-xl border border-solid border-[#e6eeee] bg-white p-4 shadow-sm">
      <h2 className="m-0 mb-4 text-[16px] font-bold">{title}</h2>
      <div className="flex flex-wrap items-center gap-5">
        <div className="h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }} />
        <ul className="m-0 list-none p-0 text-[13px]">
          {items.map((item) => (
            <li key={item.label} className="mb-2 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              <span>
                {item.label}: {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-24 animate-pulse rounded-xl bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl bg-white" />
        <div className="h-56 animate-pulse rounded-xl bg-white" />
      </div>
    </div>
  );
}
