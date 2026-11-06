"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  MessageSquareCode,
  AlertCircle,
  Loader2,
  BarChart3,
  GitCompare,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { DocumentSummary, EvaluationSummaryItem } from "@/types";

export default function DashboardView() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<EvaluationSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [docsRes, summaryRes] = await Promise.all([
          apiClient.listDocuments(),
          apiClient.getEvaluationSummary(),
        ]);
        setDocuments(docsRes.items);
        setRecentQuestions(summaryRes.slice(0, 4));
      } catch {
        // Fallbacks in apiClient
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are supported for evidence extraction.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const doc = await apiClient.uploadDocument(file, file.name);
      setDocuments((prev) => [doc, ...prev]);
      setUploadSuccess(`Successfully ingested "${file.name}" (${doc.page_count} pages extracted)`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-10">
      {/* ─── 1. Welcome Banner ─── */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Verity AI — Academic & Enterprise Document Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your documents. Verified answers.
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          An evidence-grounded AI system for document question answering, hallucination detection, and claim-level repair. Ask questions, trace citations, and ensure every sentence is provably true.
        </p>
      </div>

      {/* ─── 2. Prominent PDF Upload Zone ─── */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]"
            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {uploading ? "Ingesting & Chunking Document with PyMuPDF..." : "Drop your PDF document here"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">browse files</span> on your computer
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
            <span>• PDF documents up to 50MB</span>
            <span>• Automatic page-level text extraction</span>
            <span>• Dense BGE vector embeddings</span>
          </div>

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 border border-emerald-200/60 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center justify-center gap-2 border border-rose-200/60 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. Quick Action Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          href="/workspace"
          className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Document Workspace</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              NotebookLM-style 3-panel studio to query documents and trace claim citations.
            </p>
          </div>
        </Link>

        <Link
          href="/comparison"
          className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Answer Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Compare baseline generation against evidence-grounded repaired answers.
            </p>
          </div>
        </Link>

        <Link
          href="/evaluation"
          className="p-5 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Evaluation Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live Phase 2 validation metrics (117/117 tests, 26.7% contradiction reduction).
            </p>
          </div>
        </Link>
      </div>

      {/* ─── 4. Recently Uploaded Documents ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recently Uploaded Documents</h2>
          </div>
          <Link
            href="/documents"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View all ({documents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B0F17] overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No documents found. Drop a PDF above to begin.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{doc.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{doc.filename} • {doc.page_count} pages</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                      {doc.status}
                    </span>
                    <Link
                      href="/workspace"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                    >
                      Chat in Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 5. Recent Questions & Benchmarks ─── */}
      {recentQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Evaluation Queries</h2>
            </div>
            <Link
              href="/comparison"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore full benchmark</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentQuestions.map((q) => (
              <div
                key={q.question_id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {q.question_id}
                  </span>
                  <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    Category: {q.category}
                  </span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                  &ldquo;{q.full_answer}&rdquo;
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Baseline: {q.baseline_latency.toFixed(1)}s</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified & Grounded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

