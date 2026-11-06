"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  RefreshCw,
  Cpu,
  Layers,
  FileText,
} from "lucide-react";

export default function StitchCanvasShowcase() {
  const [activeTab, setActiveTab] = useState<"side-by-side" | "diff">("side-by-side");

  return (
    <section id="canvas" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Title and Telemetry Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Live Interactive Audit • Real-Time Claim Verification Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            The Verity Synthesis & Verification Canvas
          </h2>
        </div>

        {/* Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 font-medium text-neutral-700">
            Precision: <strong className="text-emerald-600 font-bold">99.4% Factual</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 font-medium text-neutral-700">
            NLI: <strong className="text-neutral-900 font-mono">DeBERTa-v3</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 font-medium text-neutral-700">
            LLM: <strong className="text-neutral-900 font-mono">Qwen 2.5 7B</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 font-medium text-neutral-700">
            Latency: <strong className="text-neutral-900 font-mono">180ms</strong>
          </div>
        </div>
      </div>

      {/* Main Verification Canvas Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
        {/* Top Query Ribbon */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
            <Search className="w-4 h-4 text-blue-600" />
            <span>Query: &ldquo;Evaluate Phase 3 safety and primary endpoints for VRT-804&rdquo;</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              97.2% Factual Confidence • 4 Claims
            </span>
          </div>
        </div>

        {/* Side-by-side Dual Column Showcase */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Raw Unverified LLM Output */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-rose-200 bg-rose-50/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  STANDARD RAW LLM GENERATION
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  <AlertTriangle className="w-3 h-3" />
                  2 HALLUCINATIONS DETECTED
                </span>
              </div>

              <div className="text-xs sm:text-[13px] leading-relaxed text-neutral-700 space-y-3 font-normal">
                <p>
                  In the Phase 3 trial (n=1,240), VRT-804 achieved complete remission in 74.2% of registered patients.
                </p>

                {/* Hallucinated Contradicted Claim */}
                <div className="p-3 rounded-lg bg-rose-100/70 border border-rose-300 text-rose-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                    CONTRADICTED ASSERTION (P.18)
                  </span>
                  <p className="line-through decoration-rose-500 font-medium">
                    Primary endpoint was achieved early: zero treatment-emergent adverse events were observed, and FDA accelerated review was requested.
                  </p>
                </div>

                <p>
                  FDA submissions filing deadline was scheduled for Q3 2023 across international regulatory bodies.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Author: generic-llm-v4</span>
              <span className="font-semibold text-rose-600">Status: Unverified / Contaminated</span>
            </div>
          </div>

          {/* Center Column: Pipeline Decomp & Repair Node */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-3 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>

            <div className="space-y-1.5 w-full">
              <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-900">
                1. Proposition Decomp
              </div>
              <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-900">
                2. DeBERTa NLI Audit
              </div>
              <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-900">
                3. Fact Contrast & Repair
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-900">
                4. Grounded Output
              </div>
            </div>

            <span className="text-[10px] font-mono text-neutral-400">180ms total</span>
          </div>

          {/* Right Column: Verity Verified & Repaired Output */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-emerald-300 bg-emerald-50/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  VERITY REPAIRED & GROUNDED ANSWER
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  100% FACTUAL GROUNDING
                </span>
              </div>

              <div className="text-xs sm:text-[13px] leading-relaxed text-neutral-800 space-y-3 font-normal">
                <p>
                  In the randomized clinical cohort, VRT-804 achieved complete remission in 74.2% of registered patients{" "}
                  <span className="inline-flex items-center font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    [Doc 2, p. 14, Chunk 02]
                  </span>
                  .
                </p>

                {/* Repaired Fact Claim */}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-300 text-blue-950 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    ✓ VERITY REPAIRED CLAIM:
                  </span>
                  <p className="font-medium text-neutral-900">
                    Primary endpoint effectiveness was documented at 74.2%, however 14.8% of cohorts experienced Grade 2/3 adverse events (transient hepatic enzyme elevation){" "}
                    <span className="inline-flex items-center font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      [Doc 2, p. 18]
                    </span>
                    .
                  </p>
                </div>

                <p>
                  FDA submission filing approvals were proposed for Q4 2025 across key international review panels{" "}
                  <span className="inline-flex items-center font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    [Doc 3, p. 9, Appendix C]
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-neutral-600">
              <span>Model: Qwen-2.5-7B • Engine: DeBERTa-v3-NLI</span>
              <span className="font-semibold text-emerald-700">4/4 Claims Grounded</span>
            </div>
          </div>
        </div>

        {/* Bottom Legend Bar */}
        <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-neutral-500 uppercase tracking-wider text-[11px]">
              Claim Classification Legend:
            </span>
            <span className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Supported
            </span>
            <span className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Contradicted
            </span>
            <span className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Unverifiable
            </span>
            <span className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Auto-Repaired
            </span>
          </div>

          <div className="text-[11px] text-neutral-500">
            Exact bounding box and page provenance on docs: <strong className="text-neutral-700">doc_002, doc_003</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
