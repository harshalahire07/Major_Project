"use client";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import ClaimBadge from "@/components/ClaimBadge";

const steps = [
  { id: 0, label: "Indexing document", duration: 1200 },
  { id: 1, label: "Decomposing claims", duration: 1600 },
  { id: 2, label: "Verifying evidence", duration: 1600 },
];

export default function ProductDemo() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step >= steps.length) { setDone(true); return; }
    const t = setTimeout(() => setStep(s => s + 1), steps[step]?.duration ?? 1200);
    return () => clearTimeout(t);
  }, [step]);

  const reset = () => { setStep(0); setDone(false); };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4e4e7",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: "inherit",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
      aria-live="polite"
    >
      {/* Title bar */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fca5a5" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fcd34d" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#86efac" }} />
        </div>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#a1a1aa", fontFamily: "ui-monospace, monospace" }}>
          veridoc.app / verify
        </span>
      </div>

      <div style={{ padding: 20 }}>
        {/* Progress steps */}
        <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          {steps.map(({ id, label }) => {
            const isActive = step === id && !done;
            const isDone = step > id || done;
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: isDone ? "#16a34a" : isActive ? "#0a0a0a" : "#a1a1aa",
                  opacity: id > step && !done ? 0.35 : 1,
                  transition: "all 0.3s",
                }}
              >
                {isDone ? (
                  <span style={{ color: "#16a34a", fontSize: 14, lineHeight: 1 }}>✓</span>
                ) : isActive ? (
                  <span style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    border: "1.5px solid #2563eb",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }} />
                ) : (
                  <span style={{ width: 12, height: 12, border: "1.5px solid #d4d4d8", borderRadius: "50%", display: "inline-block" }} />
                )}
                {label}
                {isDone && <span style={{ marginLeft: "auto", color: "#a1a1aa", fontSize: 11 }}>done</span>}
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f4f4f5", margin: "14px 0" }} />

        {/* Answer block */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#a1a1aa", marginBottom: 8 }}>
            AI Answer
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.65, color: "#0a0a0a" }}>
            The Supplier's liability is capped at{" "}
            <span style={{
              textDecoration: step >= 2 || done ? "line-through" : "none",
              color: step >= 2 || done ? "#dc2626" : "inherit",
              background: step >= 2 || done ? "#fef2f2" : "transparent",
              borderRadius: 3,
              padding: "0 2px",
              transition: "all 0.4s",
            }}>
              USD 5,000,000
            </span>
            {done && (
              <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 4, padding: "1px 6px", marginLeft: 6, fontSize: 13, fontFamily: "inherit" }}>
                USD 2,000,000
              </span>
            )}
            .
          </p>
        </div>

        {/* Verdict */}
        {(step >= 2 || done) && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#a1a1aa" }}>Verdict</span>
              <ClaimBadge status="contradicted" />
            </div>
            <blockquote style={{ borderLeft: "2px solid #16a34a", paddingLeft: 10, margin: 0 }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#3f3f46", lineHeight: 1.6 }}>
                "shall not exceed{" "}
                <mark className="ev" style={{ fontStyle: "normal" }}>USD 2,000,000</mark>
                {" "}in any contract year"
              </p>
              <footer style={{ marginTop: 4, fontSize: 11, color: "#a1a1aa" }}>
                Page 1 · chars 78–129
              </footer>
            </blockquote>
          </div>
        )}

        {/* Repaired */}
        {done && (
          <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
            <span>✓</span> Repaired and cited to page 1
          </p>
        )}

        <button
          onClick={reset}
          style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#a1a1aa", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <RotateCcw size={10} />
          Replay
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
