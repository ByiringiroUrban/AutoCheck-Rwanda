import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCheck Rwanda | Vehicle History Reports",
  description:
    "AutoCheck Rwanda vehicle history reports unlock a vehicle's accident history, mileage, ownership info and more for smart car buying and selling in Rwanda.",
  keywords:
    "AutoCheck Rwanda, vehicle history report Rwanda, car history check Rwanda, VIN check Rwanda, used car Rwanda",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
