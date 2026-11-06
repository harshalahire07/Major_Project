"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function StitchFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-neutral-900">
                Verity<span className="text-blue-600">AI</span>
              </span>
            </Link>

            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Ask Documents. Verify Answers. Trust Evidence. Research-grade provenance for legal,
              clinical, and high-stakes enterprise workflows.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Systems Operational [99.98%]</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/workspace" className="hover:text-neutral-900 transition-colors">
                  Interactive Workspace
                </Link>
              </li>
              <li>
                <a href="#canvas" className="hover:text-neutral-900 transition-colors">
                  Verification Engine
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-neutral-900 transition-colors">
                  Enterprise Use Cases
                </a>
              </li>
              <li>
                <Link href="/evaluation" className="hover:text-neutral-900 transition-colors">
                  Evaluation Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>API Documentation</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Research & Labs */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
              Research & Labs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/evaluation" className="hover:text-neutral-900 transition-colors">
                  Empirical Benchmark Results
                </Link>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-neutral-900 transition-colors">
                  Multi-Hop Reasoning Graph
                </a>
              </li>
              <li>
                <a href="#canvas" className="hover:text-neutral-900 transition-colors">
                  Synthetic Error-Repair Study
                </a>
              </li>
              <li>
                <Link href="/claims" className="hover:text-neutral-900 transition-colors">
                  Claim Verification Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
              Security & Trust
            </h4>
            <ul className="space-y-2">
              <li className="text-neutral-700">SOC 2 Type II Certified</li>
              <li className="text-neutral-700">ISO 27001 & HIPAA</li>
              <li className="text-neutral-700">21 CFR Part 11 Compliant</li>
              <li className="text-neutral-700">Full On-Premises Option</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Verity AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-neutral-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-600 transition-colors">
              Security Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
