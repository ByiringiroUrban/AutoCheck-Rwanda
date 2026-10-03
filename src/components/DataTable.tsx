"use client";

import { useMemo, useState } from "react";
import { fieldClass } from "@/components/ui";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  getSearchText,
  pageSize = 8,
  empty = "Nothing to show yet.",
}: {
  rows: T[];
  columns: Column<T>[];
  getSearchText: (row: T) => string;
  pageSize?: number;
  empty?: string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => getSearchText(row).toLowerCase().includes(needle));
  }, [getSearchText, query, rows]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
        placeholder="Search this table"
        className={`${fieldClass} mb-3 max-w-sm`}
      />
      <div className="overflow-x-auto rounded-[8px] border border-solid border-[#e5e7eb]">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-[#f8f9fa]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 font-bold text-ac-ink">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-[#666]">
                  {empty}
                </td>
              </tr>
            ) : (
              slice.map((row, index) => (
                <tr key={index} className="border-t border-solid border-[#f1f5f9]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2 align-top text-ac-ink">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-[13px] text-[#555]">
        <span>
          {filtered.length} row{filtered.length === 1 ? "" : "s"}
        </span>
        <div className="flex gap-2">
          <button type="button" className="ac-btn px-3" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            Previous
          </button>
          <span className="self-center">
            {safePage} / {pages}
          </span>
          <button type="button" className="ac-btn px-3" disabled={safePage >= pages} onClick={() => setPage(safePage + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
