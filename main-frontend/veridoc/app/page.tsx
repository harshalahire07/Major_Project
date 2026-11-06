import React from "react";
import StitchLandingPage from "@/components/landing/stitch/StitchLandingPage";

export const metadata = {
  title: "VerityAI — Ask Documents. Verify Answers. Trust Evidence.",
  description:
    "An Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair. Decomposes answers into atomic claims, verifies against source documents via NLI, and automatically repairs contradicted assertions.",
};

export default function HomePage() {
  return <StitchLandingPage />;
}
