"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ToastHost />
    </AuthProvider>
  );
}

function ToastHost() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setMessage(detail);
      window.setTimeout(() => setMessage(null), 4200);
    };
    window.addEventListener("ac-toast", onToast);
    return () => window.removeEventListener("ac-toast", onToast);
  }, []);

  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-[2000] max-w-sm rounded-[8px] bg-ac-navy px-4 py-3 text-[13px] text-white shadow-lg"
    >
      {message}
    </div>
  );
}
