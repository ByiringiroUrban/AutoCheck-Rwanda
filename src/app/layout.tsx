import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic&display=swap" rel="stylesheet" />
      </head>
      <body className="biz-udpgothic-regular">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
