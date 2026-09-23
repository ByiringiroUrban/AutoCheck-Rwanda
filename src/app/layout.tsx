import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCheck.com | Homepage | AutoCheck.com",
  description:
    "Experian AutoCheck vehicle history reports unlock a vehicle's accident history, mileage, ownership info and more for smart car buying and selling.",
  keywords:
    "Experian AutoCheck vehicle history reports unlock a vehicle's accident history, mileage, ownership info and more for smart car buying and selling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
