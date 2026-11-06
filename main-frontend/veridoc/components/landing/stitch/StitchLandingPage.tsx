"use client";

import React from "react";
import StitchNavbar from "./StitchNavbar";
import StitchHero from "./StitchHero";
import StitchCanvasShowcase from "./StitchCanvasShowcase";
import StitchArchitecture from "./StitchArchitecture";
import StitchComparisonTable from "./StitchComparisonTable";
import StitchPipeline from "./StitchPipeline";
import StitchUseCases from "./StitchUseCases";
import StitchMetrics from "./StitchMetrics";
import StitchCTA from "./StitchCTA";
import StitchFooter from "./StitchFooter";

export default function StitchLandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-blue-600/10 selection:text-blue-700">
      <StitchNavbar />
      <main>
        <StitchHero />
        <StitchCanvasShowcase />
        <StitchArchitecture />
        <StitchComparisonTable />
        <StitchPipeline />
        <StitchUseCases />
        <StitchMetrics />
        <StitchCTA />
      </main>
      <StitchFooter />
    </div>
  );
}
