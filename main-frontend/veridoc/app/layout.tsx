import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Verity AI — Evidence-Grounded Document QA & Hallucination Repair",
  description:
    "An Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair. Built for academic research, legal discovery, and factual audit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
