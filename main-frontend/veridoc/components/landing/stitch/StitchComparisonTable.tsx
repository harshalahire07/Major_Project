"use client";

import React from "react";
import { Check, X, AlertTriangle, ShieldCheck } from "lucide-react";

export default function StitchComparisonTable() {
  const rows = [
    {
      criteria: "Hallucination Handling",
      standard: {
        status: "bad",
        title: "Blind generation.",
        desc: "Plausible hallucinations pass to end-user undetected without verification.",
      },
      verity: {
        status: "good",
        title: "Deterministic verification.",
        desc: "Every atomic proposition verified against source chunks before generation completes.",
      },
    },
    {
      criteria: "Citation Fidelity",
      standard: {
        status: "warn",
        title: "Superficial links.",
        desc: "Points vaguely to entire multi-page documents or broad chunks without precision.",
      },
      verity: {
        status: "good",
        title: "Sub-paragraph bounding.",
        desc: "Exact sentence-by-sentence tracking with character-span proof and page numbers.",
      },
    },
    {
      criteria: "Automated Repair Loop",
      standard: {
        status: "bad",
        title: "None.",
        desc: "The system makes blind guesses when encountering contradictory statements.",
      },
      verity: {
        status: "good",
        title: "Synthetic Error-Repair Engine.",
        desc: "Automatically corrects invalid clauses using verified document context.",
      },
    },
    {
      criteria: "Regulatory & Legal Auditability",
      standard: {
        status: "bad",
        title: "Zero cryptographic proof.",
        desc: "Non-deterministic black box responses unsuitable for compliance audits.",
      },
      verity: {
        status: "good",
        title: "Immutable SHA-256 Audit Ledger.",
        desc: "Full audit trail compliant for 21 CFR Part 11 and EU AI Act Article 13 mandates.",
      },
    },
  ];

  return (
    <section id="benchmarks" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
          INTERACTIVE BENCHMARK AUDIT
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Why Standard RAG Fails vs. Why Verity Succeeds
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
          Standard enterprise knowledge bots paste semantic search snippets into prompts — Verity
          introduces a mathematical verification barrier prior to token generation.
        </p>
      </div>

      {/* Styled Comparison Table */}
      <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-lg bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/70 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-700">
                <th className="py-4 px-6 w-1/4">Criteria / Architecture Guarantee</th>
                <th className="py-4 px-6 w-3/8 text-rose-900 bg-rose-50/40">
                  Standard RAG (OpenAI / LangChain / Llama)
                </th>
                <th className="py-4 px-6 w-3/8 text-blue-900 bg-blue-100/60 font-extrabold">
                  Verity Evidence-Grounded Architecture
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs sm:text-sm">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-neutral-900 align-top">
                    {row.criteria}
                  </td>

                  {/* Standard RAG Column */}
                  <td className="py-5 px-6 bg-rose-50/15 align-top">
                    <div className="flex items-start gap-2.5">
                      {row.standard.status === "bad" ? (
                        <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3 h-3" />
                        </div>
                      )}
                      <div>
                        <strong className="text-neutral-900 block font-semibold mb-0.5">
                          {row.standard.title}
                        </strong>
                        <span className="text-neutral-600 text-xs leading-relaxed">
                          {row.standard.desc}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Verity Column */}
                  <td className="py-5 px-6 bg-blue-50/20 align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <strong className="text-blue-950 block font-semibold mb-0.5">
                          {row.verity.title}
                        </strong>
                        <span className="text-neutral-700 text-xs leading-relaxed">
                          {row.verity.desc}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
