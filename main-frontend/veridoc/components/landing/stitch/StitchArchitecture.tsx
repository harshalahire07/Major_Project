"use client";

import React from "react";
import { Search, Split, Shield, CheckCircle2, ArrowRight, Hash, Layers } from "lucide-react";

export default function StitchArchitecture() {
  return (
    <section id="architecture" className="py-16 md:py-24 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
            FOUNDATIONAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Engineered for zero-tolerance analytical intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Generic RAG just concatenates text chunks together and hopes the model is truthful. Verity
            decomposes, checks, and proofs every syllable against primary source material.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Zero-Hallucination Retrieval */}
          <div className="p-8 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                HIGH-FIDELITY EXTRACTION
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Zero-Hallucination Retrieval
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Multi-vector hybrid FAISS + dense semantic embeddings with paragraph-level bounding
                boxes and exact page coordinates down to individual source lines.
              </p>
            </div>

            {/* Micro Visual Card */}
            <div className="mt-8 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-500 text-[11px]">Chunk #14 • Page 18</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700">
                  Cosine: 0.94
                </span>
              </div>
              <p className="text-xs text-neutral-700 truncate font-mono">
                &ldquo;Adverse events observed in 14.8% of cohorts...&rdquo;
              </p>
            </div>
          </div>

          {/* Card 2: Atomic Proposition Auditing */}
          <div className="p-8 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Split className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                ATOMIC PROPOSITION AUDITING
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Atomic Proposition Auditing
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Breaks complex compound answers into single, verifiable facts. Classifies every
                clause into Supported, Contradicted, or Unverifiable via cross-attention calibrated
                NLI models.
              </p>
            </div>

            {/* Micro Visual Card */}
            <div className="mt-8 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-600">Decomposed Claims (3)</span>
                <span className="text-blue-600 font-bold">Auto-Repaired</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  ✓ Claim 1
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold line-through">
                  ✗ Claim 2
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                  ✓ Repaired
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Cryptographic Audit Ledger */}
          <div className="p-8 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                REGULATORY & LEGAL AUDITABILITY
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Cryptographic Audit Ledger
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every parsed and rewritten assertion produces an immutable SHA-256 provenance hash
                linking synthetic model identity to evidentiary source chunks, ready for legal and
                clinical review.
              </p>
            </div>

            {/* Micro Visual Card */}
            <div className="mt-8 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-[11px]">
                <span className="text-neutral-500 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> SHA-256
                </span>
                <span className="text-purple-600 font-bold">Certified Defensible</span>
              </div>
              <p className="text-[11px] font-mono text-neutral-600 truncate bg-neutral-50 p-1 rounded">
                0x9f4a...8c2b (Signed Proof)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

