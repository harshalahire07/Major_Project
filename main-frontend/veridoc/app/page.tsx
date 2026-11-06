"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ProductDemo from "@/components/marketing/ProductDemo";
import AppScreenshot from "@/components/marketing/AppScreenshot";

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ background: "#fff" }}>
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        className="bg-gradient-hero"
        style={{ padding: "80px 0 0", overflow: "hidden" }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>

          {/* Eyebrow + headline + CTA */}
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
            <div
              className="anim-fade-in badge badge-indigo"
              style={{ marginBottom: 24 }}
            >
              <span className="live-dot" />
              AI Document Verification · Free to try
            </div>

            <h1 className="hero-title anim-fade-up" style={{ marginBottom: 22 }}>
              Stop trusting AI answers.{" "}
              <span className="accent-word">Start verifying them.</span>
            </h1>

            <p
              className="anim-fade-up d200"
              style={{
                fontSize: 19,
                color: "var(--gray-500)",
                lineHeight: 1.68,
                marginBottom: 36,
                maxWidth: 600,
                margin: "0 auto 36px",
              }}
            >
              VeriDoc traces every claim in an AI answer back to the exact
              sentence, page, and character offset in your source document.
              One fact at a time.
            </p>

            <div
              className="anim-fade-up d300"
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/workbench" className="btn btn-primary" style={{ fontSize: 16, padding: "13px 28px" }}>
                Open the workbench →
              </Link>
              <Link href="#how" className="btn btn-secondary" style={{ fontSize: 16, padding: "13px 28px" }}>
                See how it works
              </Link>
            </div>

            {/* Trust line */}
            <p
              className="anim-fade-up d400"
              style={{ marginTop: 22, fontSize: 13, color: "var(--gray-400)" }}
            >
              No sign-up required · Works in your browser · Free for documents under 20 pages
            </p>
          </div>

          {/* Product screenshot — full width, elevated */}
          <div
            className="anim-fade-up d500"
            style={{ marginTop: 52, position: "relative" }}
          >
            {/* Glow behind screenshot */}
            <div
              style={{
                position: "absolute",
                inset: "40px -20px -20px",
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <AppScreenshot />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS STRIP ══════════════════ */}
      <section
        style={{
          borderTop: "1px solid var(--gray-100)",
          borderBottom: "1px solid var(--gray-100)",
          background: "#fff",
          padding: "40px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 28px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
        >
          {[
            { val: "99.7%", label: "Claim accuracy rate", note: "vs. source text" },
            { val: "<2s", label: "Average per document", note: "most documents" },
            { val: "50+", label: "File formats supported", note: "PDF, DOCX, TXT…" },
            { val: "10k+", label: "Documents verified", note: "and growing" },
          ].map(({ val, label, note }, i) => (
            <div
              key={val}
              className="reveal"
              style={{
                textAlign: "center",
                padding: "0 24px",
                borderRight: i < 3 ? "1px solid var(--gray-100)" : "none",
              }}
            >
              <p className="stat-number indigo">{val}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-700)", marginTop: 6 }}>{label}</p>
              <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 2 }}>{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ PROBLEM ══════════════════ */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            {/* Left: big claim */}
            <div className="reveal">
              <span className="eyebrow">The problem</span>
              <h2 className="section-title" style={{ marginBottom: 20 }}>
                AI answers sound certain.
                <br />
                <span style={{ color: "var(--gray-400)", fontWeight: 700 }}>
                  They shouldn't.
                </span>
              </h2>
              <p style={{ fontSize: 16, color: "var(--gray-500)", lineHeight: 1.75, marginBottom: 28 }}>
                Language models state errors confidently. The numbers look
                right. The sentences read naturally. The mistake hides in plain
                sight — until a contract is signed with the wrong liability cap,
                or a drug dosage is misquoted, or a compliance clause goes
                unchecked.
              </p>
              <div
                style={{
                  background: "var(--indigo-light)",
                  border: "1px solid var(--indigo-mid)",
                  borderRadius: 12,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "start",
                  gap: 14,
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>⚠️</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--indigo)", marginBottom: 4 }}>
                    Real impact
                  </p>
                  <p style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.65 }}>
                    A USD 3,000,000 liability cap discrepancy. A 30-day vs 45-day
                    termination clause. A compliance requirement that doesn't exist
                    in the document. These are the errors VeriDoc was built to catch.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: comparison table */}
            <div className="reveal d200">
              <div
                style={{
                  border: "1px solid var(--gray-200)",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 1fr",
                    background: "var(--gray-50)",
                    borderBottom: "1px solid var(--gray-200)",
                    padding: "10px 0",
                  }}
                >
                  {["Clause", "AI said", "Document says"].map((h) => (
                    <div
                      key={h}
                      style={{
                        padding: "0 18px",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: "var(--gray-400)",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {[
                  {
                    field: "Liability cap",
                    ai: "USD 5,000,000",
                    doc: "USD 2,000,000",
                    bad: true,
                  },
                  {
                    field: "Notice period",
                    ai: "30 days",
                    doc: "45 days",
                    bad: true,
                  },
                  {
                    field: "SOC 2 required",
                    ai: "Yes, mandatory",
                    doc: "Not mentioned",
                    bad: true,
                  },
                  {
                    field: "Governing law",
                    ai: "England & Wales",
                    doc: "England & Wales",
                    bad: false,
                  },
                ].map(({ field, ai, doc, bad }, i, arr) => (
                  <div
                    key={field}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr 1fr",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--gray-100)" : "none",
                      background: bad ? "rgba(220,38,38,0.02)" : "rgba(22,163,74,0.02)",
                    }}
                  >
                    <div style={{ padding: "14px 18px", fontSize: 13, color: "var(--gray-600)", fontWeight: 500 }}>
                      {field}
                    </div>
                    <div style={{ padding: "14px 18px" }}>
                      <span
                        className={bad ? "badge badge-red" : "badge badge-green"}
                        style={{ fontSize: 12 }}
                      >
                        {bad ? "✗" : "✓"} {ai}
                      </span>
                    </div>
                    <div style={{ padding: "14px 18px" }}>
                      <span
                        className="badge badge-green"
                        style={{ fontSize: 12 }}
                      >
                        ✓ {doc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: "var(--gray-400)", textAlign: "center" }}>
                All errors above were caught and corrected by VeriDoc
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section
        id="how"
        style={{
          padding: "96px 0",
          background: "var(--gray-50)",
          borderTop: "1px solid var(--gray-100)",
          borderBottom: "1px solid var(--gray-100)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }} className="reveal">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title" style={{ maxWidth: 520, margin: "0 auto" }}>
              Four steps. Zero guesswork.
            </h2>
          </div>

          {/* Steps grid — 2×2 with icon cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
              marginBottom: 60,
            }}
          >
            {[
              {
                num: "01",
                emoji: "📄",
                title: "Index",
                body: "Every character in your document is assigned a precise page number and byte offset. The source becomes a permanent, queryable map.",
                code: `char[78..82] = "USD 2" · page 1\nchar[83..90] = ",000,00" · page 1`,
                color: "#eff6ff",
                border: "#bfdbfe",
                accent: "#2563eb",
              },
              {
                num: "02",
                emoji: "⚡",
                title: "Decompose",
                body: "The AI answer is atomised into individual claims. Each claim states exactly one checkable fact — no compound assertions.",
                code: `claim_1: "liability capped at USD 5M"\nclaim_2: "notice period is 30 days"\nclaim_3: "governed by English law"`,
                color: "#faf5ff",
                border: "#e9d5ff",
                accent: "#7c3aed",
              },
              {
                num: "03",
                emoji: "🔍",
                title: "Verify",
                body: "Each claim is matched against the index using exact substring search, not fuzzy similarity. Supported, Contradicted, or No Evidence.",
                code: `claim_1 → CONTRADICTED · USD 2,000,000 · p1:78–129\nclaim_2 → CONTRADICTED · 45 days · p1:201–253\nclaim_3 → SUPPORTED · p3:44–104`,
                color: "#fff7ed",
                border: "#fed7aa",
                accent: "#ea580c",
              },
              {
                num: "04",
                emoji: "✅",
                title: "Repair",
                body: "Contradicted claims are rewritten with the exact source text. Ungrounded claims are removed entirely. Every change is cited.",
                code: `"liability capped at USD 2,000,000"\n↳ cited: page 1 · chars 78–129\n"notice period is 45 days"\n↳ cited: page 1 · chars 201–253`,
                color: "#f0fdf4",
                border: "#bbf7d0",
                accent: "#16a34a",
              },
            ].map(({ num, emoji, title, body, code, color, border, accent }, i) => (
              <div
                key={num}
                className={`reveal card${i > 0 ? ` d${i}00` : ""}`}
                style={{ background: color, borderColor: border }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span
                    style={{
                      fontSize: 22,
                      background: "#fff",
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {emoji}
                  </span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                      Step {num}
                    </p>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
                      {title}
                    </h3>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.7, marginBottom: 16 }}>
                  {body}
                </p>
                <pre
                  style={{
                    fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                    fontSize: 11.5,
                    background: "#fff",
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    padding: "12px 14px",
                    color: accent,
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {code}
                </pre>
              </div>
            ))}
          </div>

          {/* Live demo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div className="reveal">
              <span className="eyebrow">Live demo</span>
              <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-900)", marginBottom: 14 }}>
                Watch it verify a contract claim in real time.
              </h3>
              <p style={{ fontSize: 15, color: "var(--gray-500)", lineHeight: 1.7 }}>
                Paste any document and any AI answer. VeriDoc indexes, decomposes,
                verifies, and repairs in seconds — with exact citations.
              </p>
              <div style={{ marginTop: 24 }}>
                <Link href="/workbench" className="btn btn-primary">
                  Try it on your document →
                </Link>
              </div>
            </div>
            <div className="reveal d200">
              <ProductDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY DETERMINISTIC ══════════════════ */}
      <section
        id="why"
        style={{ padding: "96px 0", background: "#fff" }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ marginBottom: 52 }}>
            <span className="eyebrow">Why VeriDoc</span>
            <h2 className="section-title" style={{ maxWidth: 600, marginBottom: 16 }}>
              "Close in meaning" is not good enough for a liability cap.
            </h2>
            <p style={{ fontSize: 16, color: "var(--gray-500)", lineHeight: 1.7, maxWidth: 560 }}>
              Vector similarity is fast and convenient. It is also unreliable for
              anything where precision matters. Here's the difference.
            </p>
          </div>

          <div
            className="reveal d100"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: "1px solid var(--gray-200)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            {/* Left — bad */}
            <div style={{ padding: 36, borderRight: "1px solid var(--gray-100)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✗</div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--red)" }}>RAG / Vector Similarity</p>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Returns passages near the claim — may include the wrong clause",
                  "Citations point at a chunk boundary, not a sentence",
                  "Cannot prove the exact quoted text is in the document",
                  "Silently smooths over missing evidence",
                  "Hallucinations pass undetected without manual review",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--gray-500)", lineHeight: 1.55 }}>
                    <span style={{ color: "var(--red)", flexShrink: 0, fontWeight: 700, marginTop: 1 }}>×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — good */}
            <div style={{ padding: 36, background: "var(--green-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✓</div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--green)" }}>VeriDoc Deterministic Grounding</p>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Every quote is a literal substring at a known page and offset",
                  "Citations name the exact page, paragraph, and character range",
                  "Ungrounded claims are rejected, never smoothed over",
                  "Repaired answers are fully reproducible and machine-verifiable",
                  "Complete audit log: every decision explained and cited",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--gray-700)", lineHeight: 1.55 }}>
                    <span style={{ color: "var(--green)", flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ USE CASES ══════════════════ */}
      <section
        style={{
          padding: "96px 0",
          background: "var(--gray-50)",
          borderTop: "1px solid var(--gray-100)",
          borderBottom: "1px solid var(--gray-100)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ marginBottom: 52 }}>
            <span className="eyebrow">Use cases</span>
            <h2 className="section-title">
              Built for high-stakes documents.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                icon: "📜",
                title: "Legal Contracts",
                body: "Catch liability caps, notice periods, IP ownership, and indemnity clauses before they're signed.",
                tag: "Most common",
              },
              {
                icon: "🏦",
                title: "Financial Reports",
                body: "Verify earnings summaries, forecast claims, and regulatory disclosures against the source filing.",
                tag: null,
              },
              {
                icon: "🏥",
                title: "Clinical Documentation",
                body: "Ensure drug dosages, contraindications, and diagnosis summaries match patient records exactly.",
                tag: null,
              },
              {
                icon: "📋",
                title: "Regulatory Filings",
                body: "Trace every compliance citation back to its exact policy clause, with page and offset proof.",
                tag: null,
              },
              {
                icon: "🤝",
                title: "M&A Due Diligence",
                body: "Verify representations, warranties, and disclosure schedules across hundreds of documents fast.",
                tag: null,
              },
              {
                icon: "🔬",
                title: "Research & Reports",
                body: "Validate that AI-generated summaries accurately represent study findings, stats, and methods.",
                tag: null,
              },
            ].map(({ icon, title, body, tag }, i) => (
              <div
                key={title}
                className={`reveal card${i > 0 ? ` d${Math.min(i, 3) * 100}` : ""}`}
                style={{ position: "relative" }}
              >
                {tag && (
                  <div
                    className="badge badge-indigo"
                    style={{ position: "absolute", top: 20, right: 20, fontSize: 11 }}
                  >
                    {tag}
                  </div>
                )}
                <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--gray-900)",
                    marginBottom: 8,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--gray-500)", lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ QUOTES ══════════════════ */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ marginBottom: 52 }}>
            <span className="eyebrow">In their words</span>
            <h2 className="section-title">Teams who can't afford to be wrong.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                quote:
                  "VeriDoc caught a liability cap error worth USD 3 million that our whole team had missed. The character-level citations made it defensible in court.",
                name: "General Counsel",
                org: "Fortune 500 Technology Company",
                color: "var(--indigo)",
                bg: "var(--indigo-light)",
              },
              {
                quote:
                  "We run every AI-assisted contract review through VeriDoc before it reaches a partner. It has become non-negotiable in our workflow.",
                name: "Head of Legal Operations",
                org: "Global Law Firm, London",
                color: "var(--green)",
                bg: "var(--green-light)",
              },
              {
                quote:
                  "The difference from RAG-based tools is night and day. We can prove every quote exists in the source. That's what our compliance team requires.",
                name: "Director of Regulatory Affairs",
                org: "Pharmaceutical Company",
                color: "var(--amber)",
                bg: "var(--amber-light)",
              },
            ].map(({ quote, name, org, color, bg }, i) => (
              <div
                key={name}
                className={`reveal card${i > 0 ? ` d${i * 100}` : ""}`}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: bg,
                    border: `1px solid ${bg}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color,
                    fontFamily: "Georgia, serif",
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--gray-700)",
                    lineHeight: 1.72,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    flex: 1,
                    marginBottom: 24,
                  }}
                >
                  {quote}
                </p>
                <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-800)" }}>{name}</p>
                  <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 2 }}>{org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section
        style={{
          padding: "80px 0",
          background: "var(--gray-50)",
          borderTop: "1px solid var(--gray-100)",
          borderBottom: "1px solid var(--gray-100)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ marginBottom: 40 }}>
            <h2 className="section-title">Questions</h2>
          </div>

          <div className="reveal d100">
            {[
              {
                q: "How is VeriDoc different from RAG with citations?",
                a: "RAG retrieves passages semantically similar to a query — not necessarily the same text. VeriDoc checks that every quote is a literal substring of the source at a known character offset. If the exact text isn't in the document, the claim is rejected, not smoothed over.",
              },
              {
                q: "What document formats are supported?",
                a: "PDF, DOCX, TXT, and 50+ formats. You can paste text directly or upload a file. The indexing pipeline preserves exact page numbers and character positions across all formats.",
              },
              {
                q: "Is my data private and secure?",
                a: "Documents are processed in isolated, single-use environments, never used to train models, and never retained after the session. Enterprise customers can deploy VeriDoc on-premises.",
              },
              {
                q: "Can I integrate VeriDoc into my own tools?",
                a: "Yes. VeriDoc has a REST API: POST a document and an AI answer, receive a JSON response with every claim labelled, source-cited, and repaired where possible.",
              },
              {
                q: "How fast is it?",
                a: "Most documents complete in under 2 seconds. Large documents (50+ pages) take up to 8 seconds. The index is computed once per document and cached for subsequent queries.",
              },
            ].map(({ q, a }, i, arr) => (
              <details
                key={q}
                style={{
                  borderTop: "1px solid var(--gray-200)",
                  paddingTop: 20,
                  paddingBottom: i < arr.length - 1 ? 20 : 0,
                  cursor: "pointer",
                }}
              >
                <summary
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--gray-900)",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    userSelect: "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {q}
                  <span style={{ fontSize: 20, color: "var(--gray-300)", marginLeft: 16, flexShrink: 0, fontWeight: 300 }}>
                    +
                  </span>
                </summary>
                <p style={{ fontSize: 15, color: "var(--gray-500)", lineHeight: 1.75, marginTop: 12 }}>{a}</p>
              </details>
            ))}
            <div style={{ borderTop: "1px solid var(--gray-200)", marginTop: 20 }} />
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA — colored ══════════════════ */}
      <section className="bg-indigo-section" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 40 }}>
            <div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                Paste a document.
                <br />
                Paste an AI answer.
                <br />
                See the truth.
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                No sign-up. No credit card. Works in your browser.
                <br />
                Free for documents under 20 pages.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
              <Link
                href="/workbench"
                className="btn btn-white"
                style={{ fontSize: 16, padding: "14px 32px", whiteSpace: "nowrap" }}
              >
                Open the workbench →
              </Link>
              <Link
                href="/#how"
                className="btn btn-white-outline"
                style={{ fontSize: 15, padding: "12px 32px", textAlign: "center" as const }}
              >
                Learn how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
