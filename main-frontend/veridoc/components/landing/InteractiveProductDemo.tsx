"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  FileText,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function InteractiveProductDemo() {
  const [activeTab, setActiveTab] = useState<"demo" | "pipeline" | "diff">("demo");
  const [mode, setMode] = useState<"baseline" | "verified">("verified");
  const [expandedClaimId, setExpandedClaimId] = useState<number | null>(2);

  const demoClaims = [
    {
      id: 1,
      order: 1,
      original: "Scaled dot-product attention computes softmax(QK^T / sqrt(d_k))V with dimension d_k.",
      status: "SUPPORTED",
      entailment: 0.97,
      contradiction: 0.01,
      page: 4,
      docName: "attention_mechanisms_2024.pdf",
      evidence: "We define Scaled Dot-Product Attention as softmax(QK^T / sqrt(d_k))V, scaling by 1/sqrt(d_k) to prevent small gradients in large dimensions.",
      repaired: null,
      repairStatus: "NOT_REQUIRED",
    },
    {
      id: 2,
      order: 2,
      original: "The authors trained the base model for 45 days across 128 Google TPU v4 chips.",
      status: "CONTRADICTED",
      entailment: 0.04,
      contradiction: 0.92,
      page: 12,
      docName: "attention_mechanisms_2024.pdf",
      evidence: "All primary ablation and base experiments were conducted on a single 8-GPU node with NVIDIA A100-80GB accelerators for a total duration of 3.5 days.",
      repaired: "The authors trained the base model for 3.5 days using 8 NVIDIA A100-80GB GPUs.",
      repairStatus: "REPAIRED",
    },
    {
      id: 3,
      order: 3,
      original: "Multi-head attention reduces the sequence length complexity from O(n^2) to O(n log n).",
      status: "CONTRADICTED",
      entailment: 0.06,
      contradiction: 0.89,
      page: 8,
      docName: "attention_mechanisms_2024.pdf",
      evidence: "Multi-head attention retains O(n^2 * d) total computational complexity per layer, where n is sequence length and d is the representation dimension.",
      repaired: "Multi-head attention retains O(n^2 * d) per-layer computational complexity with sequence length n.",
      repairStatus: "REPAIRED",
    },
    {
      id: 4,
      order: 4,
      original: "The researchers plan to open-source distilled checkpoint weights in December 2027.",
      status: "UNVERIFIABLE",
      entailment: 0.12,
      contradiction: 0.15,
      page: 18,
      docName: "attention_mechanisms_2024.pdf",
      evidence: "No direct evidence found in uploaded document text to corroborate checkpoint release schedules.",
      repaired: "[Claim omitted from verified answer due to lack of ground truth evidence]",
      repairStatus: "FLAGGED",
    },
  ];

  return (
    <section id="demo" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-3">
          Interactive Live Simulation
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          See Hallucination Repair in Real Time
        </h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-base">
          Toggle between the unverified LLM draft answer and the Verity AI verified output to see how
          claim-level NLI catches and rewrites factual errors.
        </p>
      </div>

      {/* Main Interactive Container Card */}
      <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl overflow-hidden transition-all">
        {/* Window Chrome Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>attention_mechanisms_2024.pdf</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                18 pages • 42 chunks
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/80 text-xs font-medium">
            <button
              onClick={() => setActiveTab("demo")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "demo"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Interactive Q&A
            </button>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "pipeline"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              M8 Pipeline Flow
            </button>
            <button
              onClick={() => setActiveTab("diff")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "diff"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Claim Diff Inspector
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Q&A & Verification */}
        {activeTab === "demo" && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Question Bar */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/70 dark:border-neutral-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                User Question
              </span>
              <p className="mt-1 text-base font-medium text-neutral-900 dark:text-neutral-100">
                &ldquo;What are the computational complexity characteristics and training hardware
                specifications described in the paper?&rdquo;
              </p>
            </div>

            {/* Answer Display with Baseline vs Verified Toggle */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Model Output Comparison
                </span>

                {/* Switcher Toggle */}
                <div className="inline-flex items-center p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
                  <button
                    onClick={() => setMode("baseline")}
                    className={`px-3.5 py-1 rounded-full font-medium transition-all ${
                      mode === "baseline"
                        ? "bg-rose-500 text-white shadow-xs font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    🔴 Baseline Draft (Unverified)
                  </button>
                  <button
                    onClick={() => setMode("verified")}
                    className={`px-3.5 py-1 rounded-full font-medium transition-all ${
                      mode === "verified"
                        ? "bg-emerald-600 text-white shadow-xs font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    🟢 Verity AI (Verified & Repaired)
                  </button>
                </div>
              </div>

              {/* Answer Content Card */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  mode === "baseline"
                    ? "bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/60"
                    : "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/60"
                }`}
              >
                {mode === "baseline" ? (
                  <div className="space-y-3 text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Baseline Output — 2 Contradictions, 1 Unverifiable Claim</span>
                    </div>
                    <p>
                      Scaled dot-product attention computes softmax(QK^T / sqrt(d_k))V with
                      dimension d_k.{" "}
                      <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 underline decoration-rose-500 decoration-wavy px-1 rounded">
                        The authors trained the base model for 45 days across 128 Google TPU v4 chips.
                      </span>{" "}
                      Furthermore,{" "}
                      <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 underline decoration-rose-500 decoration-wavy px-1 rounded">
                        multi-head attention reduces sequence length complexity from O(n^2) to O(n log n).
                      </span>{" "}
                      <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 px-1 rounded">
                        The researchers plan to open-source distilled checkpoint weights in December 2027.
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verity AI Pipeline — 100% Grounded, Contradictions Repaired</span>
                    </div>
                    <p>
                      Scaled dot-product attention computes softmax(QK^T / sqrt(d_k))V with
                      dimension d_k{" "}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        [p.4]
                      </span>
                      . In contrast to initial drafts, the empirical training completed in{" "}
                      <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 px-1 rounded font-medium">
                        3.5 days using 8 NVIDIA A100-80GB GPUs
                      </span>{" "}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        [p.12]
                      </span>
                      . Multi-head attention retains{" "}
                      <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 px-1 rounded font-medium">
                        O(n^2 * d) per-layer computational complexity
                      </span>{" "}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        [p.8]
                      </span>
                      . Unverifiable forward-looking claims were pruned to maintain strict factual integrity.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Atomic Claims Inspector List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Atomic Claims & Verification Evidence
                </span>
                <span className="text-xs text-neutral-500">
                  Click any card to inspect NLI scores & source passages
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {demoClaims.map((claim) => {
                  const isExpanded = expandedClaimId === claim.id;

                  return (
                    <div
                      key={claim.id}
                      onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isExpanded
                          ? "bg-neutral-50 dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-700 shadow-sm"
                          : "bg-white dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-neutral-400">
                              Claim #{claim.order}
                            </span>

                            {claim.status === "SUPPORTED" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                                <CheckCircle2 className="w-3 h-3" />
                                SUPPORTED
                              </span>
                            )}

                            {claim.status === "CONTRADICTED" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300/40">
                                <AlertTriangle className="w-3 h-3" />
                                CONTRADICTED
                              </span>
                            )}

                            {claim.status === "UNVERIFIABLE" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/40">
                                <HelpCircle className="w-3 h-3" />
                                UNVERIFIABLE
                              </span>
                            )}

                            {claim.repairStatus === "REPAIRED" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300/40">
                                <RefreshCw className="w-3 h-3" />
                                REPAIRED
                              </span>
                            )}

                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              Page {claim.page}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            &ldquo;{claim.original}&rdquo;
                          </p>

                          {claim.repaired && claim.repairStatus === "REPAIRED" && (
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mt-1">
                              <span>↳ Repaired to:</span>
                              <span className="italic text-neutral-700 dark:text-neutral-300">
                                &ldquo;{claim.repaired}&rdquo;
                              </span>
                            </p>
                          )}
                        </div>

                        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Evidence & NLI Probability Drawer */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700/80 space-y-3">
                          <div className="p-3 rounded-lg bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800 text-xs">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                              Supporting Source Text (Page {claim.page})
                            </span>
                            <p className="italic text-neutral-600 dark:text-neutral-400">
                              &ldquo;{claim.evidence}&rdquo;
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/60">
                              <span className="text-neutral-500 block">NLI Model</span>
                              <span className="font-mono font-medium text-neutral-900 dark:text-white">
                                DeBERTa-v3-base
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/60">
                              <span className="text-neutral-500 block">Entailment Probability</span>
                              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                {(claim.entailment * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/60 col-span-2 sm:col-span-1">
                              <span className="text-neutral-500 block">Contradiction Score</span>
                              <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
                                {(claim.contradiction * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 4-Stage Pipeline Architecture */}
        {activeTab === "pipeline" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="max-w-2xl">
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                The M8 Verification & Repair Pipeline
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                How document knowledge is ingested, queried, decomposed, cross-referenced, and repaired
                without fabrication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h5 className="font-semibold text-neutral-900 dark:text-white text-sm">
                  Ingestion & FAISS
                </h5>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  PyMuPDF extracts raw text with exact page numbers. Chunks are embedded with
                  BAAI/bge-small-en-v1.5 and indexed in FAISS.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h5 className="font-semibold text-neutral-900 dark:text-white text-sm">
                  Local Generation
                </h5>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Fast semantic retrieval fetches top-k chunks. Ollama executes Qwen 2.5 7B to
                  synthesize an initial natural language draft answer.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h5 className="font-semibold text-neutral-900 dark:text-white text-sm">
                  NLI Claim Verification
                </h5>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Decomposes the draft into single assertions. Cross-Encoder NLI classifies each:
                  SUPPORTED, CONTRADICTED, or UNVERIFIABLE.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h5 className="font-semibold text-neutral-900 dark:text-white text-sm">
                  Iterative Repair
                </h5>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Contradicted claims are passed to the claim repair module. Re-verified until
                  supported; ungrounded assertions are stripped.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Claim Diff Inspector */}
        {activeTab === "diff" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="max-w-2xl">
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                Claim-Level Diff Analysis
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Visualizing the precise factual corrections applied to hallucinated statements.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Before (Draft Assertion)
                  </span>
                  <span className="text-neutral-400">Contradiction: 0.92</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-mono bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded border border-rose-200 dark:border-rose-900/40 line-through">
                  The authors trained the base model for 45 days across 128 Google TPU v4 chips.
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> After (Repaired Ground Truth)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Entailment: 0.97
                  </span>
                </div>
                <p className="text-sm text-neutral-900 dark:text-white font-mono bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded border border-emerald-200 dark:border-emerald-900/40">
                  The authors trained the base model for 3.5 days using 8 NVIDIA A100-80GB GPUs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Card Footer Bar */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Local Model: Qwen 2.5 (7B)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              NLI: DeBERTa-v3
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Index: FAISS L2/Cosine
            </span>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 text-neutral-900 dark:text-white font-semibold hover:underline"
          >
            <span>Open in Interactive Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
