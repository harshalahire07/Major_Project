"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";

export default function StitchCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/workspace?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-blue-50/60 border border-blue-100 p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>ENTERPRISE EVALUATION SUITE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight max-w-2xl mx-auto">
          Ready to eliminate hallucinations from your enterprise knowledge workflows?
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Deploy Verity AI on-premise or behind your VPC. Process your first 10 documents in under 60
          seconds with full provenance and automated repair.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your enterprise email..."
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
          />
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all shrink-0"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            SOC 2 Type II Certified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            HIPAA & GDPR Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Full Local On-Premises Option
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            14-Day Pilot • No Credit Card
          </span>
        </div>
      </div>
    </section>
  );
}
