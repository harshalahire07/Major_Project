"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Github, Moon, Sun, Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("verity_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("verity_theme", "light");
    }
  };

  return (
    <>
      {/* Top Research Announcement Banner */}
      <div className="bg-neutral-900 text-white dark:bg-neutral-950 dark:border-b dark:border-neutral-800 text-xs py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium text-[11px]">
            ✦ Research Benchmark
          </span>
          <span className="text-neutral-300">
            Contradiction rate reduced by <strong>26.7%</strong> via Claim-Level NLI Repair.
          </span>
          <Link
            href="/evaluation"
            className="text-white underline underline-offset-4 hover:text-neutral-200 transition-colors font-medium ml-1 inline-flex items-center gap-1"
          >
            View Evaluation Results <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-white">
                  Verity AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Research
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-none">
                Evidence-Grounded Document QA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#demo" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Live Demo
            </a>
            <a href="#pipeline" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Pipeline
            </a>
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#verification" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Claim Verification
            </a>
            <a href="#benchmarks" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Benchmarks
            </a>
            <a href="#architecture" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Architecture
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://github.com/harshalahire07/Major_Project"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium shadow-sm hover:shadow transition-all hover:scale-[1.02]"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 pt-3 pb-6 space-y-3">
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Live Demo
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Pipeline
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Capabilities
            </a>
            <a
              href="#verification"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Claim Verification
            </a>
            <a
              href="#benchmarks"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Benchmarks
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Architecture
            </a>
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
              <Link
                href="/workspace"
                className="w-full text-center py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium"
              >
                Launch Workspace →
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

