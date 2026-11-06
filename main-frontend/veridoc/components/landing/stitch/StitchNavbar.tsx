"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Menu, X } from "lucide-react";

export default function StitchNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-neutral-900">
            Verity<span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-neutral-600">
          <a href="#canvas" className="hover:text-neutral-900 transition-colors">
            Platform
          </a>
          <a href="#pipeline" className="hover:text-neutral-900 transition-colors">
            Verification Engine
          </a>
          <a href="#use-cases" className="hover:text-neutral-900 transition-colors">
            Case Studies
          </a>
          <a href="#architecture" className="hover:text-neutral-900 transition-colors">
            Solutions
          </a>
          <a href="#benchmarks" className="hover:text-neutral-900 transition-colors">
            Pricing
          </a>
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors"
          >
            Docs
          </a>
        </nav>

        {/* Right CTA Area */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/workspace"
            className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/workspace"
            className="text-[13px] font-medium text-neutral-700 hover:text-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all shadow-2xs"
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
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-600 hover:text-neutral-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 bg-white px-4 py-4 space-y-3">
          <a
            href="#canvas"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700"
          >
            Platform
          </a>
          <a
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700"
          >
            Verification Engine
          </a>
          <a
            href="#use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700"
          >
            Case Studies
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700"
          >
            Solutions
          </a>
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <Link
              href="/workspace"
              className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

