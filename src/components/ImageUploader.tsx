"use client";

import { useState } from "react";

export interface UploadSlot {
  viewType: string;
  label: string;
  file: File | null;
  preview: string | null;
  error?: string;
}

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function emptySlots(defs: { viewType: string; label: string }[]): UploadSlot[] {
  return defs.map((item) => ({ ...item, file: null, preview: null }));
}

export function ImageUploader({
  slots,
  onChange,
}: {
  slots: UploadSlot[];
  onChange: (slots: UploadSlot[]) => void;
}) {
  const [progress, setProgress] = useState<Record<string, number>>({});

  const assign = (index: number, file: File | null) => {
    const next = slots.map((slot, slotIndex) => {
      if (slotIndex !== index) return slot;
      if (slot.preview) URL.revokeObjectURL(slot.preview);
      if (!file) return { ...slot, file: null, preview: null, error: undefined };
      if (!ALLOWED.includes(file.type)) {
        return { ...slot, file: null, preview: null, error: "Use a JPG, PNG, or WebP image." };
      }
      if (file.size > MAX_BYTES) {
        return { ...slot, file: null, preview: null, error: "Each image must be 10 MB or smaller." };
      }
      return { ...slot, file, preview: URL.createObjectURL(file), error: undefined };
    });
    onChange(next);
    if (file) {
      setProgress((current) => ({ ...current, [slots[index].viewType]: 100 }));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {slots.map((slot, index) => (
        <label
          key={slot.viewType}
          className="block cursor-pointer rounded-[8px] border border-dashed border-[#bbb] bg-[#fafafa] p-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files?.[0];
            if (file) assign(index, file);
          }}
        >
          <span className="mb-2 block text-[13px] font-bold text-ac-ink">{slot.label}</span>
          {slot.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.preview} alt="" className="mb-2 h-28 w-full rounded object-cover" />
          ) : (
            <span className="mb-2 block text-[12px] text-[#777]">Drop an image here, or choose a file.</span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-[12px]"
            onChange={(event) => assign(index, event.target.files?.[0] || null)}
          />
          {progress[slot.viewType] ? (
            <span className="mt-2 block h-1.5 overflow-hidden rounded bg-[#e5e7eb]">
              <span className="block h-full bg-ac-blue" style={{ width: `${progress[slot.viewType]}%` }} />
            </span>
          ) : null}
          {slot.error ? <span className="mt-1 block text-[12px] text-ac-danger">{slot.error}</span> : null}
        </label>
      ))}
    </div>
  );
}
