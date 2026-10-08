"use client";

import { Fragment, isValidElement, useMemo, useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { ActionMenu, Panel, PreviewDialog, StatusBadge, type RowAction } from "@/components/dashboard/kit";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

function textOf(node: ReactNode): string | null {
  if (node == null || node === false || node === true) return null;
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(textOf).filter(Boolean);
    return parts.length ? parts.join(" ") : null;
  }
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return null;
}

function pageList(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function DataTable<T>({
  rows,
  columns,
  getSearchText,
  pageSize = 8,
  empty = "Nothing to show yet.",
  title,
  subtitle,
  rowActions,
}: {
  rows: T[];
  columns: Column<T>[];
  getSearchText: (row: T) => string;
  pageSize?: number;
  empty?: string;
  title?: string;
  subtitle?: string;
  rowActions?: (row: T) => RowAction[];
}) {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(pageSize);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [preview, setPreview] = useState<T | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let next = needle ? rows.filter((row) => getSearchText(row).toLowerCase().includes(needle)) : rows;
    if (sort) {
      const column = columns.find((item) => item.key === sort.key);
      next = [...next].sort((left, right) => {
        const a = column ? textOf(column.render(left)) || "" : "";
        const b = column ? textOf(column.render(right)) || "" : "";
        const result = a.localeCompare(b, undefined, { numeric: true });
        return sort.direction === "asc" ? result : -result;
      });
    }
    return next;
  }, [columns, getSearchText, query, rows, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * size;
  const slice = filtered.slice(start, start + size);
  const numbers = pageList(safePage, pages);

  const fieldsFor = (row: T) =>
    columns
      .map((column) => ({ label: column.header || column.key, value: textOf(column.render(row)) }))
      .filter((field): field is { label: string; value: string } => Boolean(field.label && field.value));

  const actionsFor = (row: T): RowAction[] => [
    { label: "Preview", onClick: () => setPreview(row) },
    ...(rowActions?.(row) || []),
  ];

  const exportCsv = () => {
    const headers = columns.map((column) => column.header || column.key);
    const lines = [
      headers.join(","),
      ...filtered.map((row) =>
        columns
          .map((column) => `"${(textOf(column.render(row)) || "").replaceAll('"', '""')}"`)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "autocheck-table").toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cell = (column: Column<T>, row: T) => {
    const value = column.render(row);
    const text = textOf(value);
    if (column.key === "status" && text) return <StatusBadge status={text} />;
    return value;
  };

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      action={
        <button type="button" onClick={exportCsv} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-solid border-[#d5e0e0] bg-white px-3 text-[12px] font-semibold text-ac-navy hover:bg-[#f4f8f8]">
          <Download size={14} />
          Export
        </button>
      }
    >
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <label className="flex items-center gap-2 text-[13px] text-[#555]">
          Show
          <select
            value={size}
            onChange={(event) => {
              setSize(Number(event.target.value));
              setPage(1);
            }}
            className="h-8 rounded-md border border-solid border-[#d5e0e0] bg-white px-2 text-[13px] text-ac-ink"
          >
            {[pageSize, 25, 50].filter((item, index, list) => list.indexOf(item) === index).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          entries
        </label>
        <label className="flex items-center gap-2 text-[13px] text-[#555]">
          <span className="hidden sm:inline">Search:</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="h-9 w-full rounded-lg border border-solid border-[#d5e0e0] px-3 text-[13px] outline-none focus:border-ac-navy sm:w-56"
          />
        </label>
      </div>

      <div className="space-y-2 px-3 pb-3 md:hidden">
        {slice.length === 0 ? <p className="px-1 py-8 text-center text-[13px] text-[#7a8686]">{empty}</p> : null}
        {slice.map((row, index) => (
          <article key={index} className="rounded-xl border border-solid border-[#eef3f3] bg-white p-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                {columns.slice(0, 5).map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-3 text-[13px]">
                    <span className="shrink-0 text-[11px] text-[#7a8686]">{column.header}</span>
                    <span className="min-w-0 text-right text-ac-ink">{cell(column, row)}</span>
                  </div>
                ))}
              </div>
              <ActionMenu items={actionsFor(row)} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-y border-solid border-[#eef3f3] bg-[#f7fafa]">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#7a8686]">Action</th>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#7a8686]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 bg-transparent p-0 font-semibold uppercase tracking-wide text-[#7a8686]"
                    onClick={() =>
                      setSort((current) =>
                        current?.key === column.key
                          ? { key: column.key, direction: current.direction === "asc" ? "desc" : "asc" }
                          : { key: column.key, direction: "asc" },
                      )
                    }
                  >
                    {column.header}
                    <span aria-hidden="true">{sort?.key === column.key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-[#7a8686]">
                  {empty}
                </td>
              </tr>
            ) : (
              slice.map((row, index) => (
                <tr key={index} className="border-b border-solid border-[#eef3f3] last:border-0 hover:bg-[#f7fafa]">
                  <td className="px-4 py-3 align-middle">
                    <ActionMenu items={actionsFor(row)} />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle text-ac-ink">
                      {cell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-solid border-[#eef3f3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="m-0 text-[13px] text-[#7a8686]">
          {filtered.length === 0
            ? "Showing 0 entries"
            : `Showing ${start + 1} to ${Math.min(start + size, filtered.length)} of ${filtered.length} entries`}
        </p>
        <div className="flex items-center gap-1">
          <Pager disabled={safePage === 1} label="Previous" onClick={() => setPage(safePage - 1)}>
            ‹
          </Pager>
          {numbers.map((item, index) => (
            <Fragment key={item}>
              {index > 0 && item - numbers[index - 1] > 1 ? <span className="px-1 text-[#7a8686]">…</span> : null}
              <Pager active={item === safePage} label={`Page ${item}`} onClick={() => setPage(item)}>
                {item}
              </Pager>
            </Fragment>
          ))}
          <Pager disabled={safePage === pages} label="Next" onClick={() => setPage(safePage + 1)}>
            ›
          </Pager>
        </div>
      </footer>
      {preview ? (
        <PreviewDialog title={title || "Record"} fields={fieldsFor(preview)} onClose={() => setPreview(null)} />
      ) : null}
    </Panel>
  );
}

function Pager({
  active,
  disabled,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md border border-solid px-2 text-[13px] disabled:opacity-40 ${
        active ? "border-ac-navy bg-ac-navy text-white" : "border-[#d5e0e0] bg-white text-ac-ink hover:bg-[#f4f8f8]"
      }`}
    >
      {children}
    </button>
  );
}
