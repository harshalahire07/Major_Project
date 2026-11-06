"use client";

import React from "react";
import { FileUp, GitBranch, ShieldCheck, Download, ArrowRight } from "lucide-react";

export default function StitchPipeline() {
  const steps = [
    {
      phase: "PHASE 01",
      title: "Ingest & Structure",
      desc: "Multi-modal OCR extracts layout, tabular spans, footnotes, and citation trees across 50MB+ PDFs.",
      badges: ["PDF", "DOCX", "EPUB", "XML"],
      icon: FileUp,
      highlight: false,
    },
    {
      phase: "PHASE 02",
      title: "Cross-Synthesis",
      desc: "Multi-document reasoning cross-indexes queries across thousands of pages to extract candidate assertions.",
      badges: ["FAISS Hybrid", "Vector Space"],
      icon: GitBranch,
      highlight: false,
    },
    {
      phase: "PHASE 03",
      title: "Atomic Verification",
      desc: "Every isolated statement is audited against primary evidence. Contradictions are detected; unverifiable assertions are flagged.",
      badges: ["DeBERTa-v3", "Cross-Encoder"],
      icon: ShieldCheck,
      highlight: true,
    },
    {
      phase: "PHASE 04",
      title: "Audit Export",
      desc: "Generates certified audit packages with highlighted source PDFs, confidence scores, and cryptographic hash metadata.",
      badges: ["Full Ledger", "SHA-256 Validated"],
      icon: Download,
      highlight: false,
    },
  ];

  return (
    <section id="pipeline" className="py-16 md:py-24 bg-neutral-50/50 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
            FOUR-STAGE VERIFICATION PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            From unstructured repository to legally defensible answers
          </h2>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                  step.highlight
                    ? "bg-white border-2 border-blue-600 shadow-lg ring-4 ring-blue-50"
                    : "bg-white border border-neutral-200 shadow-xs hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase font-mono">
                      {step.phase}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        step.highlight ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {step.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-100 text-neutral-600"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
