import type { MileageHistory, Report } from "@/types/api";
import { formatWhen, riskLevel } from "@/utils/validation";
import { reportView } from "@/components/report/reportModel";

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

function ascii(value: string) {
  return value
    .replace(/[—–−]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function esc(value: string) {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(value: string, size: number) {
  const max = Math.max(24, Math.floor(CONTENT_W / (size * 0.5)));
  const words = ascii(value).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

class PdfDoc {
  private pages: string[][] = [];
  private y = 0;

  constructor() {
    this.newPage();
  }

  private ops() {
    return this.pages[this.pages.length - 1];
  }

  private newPage() {
    this.pages.push([]);
    this.ops().push("0.024 0.220 0.220 rg");
    this.ops().push(`0 ${PAGE_H - 40} ${PAGE_W} 40 re f`);
    this.ops().push("1 1 1 rg");
    this.ops().push(`BT /F2 13 Tf ${MARGIN} ${PAGE_H - 25} Td (AutoCheck Rwanda) Tj ET`);
    this.ops().push(`BT /F1 9 Tf 390 ${PAGE_H - 25} Td (Vehicle history report) Tj ET`);
    this.y = PAGE_H - 64;
  }

  private ensure(height: number) {
    if (this.y - height < 52) this.newPage();
  }

  gap(amount = 10) {
    this.y -= amount;
  }

  heading(text: string) {
    this.ensure(26);
    this.ops().push("0.024 0.220 0.220 rg");
    this.ops().push(`${MARGIN} ${this.y - 16} ${CONTENT_W} 20 re f`);
    this.ops().push("1 1 1 rg");
    this.ops().push(`BT /F2 11 Tf ${MARGIN + 8} ${this.y - 11} Td (${esc(text)}) Tj ET`);
    this.y -= 28;
  }

  line(text: string, size = 11, bold = false) {
    const font = bold ? "/F2" : "/F1";
    const leading = size + 4;
    const lines = wrap(text, size);
    this.ensure(lines.length * leading + 2);
    this.ops().push("0.13 0.15 0.16 rg");
    for (const row of lines) {
      this.ops().push(`BT ${font} ${size} Tf ${MARGIN} ${this.y - size} Td (${esc(row)}) Tj ET`);
      this.y -= leading;
    }
  }

  pair(label: string, value: string) {
    this.line(`${label}: ${value}`, 11, false);
  }

  finish() {
    return this.pages.map((ops, index) => {
      const footer = `0.4 0.4 0.4 rg BT /F1 8 Tf ${MARGIN} 28 Td (AutoCheck Rwanda  |  Page ${index + 1} of ${this.pages.length}) Tj ET`;
      return [...ops, footer].join("\n");
    });
  }
}

export function buildReportPdfBytes(report: Report, mileage: MileageHistory | null) {
  const view = reportView(report, mileage);
  const { snapshot, vehicle } = view;
  if (!snapshot || !vehicle) throw new Error("This report has no vehicle snapshot.");

  const doc = new PdfDoc();
  doc.line(`${vehicle.year} ${vehicle.make} ${vehicle.model}`, 16, true);
  doc.line(`${vehicle.body_type}  |  ${vehicle.fuel_type}`, 10);
  doc.gap(6);
  doc.pair("Generated", formatWhen(report.generated_at));
  doc.pair("VIN", vehicle.vin);
  doc.pair("Class", vehicle.body_type);
  doc.pair("Vehicle age", `${view.age} year(s)`);
  doc.pair("Rwanda plate", snapshot.current_plate || "Not recorded");
  doc.pair("Colour", vehicle.color || "Not recorded");
  doc.pair("Owners", String(snapshot.ownership_count));
  doc.pair("Ownership", snapshot.verified_ownership ? "Verified" : "Not verified");
  doc.pair("AutoCheck Score", `${report.score} (${riskLevel(report.score)} risk)`);
  doc.gap(8);

  doc.heading("Score effect");
  if (view.damageRows.length === 0) {
    doc.line("No score deductions.");
  } else {
    for (const item of view.damageRows) {
      doc.line(`${item.category}: -${item.points_deducted}. ${item.reason}`);
    }
  }
  doc.gap(8);

  doc.heading("Vehicle history at a glance");
  doc.pair(
    "Odometer",
    view.rollback
      ? "Rollback reported"
      : view.latestMileage == null
        ? "No reading"
        : `No issue. Last recorded ${view.latestMileage.toLocaleString()} km`,
  );
  doc.pair("Service / repair", view.services.length ? `${view.services.length} record(s)` : "None recorded");
  doc.pair("Inspection", view.inspections.length ? `${view.inspections.length} recorded` : "None recorded");
  doc.pair("Accident / damage", view.incidents.length ? `${view.incidents.length} reported` : "No issue");
  doc.gap(8);

  doc.heading("Vehicle history details");
  if (view.events.length === 0) {
    doc.line("No history events are stored for this vehicle.");
  }
  for (const item of view.events) {
    doc.gap(4);
    doc.line(item.title, 12, true);
    doc.pair("Date", formatWhen(item.date));
    doc.pair("Source", item.source_name || item.source_type);
    if (item.mileage != null) doc.pair("Mileage", `${item.mileage.toLocaleString()} km`);
    if (item.description) doc.line(item.description, 10);
  }
  doc.gap(8);
  doc.heading("Odometer calculation check");
  doc.line(
    view.rollback
      ? mileage?.anomaly_details || "A later reading is lower than an earlier one."
      : view.latestMileage != null
        ? `No odometer rollback detected. Last recorded ${view.latestMileage.toLocaleString()} km.`
        : "No odometer readings have been recorded.",
  );

  return encodePdf(doc.finish());
}

function encodePdf(streams: string[]) {
  const objects: string[] = [];
  const pageNumbers: number[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  streams.forEach((stream) => {
    const pageNumber = objects.length + 1;
    const contentNumber = pageNumber + 1;
    pageNumbers.push(pageNumber);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1] = `<< /Type /Pages /Kids [${pageNumbers.map((number) => `${number} 0 R`).join(" ")}] /Count ${pageNumbers.length} >>`;

  let file = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    const number = index + 1;
    offsets[number] = file.length;
    file += `${number} 0 obj\n${body}\nendobj\n`;
  });
  const xref = file.length;
  file += `xref\n0 ${objects.length + 1}\n`;
  file += "0000000000 65535 f \n";
  for (let number = 1; number <= objects.length; number += 1) {
    file += `${String(offsets[number]).padStart(10, "0")} 00000 n \n`;
  }
  file += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(file);
}

export function downloadReportPdf(report: Report, mileage: MileageHistory | null) {
  const bytes = buildReportPdfBytes(report, mileage);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const vin = (report.snapshot?.vehicle?.vin || report.id).replace(/[^\w.-]+/g, "");
  link.href = url;
  link.download = `AutoCheck-${vin}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
