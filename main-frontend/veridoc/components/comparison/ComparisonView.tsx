"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { EvaluationSummaryItem } from "@/types";

export default function ComparisonView() {
  const [items, setItems] = useState<EvaluationSummaryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("q003");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getEvaluationSummary().then((res) => {
      setItems(res);
      if (res.length > 0) setSelectedId(res[0].question_id);
      setLoading(false);
    });
  }, []);

  const current = items.find((i) => i.question_id === selectedId) || items[0];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800 text-xs font-semibold text-purple-800 dark:text-purple-300 mb-2">
          <GitCompare className="w-3.5 h-3.5 text-purple-600" />
          <span>Pipeline Differential Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Answer Comparison: Baseline vs Repaired
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Demonstrate how the M8 post-generation verification harness filters out contradicted statements and repairs ungrounded claims against document evidence.
        </p>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
          Evaluation Cases:
        </span>
        {items.map((item) => (
          <button
            key={item.question_id}
            onClick={() => setSelectedId(item.question_id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedId === item.question_id
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs font-bold"
                : "bg-white dark:bg-[#0B0F17] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <span>{item.question_id}</span>
            <span className="ml-1.5 opacity-60 text-[10px]">({item.category})</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="space-y-6">
          {/* Metadata Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-mono text-slate-400">Query ID: {current.question_id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                Category: {current.category}
              </span>
            </div>

            <div className="flex items-center gap-6 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Baseline Latency: <strong className="text-slate-800 dark:text-slate-200">{current.baseline_latency.toFixed(1)}s</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                Full Pipeline Latency: <strong className="text-slate-800 dark:text-slate-200">{current.full_latency.toFixed(1)}s</strong>
              </span>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Baseline Generation */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Baseline Raw Generation
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                    Unverified
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                  &ldquo;{current.baseline_answer}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Contains potential factual drift & unchecked claims.
                </p>
                <p>Generated directly from retriever context without NLI consistency checking.</p>
              </div>
            </div>

            {/* Right: Verified & Repaired Generation */}
            <div className="p-6 rounded-3xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-900/60 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Verified & Repaired Output
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono font-bold">
                    Ground Truth Attributed
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-serif font-medium">
                  &ldquo;{current.full_answer}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <p className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All claims decomposed, verified against citations, or safely pruned.
                </p>
                <p>Contradicted statements rewritten using document context passages.</p>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Verification Lifecycle:
            </span>
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300">Supported by document</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-700 dark:text-slate-300">Repaired with citation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-700 dark:text-slate-300">Contradicted (eliminated)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-700 dark:text-slate-300">Unverifiable (pruned if ungrounded)</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
