"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert, FileText, Play } from "lucide-react";
import ThreeDTouchCanvas from "@/components/ui/ThreeDTouchCanvas";
import Card3D from "@/components/ui/Card3D";

export default function LandingHero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* 3D Zero-Gravity Touch Canvas Background */}
      <ThreeDTouchCanvas />

      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-100/40 via-sky-100/40 to-indigo-100/30 dark:from-emerald-950/20 dark:via-sky-950/20 dark:to-indigo-950/20 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Floating Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100/90 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-8 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Major Research Project • M8 Verification Pipeline</span>
          <span className="text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Hallucination Elimination
          </span>
        </div>

        {/* Oversized Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.08]">
          Your documents. <br />
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
            Every claim verified.
          </span> <br />
          <span className="text-emerald-600 dark:text-emerald-400">Zero hallucinations.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Standard RAG produces fluent answers contaminated with undetected factual hallucinations.
          Verity AI decomposes generated answers into atomic claims, verifies each against retrieved
          source text via Natural Language Inference (NLI), and automatically repairs contradictions.
        </p>

        {/* Action CTAs with 3D tactile feel */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] active:translate-y-0.5"
          >
            <span>Launch Document Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 text-base font-medium shadow-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 backdrop-blur-md active:translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current text-neutral-400" />
            <span>Interactive Demo</span>
          </a>

          <Link
            href="/evaluation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-base font-medium transition-colors"
          >
            <span>Research Benchmarks (Phase 2)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Highlights Grid with 3D Tilt Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <Card3D intensity={12} className="rounded-2xl h-full">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md shadow-xs h-full">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Decomposition</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Atomic Claim Extraction
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Isolates every verifiable statement
              </p>
            </div>
          </Card3D>

          <Card3D intensity={12} className="rounded-2xl h-full">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md shadow-xs h-full">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verification</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Cross-Encoder NLI
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Supported vs Contradicted
              </p>
            </div>
          </Card3D>

          <Card3D intensity={12} className="rounded-2xl h-full">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md shadow-xs h-full">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Repair</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Iterative Correction
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Rewrites invalid assertions
              </p>
            </div>
          </Card3D>

          <Card3D intensity={12} className="rounded-2xl h-full">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md shadow-xs h-full">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Attribution</span>
              </div>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Exact Page Citations
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Zero black-box assertions
              </p>
            </div>
          </Card3D>
        </div>
      </div>
    </section>
  );
}
