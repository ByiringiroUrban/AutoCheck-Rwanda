import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AccountAuth } from "@/components/auth/AccountAuth";

export const metadata: Metadata = {
  title: "Create an Account | AutoCheck Rwanda",
  description: "Create an AutoCheck Rwanda owner account.",
};

export default function RegisterPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <AccountAuth />
      <SiteFooter />
    </div>
  );
}
