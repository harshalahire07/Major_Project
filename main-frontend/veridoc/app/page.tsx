import React from "react";
import LandingPage from "@/components/landing/LandingPage";

export const metadata = {
  title: "Verity AI — Evidence-Grounded AI Document Workspace & Hallucination Repair",
  description:
    "An Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair. Decomposes answers into atomic claims, verifies against source documents via NLI, and automatically repairs contradicted assertions.",
};

export default function HomePage() {
  return <LandingPage />;
}
