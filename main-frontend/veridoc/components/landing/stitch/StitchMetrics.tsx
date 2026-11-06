"use client";

import React from "react";

export default function StitchMetrics() {
  const metrics = [
    {
      value: "99.4%",
      label: "FACTUAL GROUNDING RATE",
      desc: "Across 1,200 complex enterprise research queries on real multi-domain PDFs.",
      color: "text-blue-600",
    },
    {
      value: "0.0%",
      label: "UNDETECTED CONTRADICTIONS",
      desc: "Zero unflagged factual hallucinations passed through into downstream answers.",
      color: "text-emerald-600",
    },
    {
      value: "180ms",
      label: "AVERAGE CLAIM VERIFICATION",
      desc: "Sub-second cross-encoder inference for parallelized atomic proposition evaluation.",
      color: "text-neutral-900",
    },
    {
      value: "-84%",
      label: "REDUCTION IN MANUAL AUDIT",
      desc: "Eliminates tedious manual citation verification for compliance and research teams.",
      color: "text-blue-600",
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-2">
              <div className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${m.color}`}>
                {m.value}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 font-mono">
                {m.label}
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

