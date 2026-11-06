"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Server,
  Cpu,
  Moon,
  Sun,
  ShieldCheck,
  Check,
  AlertCircle,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function SettingsView() {
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000");
  const [modelName, setModelName] = useState("qwen3-4b-instruct");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [retrievalTopK, setRetrievalTopK] = useState(5);
  const [isDark, setIsDark] = useState(false);

  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setApiUrl(apiClient.getBaseUrl());
    const savedTheme = localStorage.getItem("verity_theme");
    setIsDark(savedTheme === "dark" || document.documentElement.classList.contains("dark"));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient.setBaseUrl(apiUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestingHealth(true);
    setHealthStatus(null);
    try {
      const res = await apiClient.checkHealth();
      if (res && res.status === "healthy") {
        setHealthStatus(`Connected! FastAPI backend v${res.version} is running (${res.environment})`);
      } else {
        setHealthStatus("Backend responded but reported unexpected health status.");
      }
    } catch {
      setHealthStatus("Connection failed. Make sure FastAPI is running on port 8000.");
    } finally {
      setTestingHealth(false);
    }
  };

  const toggleTheme = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("verity_theme", "dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("verity_theme", "light");
      setIsDark(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Preferences & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage backend connection endpoints, LLM inference parameters, and interface themes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend Endpoint Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Backend API Server</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                FastAPI Base Endpoint
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingHealth}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? "animate-spin" : ""}`} />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>

            {healthStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  healthStatus.includes("Connected")
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800"
                }`}
              >
                {healthStatus.includes("Connected") ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{healthStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Model Inference Parameters */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Local LLM & Vector Store</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                LLM Model Runtime
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Ollama Base URL
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Retrieval Top-K Context Chunks
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={retrievalTopK}
                onChange={(e) => setRetrievalTopK(parseInt(e.target.value) || 5)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                NLI Verification Provider
              </label>
              <input
                type="text"
                disabled
                value="cross-encoder/nli-deberta-v3-small"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-mono text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sun className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Workspace Appearance</h3>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => toggleTheme("light")}
              className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                !isDark
                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => toggleTheme("dark")}
              className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                isDark
                  ? "border-indigo-500 bg-indigo-950/40 text-indigo-300 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-800"
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
          <div className="flex-1" />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01]"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
