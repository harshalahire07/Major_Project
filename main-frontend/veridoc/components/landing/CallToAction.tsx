"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Github, Sparkles } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-neutral-900 dark:bg-neutral-950 text-white p-8 sm:p-14 overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experience Evidence-Grounded AI</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Stop guessing if your AI is hallucinating.
          </h3>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Upload any academic paper, technical specification, or financial report. Receive answers
            where every claim is proven, citations are clickable, and errors are automatically repaired.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-base shadow-lg transition-all hover:scale-[1.02]"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://github.com/harshalahire07/Major_Project"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-medium text-base border border-neutral-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
