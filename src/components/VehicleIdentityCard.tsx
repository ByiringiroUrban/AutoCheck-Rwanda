import type { Vehicle } from "@/types/api";
import { maskVin } from "@/utils/validation";

export function VehicleIdentityCard({
  vehicle,
  plate,
  mask = true,
}: {
  vehicle: Pick<Vehicle, "make" | "model" | "year" | "vin" | "body_type" | "fuel_type" | "color" | "status" | "current_plate">;
  plate?: string | null;
  mask?: boolean;
}) {
  const shownPlate = plate || vehicle.current_plate || "No current plate";
  const rows = [
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Year", String(vehicle.year)],
    ["Plate", shownPlate],
    ["VIN", mask ? maskVin(vehicle.vin) : vehicle.vin],
    ["Body", vehicle.body_type],
    ["Fuel", vehicle.fuel_type],
    ["Colour", vehicle.color],
  ];

  return (
    <section className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 text-[20px] font-bold text-ac-ink">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>
        <span className="rounded-full bg-[#e8f5f5] px-3 py-1 text-[12px] font-bold text-ac-navy">{vehicle.status}</span>
      </div>
      <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-solid border-[#f1f1f1] py-1 text-[14px]">
            <dt className="text-[#666]">{label}</dt>
            <dd className="m-0 font-semibold text-ac-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
