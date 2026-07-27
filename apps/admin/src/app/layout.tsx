import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminSidebar } from "@/components/AdminSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BITBIT Admin Panel",
  description: "BITBIT administration dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
