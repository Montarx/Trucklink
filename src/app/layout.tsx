import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruckLink — Green logistics matching",
  description: "Match freight with spare capacity on truck routes already being driven.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
