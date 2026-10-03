export function LogoLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-desktop.png" alt="" width={180} height={64} className="ac-logo-zoom h-16 w-auto" />
      <p className="m-0 text-[13px] text-[#667]">{label}</p>
    </div>
  );
}
