"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Send,
  Loader2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  BookOpen,
  Sliders,
  Check,
  X,
  Info,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { DocumentSummary, QueryResponse, FinalClaimState, RetrievalResultItem } from "@/types";

interface ChatItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: QueryResponse;
  timestamp: string;
}

export default function DocumentWorkspace() {
  // Panel collapse states
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // Documents state
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [inputQuery, setInputQuery] = useState("");
  const [pipelineMode, setPipelineMode] = useState<"full" | "baseline">("full");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Welcome to the Verity AI Workspace. Select your uploaded PDF documents from the left panel, then ask any question. Every claim generated will be decomposed, cross-checked against document evidence, and repaired if unsupported.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Active verification inspection state
  const [activeResponse, setActiveResponse] = useState<QueryResponse | null>(null);
  const [inspectingEvidence, setInspectingEvidence] = useState<{
    claimText: string;
    evidence: RetrievalResultItem[];
  } | null>(null);
  const [expandedClaimIds, setExpandedClaimIds] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isSubmitting]);

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await apiClient.listDocuments();
      setDocuments(res.items);
      if (res.items.length > 0 && selectedDocIds.length === 0) {
        setSelectedDocIds([res.items[0].id]);
      }
    } catch {
      // Handled by apiClient fallback
    } finally {
      setLoadingDocs(false);
    }
  };

  const toggleSelectDoc = (id: string) => {
    if (selectedDocIds.includes(id)) {
      if (selectedDocIds.length > 1) {
        setSelectedDocIds(selectedDocIds.filter((d) => d !== id));
      }
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const doc = await apiClient.uploadDocument(file, file.name);
      setDocuments((prev) => [doc, ...prev]);
      setSelectedDocIds([doc.id]);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteDocument = async (id: string) => {
    await apiClient.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSelectedDocIds((prev) => prev.filter((d) => d !== id));
    setDeleteConfirmId(null);
  };

  const handleSendQuery = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isSubmitting) return;

    if (selectedDocIds.length === 0) {
      alert("Please select at least one document from the left panel.");
      return;
    }

    const userMsg: ChatItem = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsSubmitting(true);

    try {
      const resp = await apiClient.submitQuery(text, selectedDocIds, pipelineMode);
      setActiveResponse(resp);

      const assistantMsg: ChatItem = {
        id: "asst-" + Date.now(),
        role: "assistant",
        content: resp.final_answer || resp.draft_answer,
        response: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatItem = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: `Error executing verification pipeline: ${err.message || "Backend error"}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClaimExpand = (claimId: string) => {
    setExpandedClaimIds((prev) => ({
      ...prev,
      [claimId]: !prev[claimId],
    }));
  };

  // Compute verification counts
  const claims = activeResponse?.claims || [];
  const supportedCount = claims.filter(
    (c) => c.final_verification_result.status === "SUPPORTED" && c.repair_status !== "REPAIRED"
  ).length;
  const contradictedCount = claims.filter(
    (c) => c.final_verification_result.status === "CONTRADICTED"
  ).length;
  const unverifiableCount = claims.filter(
    (c) => c.final_verification_result.status === "UNVERIFIABLE"
  ).length;
  const repairedCount = claims.filter((c) => c.repair_status === "REPAIRED").length;

  const suggestedQuestions = [
    "What is the main goal of the SciHal paper?",
    "How does FactLens define a fine-grained fact?",
    "What dataset is used for evaluation in Provenance?",
    "How does HalluCorrect repair AI hallucinations?",
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50 dark:bg-[#070A0F]">
      {/* ─── LEFT PANEL — Sources (NotebookLM Style) ─── */}
      <div
        className={`border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] flex flex-col transition-all duration-300 z-20 shrink-0 ${
          leftOpen ? "w-72 lg:w-80" : "w-12 items-center"
        }`}
      >
        {/* Panel Header */}
        <div className="h-14 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          {leftOpen ? (
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Sources ({documents.length})
              </h2>
            </div>
          ) : (
            <BookOpen className="w-4 h-4 text-slate-400" />
          )}

          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={leftOpen ? "Collapse sources" : "Expand sources"}
          >
            {leftOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>

        {/* Panel Content */}
        {leftOpen && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Upload Button */}
            <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all shadow-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Extracting PDF (PyMuPDF)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload New PDF Source</span>
                  </>
                )}
              </button>

              {uploadError && (
                <div className="mt-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-[11px] flex items-center justify-between">
                  <span>{uploadError}</span>
                  <button onClick={() => setUploadError(null)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {loadingDocs ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading documents...</div>
              ) : documents.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No documents uploaded yet. Upload a PDF to begin.
                </div>
              ) : (
                documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleSelectDoc(doc.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col gap-1.5 relative group ${
                        isSelected
                          ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 shadow-xs"
                          : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {doc.title || doc.filename}
                          </span>
                        </div>

                        {/* Delete Action with Confirmation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(doc.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition-opacity"
                          title="Delete source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                        <span>{doc.page_count} pages</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Summary Footer */}
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{selectedDocIds.length} source(s) selected</span>
              <button
                onClick={() => setSelectedDocIds(documents.map((d) => d.id))}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Select all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── CENTER PANEL — Ask Your Documents (Chat) ─── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Workspace Sub-Header */}
        <div className="h-14 px-5 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0B0F17]/70 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Verified Document Reasoning
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
              {selectedDocIds.length} active source(s) linked
            </span>
          </div>

          {/* Mode Switcher: Full Pipeline vs Baseline */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setPipelineMode("full")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  pipelineMode === "full"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Decompose claims, verify against evidence with NLI, and repair hallucinations"
              >
                Full Verification
              </button>
              <button
                onClick={() => setPipelineMode("baseline")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  pipelineMode === "baseline"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Raw unverified RAG generation for comparison"
              >
                Baseline Only
              </button>
            </div>

            {/* Toggle Right Panel */}
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={rightOpen ? "Collapse verification panel" : "Expand verification panel"}
            >
              {rightOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.role === "user" ? "ml-auto justify-end" : "mr-auto"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                  V
                </div>
              )}

              <div
                className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm max-w-xl"
                    : "bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm max-w-2xl"
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Assistant Metadata / Citations */}
                {msg.response && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {msg.response.model_name}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500">
                        {msg.response.mode === "full" ? "M8 Full Pipeline" : "Baseline RAG"}
                      </span>
                    </div>

                    {msg.response.claims && msg.response.claims.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveResponse(msg.response!);
                          setRightOpen(true);
                        }}
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>{msg.response.claims.length} claims verified</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Submitting / Pipeline Loading State */}
          {isSubmitting && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="rounded-2xl p-4 bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>Processing query with verification pipeline...</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-500">
                  <p>1. Semantic retrieval with FAISS & BGE-Small embeddings...</p>
                  <p>2. Decomposing response into atomic factual claims...</p>
                  <p>3. Executing NLI cross-encoder verification against evidence...</p>
                  <p>4. Applying targeted hallucination repair to ungrounded claims...</p>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts (if chat is fresh) */}
        {chatMessages.length <= 1 && (
          <div className="px-6 py-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Suggested questions from benchmark:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(q)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-xs text-slate-700 dark:text-slate-300 transition-all text-left shadow-xs hover:scale-[1.01]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B0F17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2 max-w-4xl mx-auto rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
          >
            <input
              type="text"
              placeholder="Ask a question about your uploaded documents..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isSubmitting}
              className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Verification Results ─── */}
      <div
        className={`border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] flex flex-col transition-all duration-300 z-20 shrink-0 ${
          rightOpen ? "w-80 lg:w-96" : "w-12 items-center"
        }`}
      >
        {/* Panel Header */}
        <div className="h-14 px-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setRightOpen(!rightOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={rightOpen ? "Collapse verification" : "Expand verification"}
          >
            {rightOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>

          {rightOpen && (
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verification Results</span>
            </h2>
          )}
        </div>

        {/* Panel Content */}
        {rightOpen && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
            {/* Summary Counters */}
            <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Overall Claim Breakdown
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500">Total Claims</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{claims.length}</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Supported</span>
                  <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">{supportedCount}</p>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800">
                  <span className="text-[11px] text-rose-700 dark:text-rose-400">Contradicted</span>
                  <p className="text-base font-bold text-rose-800 dark:text-rose-300">{contradictedCount}</p>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800">
                  <span className="text-[11px] text-blue-700 dark:text-blue-400">Repaired</span>
                  <p className="text-base font-bold text-blue-800 dark:text-blue-300">{repairedCount}</p>
                </div>
              </div>
            </div>

            {/* Individual Claim Cards */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Atomic Claim Inspection
              </span>

              {claims.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                  Ask a question to see claim-level verification, citations, and repair history.
                </div>
              ) : (
                claims.map((claim) => {
                  const isExpanded = !!expandedClaimIds[claim.claim_id];
                  const finalResult = claim.final_verification_result;
                  const isRepaired = claim.repair_status === "REPAIRED";

                  return (
                    <div
                      key={claim.claim_id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs shadow-xs space-y-2.5 transition-all"
                    >
                      {/* Top Row: Order & Status */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-slate-400">
                          Claim #{claim.claim_order}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isRepaired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              REPAIRED
                            </span>
                          ) : finalResult.status === "SUPPORTED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              SUPPORTED
                            </span>
                          ) : finalResult.status === "CONTRADICTED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              CONTRADICTED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              UNVERIFIABLE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Claim Text */}
                      <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        &ldquo;{claim.current_claim_text}&rdquo;
                      </p>

                      {/* If Repaired: Show Original vs Repaired Diff */}
                      {isRepaired && (
                        <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 text-[11px] space-y-1">
                          <p className="text-slate-500 line-through">
                            Original: &ldquo;{claim.original_claim_text}&rdquo;
                          </p>
                          <p className="text-blue-800 dark:text-blue-300 font-medium">
                            Repaired: &ldquo;{claim.current_claim_text}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Evidence Accordion Toggle */}
                      <button
                        onClick={() => toggleClaimExpand(claim.claim_id)}
                        className="w-full flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                      >
                        <span>
                          {isExpanded ? "Hide Document Evidence" : "Inspect Document Evidence"}
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Expanded Evidence Details */}
                      {isExpanded && (
                        <div className="pt-2 space-y-2 text-[11px] border-t border-slate-100 dark:border-slate-800">
                          {finalResult.evidence && finalResult.evidence.length > 0 ? (
                            finalResult.evidence.map((ev, eIdx) => (
                              <div
                                key={eIdx}
                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1"
                              >
                                <div className="flex items-center justify-between text-slate-500">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    Page {ev.page_number}
                                  </span>
                                  <span className="font-mono text-[10px]">
                                    Match: {Math.round(ev.score * 100)}%
                                  </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 italic">&ldquo;{ev.text}&rdquo;</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-400 italic">No direct context chunks matched.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Document</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to delete this document from the system?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDocument(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

