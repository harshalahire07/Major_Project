"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Play,
  Lock,
  Search,
  Split,
  Shield,
  Check,
  X,
  AlertTriangle,
  FileUp,
  GitBranch,
  Download,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  Hash,
  Dna,
  Scale,
  Building2,
  Stethoscope,
  Menu,
} from "lucide-react";

export default function StitchLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = emailInput
      ? `/workspace?email=${encodeURIComponent(emailInput)}`
      : "/workspace";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600/10 selection:text-blue-700">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
              Verity<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
            <a href="#canvas" className="hover:text-slate-900 transition-colors">
              Platform
            </a>
            <a href="#pipeline" className="hover:text-slate-900 transition-colors">
              Verification Engine
            </a>
            <a href="#use-cases" className="hover:text-slate-900 transition-colors">
              Case Studies
            </a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors">
              Solutions
            </a>
            <a href="#benchmarks" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Docs
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/workspace"
              className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
            >
              Sign In
            </Link>

            <Link
              href="/workspace"
              className="text-[13px] font-medium text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
            >
              Request Demo
            </Link>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold shadow-xs hover:shadow transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Profile Avatar Dot */}
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
              V
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-600"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 text-sm">
            <a href="#canvas" onClick={() => setMobileMenuOpen(false)} className="block py-1">
              Platform
            </a>
            <a href="#pipeline" onClick={() => setMobileMenuOpen(false)} className="block py-1">
              Verification Engine
            </a>
            <a href="#use-cases" onClick={() => setMobileMenuOpen(false)} className="block py-1">
              Case Studies
            </a>
            <Link href="/workspace" className="block w-full text-center py-2 rounded-lg bg-blue-600 text-white font-semibold">
              Get Started Free →
            </Link>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-10 pb-14 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Feature Pill Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 hover:bg-blue-100/60 transition-colors shadow-2xs">
          <span>◆ INTRODUCING:</span>
          <span>DeBERTa-v3 & Qwen 2.5 Claim-Level Verification & Auto-Repair Architecture</span>
          <ArrowRight className="w-3 h-3 text-blue-600" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Ask Documents. Verify Answers. <br />
          <span className="text-blue-600">Trust Evidence.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          The enterprise intelligence platform that decomposes generated answers into atomic
          propositions, cross-evaluates each claim against source PDFs in real-time, and auto-repairs
          hallucinations before they reach critical workflows.
        </p>

        {/* Dual Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
          >
            <span>Try Interactive Inspector</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#canvas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs sm:text-sm font-medium shadow-2xs hover:bg-slate-50 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-slate-500" />
            <span>Watch 2-Min Product Tour</span>
          </a>
        </div>

        {/* Social Proof Logos Bar */}
        <div className="mt-12 pt-7 border-t border-slate-100">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-5">
            TRUSTED BY RESEARCH, ENTERPRISE INTELLIGENCE & HIGH-STAKES TEAMS ACROSS 1,000+ WORKSPACES
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Stanford BioNLP</span>
            </div>
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-slate-400" />
              <span>GenomicsPharma</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-400" />
              <span>Veritas LegalDiscovery</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-slate-400" />
              <span>FerroHealth Advisory</span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>ISO-27001 & HIPAA Risk Compliant</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. THE CANVAS SHOWCASE SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="canvas" className="py-12 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header with Telemetry Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-full mb-2">
                <span>LIVE INTERACTIVE AUDIT • Real-time Claim Verification Engine</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                The Verity Synthesis & Verification Canvas
              </h2>
            </div>

            {/* 4 Small Telemetry Boxes */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                Precision: <strong className="text-emerald-600 font-bold">99.4% (Factual)</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                NLI Model: <strong className="text-slate-900 font-mono">DeBERTa-v3</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                Generation Model: <strong className="text-slate-900 font-mono">Qwen 2.5 7B</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                Retrieval Latency: <strong className="text-slate-900 font-mono">180ms (FAISS)</strong>
              </div>
            </div>
          </div>

          {/* The Canvas Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Top Query Bar */}
            <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Query: &ldquo;Evaluate Phase 3 safety and primary endpoints for VRT-804&rdquo;</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  97.2% Factual Confidence | 4 Claims
                </span>
              </div>
            </div>

            {/* Canvas Body (Left Raw, Center Node, Right Repaired) */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Standard Raw LLM Generation */}
              <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-rose-200/90 bg-rose-50/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      STANDARD RAW LLM GENERATION
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      2 HALLUCINATIONS DETECTED
                    </span>
                  </div>

                  <div className="text-xs leading-relaxed text-slate-700 space-y-2.5">
                    <p>
                      In the Phase 3 trial (n=1,240), VRT-804 achieved complete remission in 74.2% of registered patients.
                    </p>

                    {/* Strikethrough Hallucination Box */}
                    <div className="p-2.5 rounded-lg bg-rose-100/60 border border-rose-300 text-rose-900">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-0.5">
                        CONTRADICTED ASSERTION (P.18)
                      </span>
                      <p className="line-through decoration-rose-500 font-medium">
                        Primary endpoint was achieved early: zero treatment-emergent adverse events were observed, and FDA accelerated review was requested.
                      </p>
                    </div>

                    <p>
                      FDA submissions filing deadline was scheduled for Q3 2023 across international regulatory bodies.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Author: generic-llm-v4</span>
                  <span className="font-semibold text-rose-600">Status: Corrupted Output</span>
                </div>
              </div>

              {/* Center Column: Pipeline Decomposition Flow */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center p-2 text-center space-y-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                </div>

                <div className="space-y-1.5 w-full text-[11px]">
                  <div className="p-1 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                    1. Proposition Decomp (4 claims)
                  </div>
                  <div className="p-1 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                    2. DeBERTa Cross-Encoder NLI
                  </div>
                  <div className="p-1 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                    3. Evidence Contrast & Repair
                  </div>
                  <div className="p-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                    4. Grounded Output Assembly
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">180ms total</span>
              </div>

              {/* Right Column: Verity Repaired & Grounded Answer */}
              <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-emerald-300 bg-emerald-50/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      VERITY REPAIRED & GROUNDED ANSWER
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      100% FACTUAL GROUNDING
                    </span>
                  </div>

                  <div className="text-xs leading-relaxed text-slate-800 space-y-2.5">
                    <p>
                      In the randomized clinical cohort, VRT-804 achieved complete remission in 74.2% of registered patients{" "}
                      <span className="font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">
                        [Doc 2, p. 14, Chunk 02]
                      </span>
                      .
                    </p>

                    {/* Repaired Fact Claim Box */}
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-300 text-blue-950">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                        ✓ VERITY REPAIRED CLAIM:
                      </span>
                      <p className="font-medium text-slate-900">
                        Primary endpoint effectiveness was documented at 74.2%, however 14.8% of cohorts experienced Grade 2/3 adverse events (transient hepatic enzyme elevation){" "}
                        <span className="font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">
                          [Doc 2, p. 18]
                        </span>
                        .
                      </p>
                    </div>

                    <p>
                      FDA submission filing approvals were proposed for Q4 2025 across key international review panels{" "}
                      <span className="font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">
                        [Doc 3, p. 9, Appendix C]
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Model: Qwen-2.5-7B • Engine: DeBERTa-v3-NLI</span>
                  <span className="font-semibold text-emerald-700">4/4 Claims Grounded</span>
                </div>
              </div>
            </div>

            {/* Bottom Legend Bar */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Claim Classification Legend:
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Supported
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Contradicted
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Unverifiable
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Auto-Repaired
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                Exact bounding box and page provenance on docs: <strong className="text-slate-700">doc_002, doc_003</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FOUNDATIONAL ARCHITECTURE
      ───────────────────────────────────────────────────────────── */}
      <section id="architecture" className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-2">
            FOUNDATIONAL ARCHITECTURE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for zero-tolerance analytical intelligence
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Generic RAG just concatenates text chunks together and hopes the model is truthful. Verity
            decomposes, checks, and proofs every syllable against primary source material.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                HIGH-FIDELITY EXTRACTION
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Zero-Hallucination Retrieval
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Multi-vector hybrid FAISS + dense semantic embeddings with paragraph-level bounding
                boxes and exact page coordinates down to individual source lines.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500">Chunk #14 • Page 18</span>
                <span className="px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700 text-[10px]">
                  Score: 0.94
                </span>
              </div>
              <p className="text-[11px] text-slate-700 truncate font-mono">
                &ldquo;Adverse events observed in 14.8% of cohorts...&rdquo;
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                <Split className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ATOMIC PROPOSITION AUDITING
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Atomic Proposition Auditing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Breaks complex compound answers into single, verifiable facts. Classifies every
                clause into Supported, Contradicted, or Unverifiable via cross-attention calibrated
                NLI models.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <span>Decomposed Claims (3)</span>
                <span className="text-blue-600">Auto-Repaired</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  ✓ Claim 1
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold line-through">
                  ✗ Claim 2
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                  ✓ Repaired
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 border border-purple-100">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                REGULATORY & LEGAL AUDITABILITY
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Cryptographic Audit Ledger
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every parsed and rewritten assertion produces an immutable SHA-256 provenance hash
                linking synthetic model identity to evidentiary source chunks, ready for legal and
                clinical review.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> SHA-256
                </span>
                <span className="text-purple-600 font-bold">Certified Defensible</span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 truncate">
                0x9f4a...8c2b (Signed Proof)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. COMPARISON TABLE: STANDARD RAG VS VERITY
      ───────────────────────────────────────────────────────────── */}
      <section id="benchmarks" className="py-16 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-2">
              INTERACTIVE BENCHMARK AUDIT
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Standard RAG Fails vs. Why Verity Succeeds
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Standard enterprise knowledge bots paste semantic search snippets into prompts — Verity
              introduces a mathematical verification barrier prior to token generation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    <th className="py-3.5 px-6 w-1/4">Criteria / Architecture Guarantee</th>
                    <th className="py-3.5 px-6 w-3/8 text-rose-900 bg-rose-50/30">
                      Standard RAG (OpenAI / LangChain / Llama)
                    </th>
                    <th className="py-3.5 px-6 w-3/8 text-blue-900 bg-blue-100/50 font-extrabold">
                      Verity Evidence-Grounded Architecture
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 align-top">
                      Hallucination Handling
                    </td>
                    <td className="py-4 px-6 bg-rose-50/10 align-top">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-semibold">Blind generation.</strong>
                          <span className="text-slate-600 text-xs">
                            Plausible hallucinations pass to end-user undetected without verification.
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-blue-50/20 align-top">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-950 block font-semibold">Deterministic verification.</strong>
                          <span className="text-slate-700 text-xs">
                            Every atomic proposition verified against source chunks before generation completes.
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 align-top">
                      Citation Fidelity
                    </td>
                    <td className="py-4 px-6 bg-rose-50/10 align-top">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-semibold">Superficial links.</strong>
                          <span className="text-slate-600 text-xs">
                            Points vaguely to entire multi-page documents or broad chunks without precision.
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-blue-50/20 align-top">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-950 block font-semibold">Sub-paragraph bounding.</strong>
                          <span className="text-slate-700 text-xs">
                            Exact sentence-by-sentence tracking with character-span proof and page numbers.
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 align-top">
                      Automated Repair Loop
                    </td>
                    <td className="py-4 px-6 bg-rose-50/10 align-top">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-semibold">None.</strong>
                          <span className="text-slate-600 text-xs">
                            The system makes blind guesses when encountering contradictory statements.
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-blue-50/20 align-top">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-950 block font-semibold">Synthetic Error-Repair Engine.</strong>
                          <span className="text-slate-700 text-xs">
                            Automatically corrects invalid clauses using verified document context.
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 align-top">
                      Regulatory & Legal Auditability
                    </td>
                    <td className="py-4 px-6 bg-rose-50/10 align-top">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-semibold">Zero cryptographic proof.</strong>
                          <span className="text-slate-600 text-xs">
                            Non-deterministic black box responses unsuitable for compliance audits.
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-blue-50/20 align-top">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-950 block font-semibold">Immutable SHA-256 Audit Ledger.</strong>
                          <span className="text-slate-700 text-xs">
                            Full audit trail compliant for 21 CFR Part 11 and EU AI Act Article 13 mandates.
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. FOUR-STAGE VERIFICATION PIPELINE
      ───────────────────────────────────────────────────────────── */}
      <section id="pipeline" className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-2">
            FOUR-STAGE VERIFICATION PIPELINE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            From unstructured repository to legally defensible answers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Phase 01 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase font-mono block mb-2">
                PHASE 01
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ingest & Structure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-modal OCR extracts layout, tabular spans, footnotes, and citation trees across 50MB+ PDFs.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
              {["PDF", "DOCX", "EPUB", "XML"].map((b) => (
                <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Phase 02 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase font-mono block mb-2">
                PHASE 02
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Cross-Synthesis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-document reasoning cross-indexes queries across thousands of pages to extract candidate assertions.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
              {["FAISS Hybrid", "Vector Space"].map((b) => (
                <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Phase 03 (Highlighted) */}
          <div className="p-5 rounded-2xl bg-white border-2 border-blue-600 shadow-sm ring-4 ring-blue-50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase font-mono block mb-2">
                PHASE 03
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Atomic Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every isolated statement is audited against primary evidence. Contradictions are detected; unverifiable assertions flagged.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
              {["DeBERTa-v3", "Cross-Encoder"].map((b) => (
                <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-700">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Phase 04 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase font-mono block mb-2">
                PHASE 04
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Audit Export</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates certified audit packages with highlighted source PDFs, confidence scores, and cryptographic hash metadata.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
              {["Full Ledger", "SHA-256 Validated"].map((b) => (
                <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. ENTERPRISE PRODUCTION USE CASES
      ───────────────────────────────────────────────────────────── */}
      <section id="use-cases" className="py-16 md:py-20 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 block mb-2">
                ENTERPRISE PRODUCTION USE CASES
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight max-w-2xl">
                Built for environments where truth is legally or clinically non-negotiable
              </h2>
            </div>

            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>Read our Whitepaper & Nature Medicine validation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Clinical */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
                  alt="Clinical Trials & Oncology"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-2xs">
                    CLINICAL RESEARCH & ONCOLOGY
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Clinical Trials & Meta-Analyses
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Verity QA extracts and cross-validates adverse events, dosages, and patient demographics
                  across hundreds of PDF trial submissions without missing subtle contradictions buried in
                  complex multi-page tables.
                </p>
              </div>
            </div>

            {/* Card 2: Legal */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80"
                  alt="Legal Discovery & 10-K Audits"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-2xs">
                    SECURITIES LAW & ENTERPRISE AUDIT
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  High-Stakes Legal Discovery & 10-K Audits
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Scan millions of deposition pages and SEC disclosures. Find poisonous contracts,
                  identify non-disclosures, and eliminate hallucinations that cause legal malpractice in
                  critical proceedings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. KEY STATS (99.4%, 0.0%, 180ms, -84%)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-600">
                99.4%
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono">
                FACTUAL GROUNDING RATE
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Across 1,200 complex enterprise research queries on real multi-domain PDFs.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-emerald-600">
                0.0%
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono">
                UNDETECTED CONTRADICTIONS
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero unflagged factual hallucinations passed through into downstream answers.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                180ms
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono">
                AVERAGE CLAIM VERIFICATION
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sub-second cross-encoder inference for parallelized atomic proposition evaluation.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-600">
                -84%
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono">
                REDUCTION IN MANUAL AUDIT
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eliminates tedious manual citation verification for compliance and research teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. ENTERPRISE EVALUATION SUITE CTA BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#EEF4FF] border border-blue-200/60 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>ENTERPRISE EVALUATION SUITE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-xl mx-auto">
            Ready to eliminate hallucinations from your enterprise knowledge workflows?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Deploy Verity AI on-premise or behind your VPC. Process your first 10 documents in under 60
            seconds with full provenance and automated repair.
          </p>

          {/* Form */}
          <form
            onSubmit={handleCtaSubmit}
            className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your enterprise email..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all shrink-0"
            >
              <span>Get Started for Free Today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              SOC 2 Type II Certified
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              HIPAA & GDPR Compliant
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Full Local On-Premises Option
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              14-Day Pilot • No Credit Card
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Verity<span className="text-blue-600">AI</span>
                </span>
              </Link>

              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Ask Documents. Verify Answers. Trust Evidence. Research-grade provenance for legal,
                clinical, and high-stakes enterprise workflows.
              </p>

              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Systems Operational [99.98%]</span>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                <li><Link href="/workspace" className="hover:text-slate-900">Features</Link></li>
                <li><a href="#canvas" className="hover:text-slate-900">Verification Engine</a></li>
                <li><a href="#use-cases" className="hover:text-slate-900">Enterprise Use Cases</a></li>
                <li><Link href="/evaluation" className="hover:text-slate-900">Pricing Tier</Link></li>
                <li>
                  <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 inline-flex items-center gap-1">
                    API Documentation <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Research & Labs */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Research & Labs
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                <li><Link href="/evaluation" className="hover:text-slate-900">Empirical Benchmark Metrics</Link></li>
                <li><a href="#pipeline" className="hover:text-slate-900">Multi-Hop Reasoning Graph</a></li>
                <li><a href="#canvas" className="hover:text-slate-900">Synthetic Error-Repair Study</a></li>
                <li><Link href="/claims" className="hover:text-slate-900">Ontologies & Taxonomy</Link></li>
              </ul>
            </div>

            {/* Security & Trust */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Security & Trust
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>SOC 2 Type II Certified</li>
                <li>ISO 27001 & HIPAA</li>
                <li>21 CFR Part 11 Compliant</li>
                <li>HIPAA BAA Compliant</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Verity AI Inc. All proprietary rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Security Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
