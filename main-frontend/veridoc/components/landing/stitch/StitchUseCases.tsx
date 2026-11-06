"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function StitchUseCases() {
  return (
    <section id="use-cases" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Title and Link */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
            ENTERPRISE PRODUCTION USE CASES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight max-w-2xl">
            Built for environments where truth is legally or clinically non-negotiable
          </h2>
        </div>

        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>Read our Whitepaper & Nature Medicine validation</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 2 Big Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Clinical Research */}
        <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-100">
            {/* Real Unsplash Biomedical Photo */}
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
              alt="Clinical Trials & Oncology Meta-Analyses"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-neutral-800 shadow-xs">
                CLINICAL RESEARCH & ONCOLOGY
              </span>
            </div>
          </div>

          <div className="p-7 space-y-3">
            <h3 className="text-xl font-bold text-neutral-900">
              Clinical Trials & Meta-Analyses
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Verity QA extracts and cross-validates adverse events, dosages, and patient demographics
              across hundreds of PDF trial submissions without missing subtle contradictions buried in
              complex multi-page tables.
            </p>
          </div>
        </div>

        {/* Card 2: Legal Discovery */}
        <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-100">
            {/* Real Unsplash Law Library Photo */}
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80"
              alt="High-Stakes Legal Discovery & SEC 10-K Audits"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-neutral-800 shadow-xs">
                SECURITIES LAW & ENTERPRISE AUDIT
              </span>
            </div>
          </div>

          <div className="p-7 space-y-3">
            <h3 className="text-xl font-bold text-neutral-900">
              High-Stakes Legal Discovery & 10-K Audits
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Scan millions of deposition pages and SEC disclosures. Find poisonous contracts,
              identify non-disclosures, and eliminate hallucinations that cause legal malpractice in
              critical court proceedings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

