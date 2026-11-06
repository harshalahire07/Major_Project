"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import Card3D from "@/components/ui/Card3D";

interface Notebook {
  id: string;
  title: string;
  topic: string;
  coverGradient: string;
  spineColor: string;
  sourcesCount: number;
  claimsCount: number;
  accuracy: string;
  date: string;
  activeSource: string;
}

export default function Notebook3DDesk() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const notebooks: Notebook[] = [
    {
      id: "nb-1",
      title: "Transformers & Attention Mechanisms",
      topic: "Machine Learning Research",
      coverGradient: "from-emerald-800 via-teal-900 to-neutral-900",
      spineColor: "bg-emerald-600",
      sourcesCount: 18,
      claimsCount: 42,
      accuracy: "94.6%",
      date: "Updated today",
      activeSource: "vaswani_2017_attention.pdf",
    },
    {
      id: "nb-2",
      title: "Q3 10-K SEC Financial & Risk Audit",
      topic: "Corporate Financial Analysis",
      coverGradient: "from-blue-900 via-indigo-950 to-neutral-900",
      spineColor: "bg-blue-600",
      sourcesCount: 12,
      claimsCount: 68,
      accuracy: "89.2%",
      date: "Updated 2h ago",
      activeSource: "sec_q3_report_2024.pdf",
    },
    {
      id: "nb-3",
      title: "Clinical Trial Toxicity & Oncology Study",
      topic: "Biomedical Literature",
      coverGradient: "from-purple-900 via-neutral-900 to-neutral-950",
      spineColor: "bg-purple-600",
      sourcesCount: 9,
      claimsCount: 51,
      accuracy: "97.1%",
      date: "Updated yesterday",
      activeSource: "clinical_oncology_phase3.pdf",
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Google NotebookLM Inspired Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-4 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>NotebookLM Inspired Workspace Architecture</span>
        </div>
        <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Your Personal Verified Notebooks
        </h3>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Ground every notebook in your own documents. Each notebook is an isolated, evidence-verified
          thinking partner with zero hallucinations.
        </p>
      </div>

      {/* 3D Fanned Notebooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {/* Create New Notebook Card (NotebookLM Iconic CTA) */}
        <Link
          href="/workspace"
          className="group relative rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-400 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-900 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] min-h-[340px]"
        >
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-md flex items-center justify-center text-neutral-900 dark:text-white group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
            <Plus className="w-8 h-8" />
          </div>

          <h4 className="mt-6 text-lg font-bold text-neutral-900 dark:text-white">
            Create new notebook
          </h4>
          <p className="mt-2 text-xs text-neutral-500 max-w-[200px] leading-relaxed">
            Upload PDFs, research papers, or docs to start a new verified session
          </p>

          <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        {/* 3D Physical Notebook Cards */}
        {notebooks.map((nb) => (
          <div
            key={nb.id}
            onMouseEnter={() => setHoveredId(nb.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="transition-transform duration-300"
          >
            <Card3D intensity={14} className="h-full rounded-3xl">
              <Link
                href="/workspace"
                className={`relative block h-full rounded-3xl p-6 text-white overflow-hidden shadow-xl transition-all duration-300 bg-gradient-to-br ${nb.coverGradient} flex flex-col justify-between border border-white/10 group min-h-[340px]`}
              >
                {/* 3D Realistic Spine Indicator on Left */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-3.5 ${nb.spineColor} shadow-md`}
                />
                {/* Paper Pages Texture along right edge */}
                <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-neutral-200/40 rounded-l shadow-inner" />

                {/* Top Section */}
                <div className="pl-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-neutral-200 backdrop-blur-md">
                      {nb.topic}
                    </span>
                    <span className="text-[11px] text-neutral-300">{nb.date}</span>
                  </div>

                  <h4 className="text-xl font-bold tracking-tight text-white leading-snug group-hover:text-emerald-300 transition-colors">
                    {nb.title}
                  </h4>
                </div>

                {/* Middle Content Preview */}
                <div className="pl-3 my-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{nb.activeSource}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-300">
                    <span>{nb.sourcesCount} sources attached</span>
                    <span className="font-semibold text-emerald-300">
                      {nb.accuracy} verified
                    </span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="pl-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{nb.claimsCount} claims checked</span>
                  </div>

                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-neutral-900 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </Card3D>
          </div>
        ))}
      </div>
    </section>
  );
}

