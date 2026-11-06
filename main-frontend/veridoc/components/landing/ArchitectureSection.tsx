"use client";

import React from "react";
import { Cpu, Database, Server, Code, Check, Terminal } from "lucide-react";

export default function ArchitectureSection() {
  const stack = [
    {
      category: "Document Parsing & Indexing",
      icon: Database,
      items: [
        { name: "PyMuPDF (fitz)", role: "PDF parsing with exact page bounding" },
        { name: "tiktoken (cl100k_base)", role: "Sliding window tokenization (500 tokens, 100 overlap)" },
        { name: "BAAI/bge-small-en-v1.5", role: "Dense 384-d semantic embedding vectors" },
        { name: "FAISS-CPU", role: "Sub-millisecond cosine & L2 similarity search" },
      ],
    },
    {
      category: "Inference & Natural Language Processing",
      icon: Cpu,
      items: [
        { name: "Qwen 2.5 (7B-Instruct)", role: "Local synthesis via Ollama (zero API telemetry)" },
        { name: "NLTK Sentence Tokenizer", role: "Atomic proposition and claim isolation" },
        { name: "DeBERTa-v3-base (Cross-Encoder)", role: "NLI entailment, contradiction, & neutral scoring" },
        { name: "Context-Conditioned Repair", role: "Iterative hallucination correction loop" },
      ],
    },
    {
      category: "Backend & Systems Infrastructure",
      icon: Server,
      items: [
        { name: "FastAPI & Uvicorn", role: "High-throughput asynchronous REST endpoints" },
        { name: "Pydantic v2 & Settings", role: "Strict schema validation and type safety" },
        { name: "PyTorch & Transformers", role: "Hardware-accelerated tensor computation" },
        { name: "pytest & asyncio test harness", role: "117 unit, integration, and paired benchmarks" },
      ],
    },
    {
      category: "Frontend Experience",
      icon: Code,
      items: [
        { name: "Next.js 15 (App Router)", role: "Server-side rendering & static route optimization" },
        { name: "React 19 & Hooks", role: "Reactive state and interactive citation drawers" },
        { name: "Tailwind CSS v4", role: "Minimalist Google NotebookLM inspired design system" },
        { name: "Lucide React", role: "Crisp, lightweight semantic iconography" },
      ],
    },
  ];

  return (
    <section id="architecture" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-3">
          Technical Specifications
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Under the Hood of Verity AI
        </h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
          Built from the ground up as a production-grade research pipeline combining state-of-the-art
          vector search, local language models, and natural language inference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stack.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-neutral-900 dark:text-white text-base">
                  {group.category}
                </h4>
              </div>

              <div className="space-y-3">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/80 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="font-mono font-semibold text-neutral-900 dark:text-white block">
                        {item.name}
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                        {item.role}
                      </span>
                    </div>
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

