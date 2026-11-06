"use client";

import React from "react";
import {
  FileText,
  ShieldCheck,
  RefreshCw,
  Search,
  Lock,
  BarChart3,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Layers,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/50",
      title: "Atomic Claim Decomposition",
      description:
        "Isolates compound sentences into discrete, independent factual propositions. Prevents subtle hallucinations buried within otherwise factual paragraphs from slipping through.",
    },
    {
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/50",
      title: "Cross-Encoder NLI Verification",
      description:
        "Leverages Natural Language Inference (DeBERTa-v3) to measure direct entailment vs contradiction against retrieved passages with calibrated confidence scores.",
    },
    {
      icon: RefreshCw,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900/50",
      title: "Iterative Claim Repair",
      description:
        "When an assertion contradicts source evidence, context-conditioned rewriting fixes the error. If evidence cannot be found, the claim is removed from the answer.",
    },
    {
      icon: Search,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50",
      title: "Granular Source Attribution",
      description:
        "Every accepted claim is linked to an exact PDF document name, page number, and chunk index. Citations are verifiable in one click.",
    },
    {
      icon: Lock,
      color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900/50",
      title: "100% Local Model Execution",
      description:
        "Sensitive documents and confidential research stay entirely on your machine. Powered by local Ollama (Qwen 2.5) and local FAISS vector indices.",
    },
    {
      icon: BarChart3,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/50",
      title: "Empirically Evaluated Rigor",
      description:
        "Validated across benchmark document suites with a measured 26.7% reduction in contradictory claims and 117 automated unit and integration tests.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-neutral-50/50 dark:bg-neutral-950/50 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-3">
            Core Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Engineered to Solve the Core Flaw of RAG
          </h3>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
            Traditional Retrieval-Augmented Generation treats the LLM as an oracle. Verity AI treats
            every generated token as an unverified hypothesis until proven by document evidence.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${feat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-2 flex items-center justify-between">
                  <span>{feat.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
