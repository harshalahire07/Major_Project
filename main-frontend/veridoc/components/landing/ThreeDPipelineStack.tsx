"use client";

import React, { useState } from "react";
import {
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Sliders,
  RotateCw,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function ThreeDPipelineStack() {
  const [spread, setSpread] = useState(70); // Z-separation in pixels
  const [rotX, setRotX] = useState(55); // Isometric X tilt
  const [rotZ, setRotZ] = useState(-35); // Isometric Z rotation
  const [activeLayer, setActiveLayer] = useState<number>(3); // Default to top verification layer
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const layers = [
    {
      id: 0,
      title: "Layer 1: Document Ingestion & Geometry",
      subtitle: "PyMuPDF parsing with token sliding window (500 tokens, 100 overlap)",
      badge: "RAW PDF INGESTION",
      color: "border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200",
      accent: "text-slate-500",
      icon: FileText,
      metrics: "42 chunks • Page-exact provenance • Tiktoken tokenizer",
    },
    {
      id: 1,
      title: "Layer 2: Dense Semantic Vector Space",
      subtitle: "BAAI/bge-small-en-v1.5 embeddings indexed in FAISS-CPU",
      badge: "FAISS VECTOR ENGINE",
      color: "border-sky-300 dark:border-sky-700 bg-white/80 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200",
      accent: "text-sky-500",
      icon: Database,
      metrics: "384-dimensional dense vectors • Sub-millisecond cosine search",
    },
    {
      id: 2,
      title: "Layer 3: Atomic Proposition Parser",
      subtitle: "NLTK proposition isolation breaks complex sentences into atomic claims",
      badge: "CLAIM EXTRACTION",
      color: "border-purple-300 dark:border-purple-700 bg-white/80 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200",
      accent: "text-purple-500",
      icon: Cpu,
      metrics: "Isolates testable factual units • Prevents masked hallucinations",
    },
    {
      id: 3,
      title: "Layer 4: Cross-Encoder NLI & Grounded Repair",
      subtitle: "DeBERTa-v3 NLI verification and iterative context-guided claim repair",
      badge: "VERITY GROUND TRUTH",
      color: "border-emerald-400 dark:border-emerald-600 bg-white/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 shadow-lg",
      accent: "text-emerald-500",
      icon: ShieldCheck,
      metrics: "86.7% Supported • 26.7% Contradiction reduction • 100% Attribution",
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Touch Experience</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Explore the Verification Pipeline in 3D Space
        </h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-base">
          Drag the sliders or select a layer to explode the 3D pipeline stack and inspect how raw
          document text transforms into verified truth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: 3D Touch Viewport Container */}
        <div className="lg:col-span-7 relative h-[440px] sm:h-[500px] flex items-center justify-center rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md overflow-hidden p-6 shadow-inner">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* 3D Scene Stage */}
          <div
            style={{
              perspective: 1100,
              perspectiveOrigin: "50% 50%",
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <div
              style={{
                transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
              className="relative w-64 sm:w-80 h-44 sm:h-52 cursor-grab active:cursor-grabbing"
            >
              {layers.map((layer, idx) => {
                const zOffset = idx * spread;
                const isSelected = activeLayer === idx;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayer(idx)}
                    style={{
                      transform: `translateZ(${zOffset}px)`,
                      transformStyle: "preserve-3d",
                      transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s",
                    }}
                    className={`absolute inset-0 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md transition-all cursor-pointer ${
                      layer.color
                    } ${
                      isSelected
                        ? "shadow-2xl ring-2 ring-emerald-500 scale-[1.04]"
                        : "shadow-md hover:scale-[1.02] opacity-90 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-neutral-900/10 dark:bg-white/10">
                        {layer.badge}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-neutral-900/10 dark:bg-white/10 flex items-center justify-center text-xs font-mono font-bold">
                        L{idx + 1}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-xs sm:text-sm tracking-tight">
                        {layer.title}
                      </h5>
                      <p className="text-[11px] opacity-75 mt-1 line-clamp-1">
                        {layer.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-2 border-t border-black/5 dark:border-white/10">
                      <span className="font-mono">{layer.metrics}</span>
                      {isSelected && (
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Focused
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Quick Floating 3D Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-xs bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2.5 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 flex-1">
              <Sliders className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-[11px] text-neutral-500 hidden sm:inline">3D Layer Separation:</span>
              <input
                type="range"
                min="30"
                max="110"
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
                title="Spread 3D Layers"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setRotX(55);
                  setRotZ(-35);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Reset Angle
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Layer Inspector & Information */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                  {React.createElement(layers[activeLayer].icon, { className: "w-5 h-5 text-emerald-500" })}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block">
                    Active 3D Layer
                  </span>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                    {layers[activeLayer].title}
                  </h4>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800">
                Layer {activeLayer + 1} / 4
              </span>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {layers[activeLayer].subtitle}
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Pipeline Stage:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {layers[activeLayer].badge}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Telemetry:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  {layers[activeLayer].metrics}
                </span>
              </div>
            </div>

            {/* Quick Layer Switcher Pills */}
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Select Layer to Inspect:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {layers.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(i)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                      activeLayer === i
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    L{i + 1}: {l.badge}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

