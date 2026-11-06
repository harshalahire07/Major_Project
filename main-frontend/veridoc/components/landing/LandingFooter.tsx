"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Github, ExternalLink } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              </div>
              <span className="font-semibold text-base text-neutral-900 dark:text-white">
                Verity AI
              </span>
            </div>
            <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
              An Evidence-Grounded AI System for Document Question Answering, Hallucination
              Detection, and Claim-Level Repair. Built with FastAPI, PyMuPDF, FAISS, Ollama Qwen 2.5,
              and DeBERTa-v3 NLI.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <span className="font-semibold text-neutral-900 dark:text-white text-xs uppercase tracking-wider block">
              Application
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/workspace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Document Workspace
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Document Repository
                </Link>
              </li>
              <li>
                <Link href="/claims" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Claim Verification
                </Link>
              </li>
              <li>
                <Link href="/comparison" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Answer Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Links */}
          <div className="space-y-3">
            <span className="font-semibold text-neutral-900 dark:text-white text-xs uppercase tracking-wider block">
              Research & Dev
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/evaluation" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Phase 2 Evaluation
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  System Settings
                </Link>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  FastAPI OpenAPI Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/harshalahire07/Major_Project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  GitHub Source <Github className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Verity AI Research Project. All rights reserved.</p>
          <p>Evidence-grounded hallucination detection and claim repair.</p>
        </div>
      </div>
    </footer>
  );
}

