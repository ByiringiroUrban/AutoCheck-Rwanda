"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogoLoader } from "@/components/LogoLoader";
import { homeForRole, roleAllowed } from "@/utils/roles";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: readonly string[];
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/vehiclehistory/login");
      return;
    }
    if (allow && !roleAllowed(user.role, allow)) {
      router.replace(homeForRole(user.role));
      return;
    }
    setReady(true);
  }, [allow, isAuthenticated, isLoading, router, user]);

  if (isLoading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef3f3]">
        <LogoLoader label="Checking your session" />
      </div>
    );
  }

  return <>{children}</>;
}

export function RoleGuard({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: readonly string[];
}) {
  return <ProtectedRoute allow={allow}>{children}</ProtectedRoute>;
}
