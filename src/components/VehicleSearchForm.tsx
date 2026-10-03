"use client";

import { useState, type FormEvent } from "react";
import { fieldClass, Spinner } from "@/components/ui";
import { useVehicleSearch } from "@/hooks/useVehicleSearch";
import { validatePlate, validateVin } from "@/utils/validation";

export function VehicleSearchForm({ compact = false }: { compact?: boolean }) {
  const { search, loading, error } = useVehicleSearch();
  const [mode, setMode] = useState<"vin" | "plate">("vin");
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const check = mode === "vin" ? validateVin(value) : validatePlate(value);
    if (!check.ok) {
      setLocalError(check.message || "Check the number and try again.");
      return;
    }
    setLocalError(null);
    if (check.value) setValue(check.value);
    await search(mode, check.value || value);
  };

  return (
    <form method="post" onSubmit={onSubmit} className={compact ? "" : "rounded-[8px] border border-solid border-[#ddd] bg-white p-4 shadow-sm"}>
      <div className="mb-3 flex gap-4 text-[14px]">
        <label className="flex items-center gap-2">
          <input type="radio" name="search-mode" checked={mode === "vin"} onChange={() => setMode("vin")} />
          VIN
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="search-mode" checked={mode === "plate"} onChange={() => setMode("plate")} />
          Rwanda plate
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setLocalError(null);
          }}
          maxLength={mode === "vin" ? 17 : 16}
          placeholder={mode === "vin" ? "17-character VIN" : "RAC 123 A"}
          aria-label={mode === "vin" ? "Vehicle identification number" : "Rwanda plate number"}
          className={`${fieldClass} sm:flex-1`}
        />
        <button type="submit" className="ac-btn px-5" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
      {loading ? (
        <div className="mt-3">
          <Spinner label="Looking up the registry…" />
        </div>
      ) : null}
      {localError || error ? <p className="mt-2 mb-0 text-[12px] text-ac-danger">{localError || error}</p> : null}
    </form>
  );
}
