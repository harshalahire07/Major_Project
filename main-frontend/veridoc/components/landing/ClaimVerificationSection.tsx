"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  Search,
  Check,
  X,
  Minus,
  Sparkles,
  FileCheck,
} from "lucide-react";

export default function ClaimVerificationSection() {
  const [filter, setFilter] = useState<"ALL" | "SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE" | "REPAIRED">("ALL");

  const sampleClaims = [
    {
      id: "C-101",
      claim: "The Transformer utilizes stacked self-attention and point-wise, fully connected layers for both encoder and decoder.",
      status: "SUPPORTED",
      score: 0.98,
      doc: "vaswani2017_attention.pdf",
      page: 2,
      evidence: "The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.",
      repaired: null,
    },
    {
      id: "C-102",
      claim: "Positional encodings were learned using a 1024-dimensional continuous recurrent neural network.",
      status: "CONTRADICTED",
      score: 0.94,
      doc: "vaswani2017_attention.pdf",
      page: 6,
      evidence: "We use sine and cosine functions of different frequencies: PE(pos, 2i) = sin(pos/10000^(2i/d_model)). We also experimented with learned positional embeddings.",
      repaired: "Positional encodings use fixed sinusoidal functions of alternating sine and cosine frequencies rather than a recurrent neural network.",
    },
    {
      id: "C-103",
      claim: "The authors plan to introduce a hardware accelerator specifically optimized for Transformer attention kernels in 2028.",
      status: "UNVERIFIABLE",
      score: null,
      doc: "vaswani2017_attention.pdf",
      page: 10,
      evidence: "No direct or indirect textual evidence in the document discusses future 2028 hardware roadmap plans.",
      repaired: null,
    },
    {
      id: "C-104",
      claim: "For the WMT 2014 English-to-French translation task, the big model achieves a BLEU score of 51.2.",
      status: "CONTRADICTED",
      score: 0.92,
      doc: "vaswani2017_attention.pdf",
      page: 9,
      evidence: "On the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.8, outperforming all previously published single models.",
      repaired: "On the WMT 2014 English-to-French translation task, the big model achieves a BLEU score of 41.8.",
    },
  ];

  const filtered = sampleClaims.filter((c) => {
    if (filter === "ALL") return true;
    if (filter === "REPAIRED") return c.repaired !== null;
    return c.status === filter;
  });

  return (
    <section id="verification" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-3">
          Claim-Level Verification
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Factual Verification at Atomic Granularity
        </h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
          Paragraph-level verification fails because a single sentence can contain both true facts
          and fabricated numbers. Verity AI operates strictly on atomic claims.
        </p>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {(["ALL", "SUPPORTED", "CONTRADICTED", "UNVERIFIABLE", "REPAIRED"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === tab
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {tab === "ALL" && "All Claims"}
                {tab === "SUPPORTED" && "Supported (Green)"}
                {tab === "CONTRADICTED" && "Contradicted (Red)"}
                {tab === "UNVERIFIABLE" && "Unverifiable (Amber)"}
                {tab === "REPAIRED" && "Repaired (Blue)"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Claim Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-mono text-xs text-neutral-400">{item.id}</span>

                <div className="flex items-center gap-2">
                  {item.status === "SUPPORTED" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                      <Check className="w-3 h-3" />
                      SUPPORTED
                    </span>
                  )}
                  {item.status === "CONTRADICTED" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300/40">
                      <X className="w-3 h-3" />
                      CONTRADICTED
                    </span>
                  )}
                  {item.status === "UNVERIFIABLE" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/40">
                      <Minus className="w-3 h-3" />
                      UNVERIFIABLE
                    </span>
                  )}
                  {item.repaired && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300/40">
                      <RefreshCw className="w-3 h-3" />
                      REPAIRED
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                &ldquo;{item.claim}&rdquo;
              </p>

              {item.repaired && (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs">
                  <span className="font-semibold text-blue-700 dark:text-blue-300 block mb-0.5">
                    Verified Repair:
                  </span>
                  <p className="text-neutral-800 dark:text-neutral-200">{item.repaired}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
              <span className="truncate max-w-[200px]">
                {item.doc} • Page {item.page}
              </span>
              {item.score !== null && (
                <span className="font-mono">
                  Confidence: <strong>{(item.score * 100).toFixed(0)}%</strong>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
