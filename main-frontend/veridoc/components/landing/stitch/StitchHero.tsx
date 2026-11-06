"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Lock, Dna, Scale, Building2, Stethoscope } from "lucide-react";

export default function StitchHero() {
  return (
    <section className="pt-12 pb-16 md:pt-16 md:pb-20 text-center bg-gradient-to-b from-white via-neutral-50/40 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pill Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-medium mb-8 hover:bg-blue-100/60 transition-colors">
          <span className="text-blue-600 font-bold">◆ INTRODUCING:</span>
          <span>DeBERTa-v3 & Qwen 2.5 Claim-Level Verification & Auto-Repair Architecture</span>
          <ArrowRight className="w-3 h-3 text-blue-600" />
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
          Ask Documents. Verify Answers. <br />
          <span className="text-blue-600">Trust Evidence.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed font-normal">
          The enterprise intelligence platform that decomposes generated answers into atomic
          propositions, cross-evaluates each claim against source PDFs in real-time, and auto-repairs
          hallucinations before they reach critical workflows.
        </p>

        {/* Dual Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <span>Try Interactive Inspector</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#canvas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-sm font-medium shadow-2xs hover:bg-neutral-50 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-neutral-500" />
            <span>Watch 2-Min Product Tour</span>
          </a>
        </div>

        {/* Social Proof & Trust Badges */}
        <div className="mt-14 pt-8 border-t border-neutral-100">
          <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 mb-6">
            Trusted by Research, Enterprise Intelligence & High-Stakes Teams across 1,000+ Workspaces
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-neutral-600 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-400" />
              <span>Stanford BioNLP</span>
            </div>
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-neutral-400" />
              <span>GenomicsPharma</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-neutral-400" />
              <span>Veritas LegalDiscovery</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-neutral-400" />
              <span>FerroHealth Advisory</span>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>ISO-27001 & HIPAA Risk Compliant Architecture</span>
          </div>
        </div>
      </div>
    </section>
  );
}
