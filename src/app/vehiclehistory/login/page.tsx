import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AccountAuth } from "@/components/auth/AccountAuth";

export const metadata: Metadata = {
  title: "Sign In or Create an Account | AutoCheck Rwanda",
  description: "Sign in to your AutoCheck Rwanda account or create a new account to access vehicle history reports.",
};

export default function LoginPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <AccountAuth />
      <SiteFooter />
    </div>
  );
}
