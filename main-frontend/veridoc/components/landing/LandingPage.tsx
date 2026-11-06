"use client";

import React from "react";
import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import Notebook3DDesk from "./Notebook3DDesk";
import NotebookLMTriPanel3D from "./NotebookLMTriPanel3D";
import InteractiveProductDemo from "./InteractiveProductDemo";
import ThreeDPipelineStack from "./ThreeDPipelineStack";
import FeaturesSection from "./FeaturesSection";
import ClaimVerificationSection from "./ClaimVerificationSection";
import BenchmarksSection from "./BenchmarksSection";
import ArchitectureSection from "./ArchitectureSection";
import CallToAction from "./CallToAction";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300">
      <LandingNavbar />
      <main>
        <LandingHero />
        <Notebook3DDesk />
        <NotebookLMTriPanel3D />
        <InteractiveProductDemo />
        <ThreeDPipelineStack />
        <FeaturesSection />
        <ClaimVerificationSection />
        <BenchmarksSection />
        <ArchitectureSection />
        <CallToAction />
      </main>
      <LandingFooter />
    </div>
  );
}
