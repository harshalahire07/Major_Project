"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, TrendingDown, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function BenchmarksSection() {
  return (
    <section id="benchmarks" className="py-20 bg-neutral-50/50 dark:bg-neutral-950/50 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-3">
            Empirical Results
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Proven Hallucination Reduction
          </h3>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
            Real benchmark data derived from Phase 2 paired evaluation experiments on standardized
            multi-domain document question answering datasets.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                Contradiction Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  -26.7%
                </span>
                <span className="text-xs text-neutral-400 line-through">30.0%</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Dropped from 30.0% baseline contradiction rate down to 3.3% in full pipeline.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
              <span>89% relative drop</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                Factual Support Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  86.7%
                </span>
                <span className="text-xs text-emerald-500 font-semibold">+26.7%</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Increased from 60.0% baseline up to 86.7% of claims fully supported by evidence.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>Statistically significant</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                Grounding Precision
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  100%
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Zero fabricated citations: every claim requires exact chunk and page provenance.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Exact Page References</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                Automated Test Suite
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  117/117
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Passing unit, integration, and evaluation harness tests in the backend repository.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>100% passing tests</span>
            </div>
          </div>
        </div>

        {/* Visual Comparison Bar Chart */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-base">
              Pipeline Performance Comparison
            </h4>
            <Link
              href="/evaluation"
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full Analytics Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bar 1: Supported Claims */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300">Supported Claims Rate</span>
              <span className="text-neutral-500">
                Baseline: 60.0% → <strong className="text-emerald-600">Verity AI: 86.7%</strong>
              </span>
            </div>
            <div className="h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: "86.7%" }} />
            </div>
          </div>

          {/* Bar 2: Contradicted Claims */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300">Contradicted Claims Rate (Hallucinations)</span>
              <span className="text-neutral-500">
                Baseline: 30.0% → <strong className="text-emerald-600">Verity AI: 3.3%</strong>
              </span>
            </div>
            <div className="h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex">
              <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: "3.3%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
