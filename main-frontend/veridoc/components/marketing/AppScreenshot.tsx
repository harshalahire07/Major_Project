export default function AppScreenshot() {
  const claims = [
    { id: 1, text: "The Supplier's liability is capped at USD 2,000,000.", status: "supported", page: 1, chars: "78–129" },
    { id: 2, text: "Either party may terminate on 45 days' written notice.", status: "supported", page: 1, chars: "201–253" },
    { id: 3, text: "The agreement is governed by the laws of England and Wales.", status: "supported", page: 3, chars: "44–104" },
    { id: 4, text: "The Supplier must maintain SOC 2 Type II certification.", status: "contradicted", page: null, chars: null },
    { id: 5, text: "Intellectual property created under this agreement belongs to the Client.", status: "supported", page: 2, chars: "118–190" },
  ];

  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    supported: { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
    contradicted: { bg: "#fef2f2", text: "#dc2626", dot: "#f87171" },
    no_evidence: { bg: "#fafafa", text: "#71717a", dot: "#d4d4d8" },
  };

  const docText = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of January 1, 2025.

1. LIABILITY

The Supplier's aggregate liability under this Agreement shall not exceed USD 2,000,000 in any contract year. This limitation applies to all claims, whether in contract, tort, or otherwise.

2. TERMINATION

Either party may terminate this Agreement on 45 days' written notice to the other party. Termination does not affect accrued rights.

3. INTELLECTUAL PROPERTY

All intellectual property created specifically under this Agreement and paid for by the Client belongs to the Client upon full payment.

4. GOVERNING LAW

This Agreement is governed by the laws of England and Wales. The parties submit to the exclusive jurisdiction of the courts of England and Wales.`;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4e4e7",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        fontFamily: "inherit",
      }}
    >
      {/* App chrome */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#fca5a5", "#fcd34d", "#86efac"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, margin: "0 16px", background: "#f4f4f5", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#71717a", fontFamily: "monospace" }}>
          veridoc.app / workbench
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#a1a1aa" }}>Supply Agreement v3.pdf</span>
          <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, border: "1px solid #bbf7d0" }}>
            Verified
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f4f4f5", padding: "12px 20px", display: "flex", alignItems: "center", gap: 20 }}>
        <div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "#0a0a0a" }}>80%</span>
          <span style={{ fontSize: 12, color: "#71717a", marginLeft: 8 }}>verification score</span>
        </div>
        <div style={{ flex: 1, height: 4, background: "#f4f4f5", borderRadius: 4, overflow: "hidden", display: "flex" }}>
          <div style={{ width: "60%", background: "#22c55e" }} />
          <div style={{ width: "20%", background: "#f87171" }} />
          <div style={{ width: "20%", background: "#d4d4d8" }} />
        </div>
        <div style={{ fontSize: 11, color: "#a1a1aa", whiteSpace: "nowrap" }}>
          4 supported · 1 contradicted
        </div>
      </div>

      {/* Two-panel layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 340 }}>
        {/* Source doc */}
        <div style={{ borderRight: "1px solid #f4f4f5", padding: 20, overflow: "auto" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a1a1aa", marginBottom: 14 }}>
            Source Document
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 12.5, lineHeight: 1.8, color: "#3f3f46", whiteSpace: "pre-line" }}>
            {docText.split("USD 2,000,000").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <mark style={{ background: "#dcfce7", color: "#15803d", boxShadow: "inset 0 -1px #22c55e", borderRadius: 2, padding: "0 1px" }}>
                    USD 2,000,000
                  </mark>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </div>

        {/* Claims list */}
        <div style={{ padding: 20, overflow: "auto" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a1a1aa", marginBottom: 14 }}>
            Verified Claims
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {claims.map(({ id, text, status, page, chars }) => {
              const s = statusColors[status] ?? statusColors.no_evidence;
              return (
                <div
                  key={id}
                  style={{
                    border: "1px solid #f4f4f5",
                    borderRadius: 8,
                    padding: "10px 12px",
                    background: id === 1 ? "#fafafa" : "#fff",
                    outline: id === 1 ? "1.5px solid #2563eb" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: s.text, textTransform: "capitalize" }}>
                      {status.replace("_", " ")}
                    </span>
                    {page && (
                      <span style={{ marginLeft: "auto", fontSize: 10, color: "#a1a1aa", fontFamily: "monospace" }}>
                        p.{page} · {chars}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "#3f3f46", lineHeight: 1.5, margin: 0 }}>{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
