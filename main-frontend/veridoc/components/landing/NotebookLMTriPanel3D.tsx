"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Play,
  Pause,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Radio,
  BookOpen,
  MessageSquare,
  Check,
} from "lucide-react";
import Card3D from "@/components/ui/Card3D";

export default function NotebookLMTriPanel3D() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<number | null>(1);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>({
    "s1": true,
    "s2": true,
    "s3": false,
  });

  const toggleSource = (id: string) => {
    setActiveSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const citations: Record<number, { page: number; doc: string; quote: string; nli: number }> = {
    1: {
      page: 4,
      doc: "vaswani_2017_attention.pdf",
      quote: "We define Scaled Dot-Product Attention as softmax(QK^T / sqrt(d_k))V, scaling by 1/sqrt(d_k) to counteract small gradients in large dimensions.",
      nli: 0.98,
    },
    2: {
      page: 12,
      doc: "training_hardware_spec.pdf",
      quote: "All baseline experiments were trained on a single node with 8 NVIDIA A100-80GB GPUs for 3.5 days, not on TPU clusters.",
      nli: 0.96,
    },
    3: {
      page: 8,
      doc: "ablation_studies_results.pdf",
      quote: "Multi-head attention retains O(n^2 * d) per-layer computational complexity where n is the sequence length.",
      nli: 0.94,
    },
  };

  return (
    <section className="py-20 bg-neutral-50/60 dark:bg-neutral-950/60 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-800 dark:text-blue-300 mb-4 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Interactive NotebookLM Tri-Panel Workspace</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Sources. Conversation. Studio.
          </h3>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            The familiar 3-panel research environment of Google NotebookLM, supercharged with
            automatic claim decomposition, NLI verification, and deep dive audio synthesis.
          </p>
        </div>

        {/* 3D Elevated Tri-Panel Container */}
        <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden transition-all">
          {/* Top Window Bar */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-950/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                  Notebook: Transformers & Attention Mechanisms
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-300/30">
                  Verified Clean
                </span>
              </div>
            </div>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 transition-all"
            >
              <span>Open in Full App</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Tri-Panel Grid (Left Sources, Center Chat, Right Studio) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* PANEL 1: Sources Panel (3 Columns) */}
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50/40 dark:bg-neutral-950/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Sources (3)
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Select to ground</span>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => toggleSource("s1")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      activeSources["s1"]
                        ? "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 shadow-xs"
                        : "bg-neutral-100/50 dark:bg-neutral-900/40 border-transparent opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-white text-[10px] ${
                        activeSources["s1"]
                          ? "bg-emerald-600 border-emerald-600"
                          : "border-neutral-400"
                      }`}
                    >
                      {activeSources["s1"] && <Check className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        vaswani_2017_attention.pdf
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">18 pages • PyMuPDF</p>
                    </div>
                  </div>

                  <div
                    onClick={() => toggleSource("s2")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      activeSources["s2"]
                        ? "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 shadow-xs"
                        : "bg-neutral-100/50 dark:bg-neutral-900/40 border-transparent opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-white text-[10px] ${
                        activeSources["s2"]
                          ? "bg-emerald-600 border-emerald-600"
                          : "border-neutral-400"
                      }`}
                    >
                      {activeSources["s2"] && <Check className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        training_hardware_spec.pdf
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">4 pages • PyMuPDF</p>
                    </div>
                  </div>

                  <div
                    onClick={() => toggleSource("s3")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      activeSources["s3"]
                        ? "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 shadow-xs"
                        : "bg-neutral-100/50 dark:bg-neutral-900/40 border-transparent opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-white text-[10px] ${
                        activeSources["s3"]
                          ? "bg-emerald-600 border-emerald-600"
                          : "border-neutral-400"
                      }`}
                    >
                      {activeSources["s3"] && <Check className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        ablation_studies_results.pdf
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">8 pages • PyMuPDF</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/workspace"
                className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-1.5 transition-colors bg-white dark:bg-neutral-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </Link>
            </div>

            {/* PANEL 2: Chat & Conversation (5 Columns) */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Ask Your Documents
                  </span>
                </div>

                {/* User Prompt Bubble */}
                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-900 dark:text-white self-end">
                  &ldquo;What were the exact hardware constraints and attention scaling formulas?&rdquo;
                </div>

                {/* Grounded AI Answer with Interactive Citation Badges */}
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs sm:text-sm leading-relaxed space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Evidence-Grounded Response</span>
                  </div>

                  <p className="text-neutral-800 dark:text-neutral-200">
                    The paper computes scaled dot-product attention as softmax(QK^T / sqrt(d_k))V
                    with dimension scaling{" "}
                    <button
                      onClick={() => setSelectedCitation(1)}
                      className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded font-mono font-bold text-[11px] transition-all ${
                        selectedCitation === 1
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                      }`}
                    >
                      [1]
                    </button>
                    . Training was conducted strictly on 8 NVIDIA A100 GPUs over 3.5 days, disproving
                    earlier draft claims of TPU clusters{" "}
                    <button
                      onClick={() => setSelectedCitation(2)}
                      className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded font-mono font-bold text-[11px] transition-all ${
                        selectedCitation === 2
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                      }`}
                    >
                      [2]
                    </button>
                    . Multi-head attention maintains O(n^2 * d) total computational complexity{" "}
                    <button
                      onClick={() => setSelectedCitation(3)}
                      className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded font-mono font-bold text-[11px] transition-all ${
                        selectedCitation === 3
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                      }`}
                    >
                      [3]
                    </button>
                    .
                  </p>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2">
                <div className="p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs text-neutral-500">
                  <span className="pl-2">Ask a question across your selected sources...</span>
                  <Link
                    href="/workspace"
                    className="p-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* PANEL 3: Studio & Citation Inspector (4 Columns) */}
            <div className="lg:col-span-4 p-6 bg-neutral-50/40 dark:bg-neutral-950/30 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Studio & Deep Dive
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">NotebookLM Audio</span>
                </div>

                {/* NotebookLM Famous Audio Overview Widget */}
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Audio Overview
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                      Deep Dive
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-snug">
                    Two AI co-hosts summarize and fact-check the uploaded documents into an engaging discussion.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>

                    {/* Animated Audio Waveform */}
                    <div className="flex-1 flex items-center gap-1 h-6">
                      {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65, 40].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            height: isPlayingAudio ? `${h}%` : "20%",
                            transition: "height 0.2s ease-in-out",
                          }}
                          className={`w-1 rounded-full ${
                            isPlayingAudio ? "bg-purple-500" : "bg-neutral-300 dark:bg-neutral-700"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-neutral-500">12:40</span>
                  </div>
                </div>

                {/* Selected Citation Inspector */}
                {selectedCitation && citations[selectedCitation] && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-700/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Citation [{selectedCitation}] Ground Truth
                      </span>
                      <span className="font-mono text-neutral-500">
                        Page {citations[selectedCitation].page}
                      </span>
                    </div>

                    <p className="text-xs italic text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 leading-relaxed">
                      &ldquo;{citations[selectedCitation].quote}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                      <span className="truncate max-w-[150px]">
                        {citations[selectedCitation].doc}
                      </span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        NLI: {(citations[selectedCitation].nli * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href="/workspace"
                  className="w-full text-center block py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold transition-all shadow-xs"
                >
                  Try Interactive Workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

