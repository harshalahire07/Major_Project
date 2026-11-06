import Link from "next/link";

const cols = [
  {
    heading: "Product",
    links: [
      ["Workbench", "/workbench"],
      ["API", "/api"],
      ["Pricing", "/pricing"],
      ["Changelog", "/changelog"],
    ],
  },
  {
    heading: "Learn",
    links: [
      ["How it works", "/#how"],
      ["Why VeriDoc", "/#why"],
      ["Documentation", "/docs"],
      ["Blog", "/blog"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About", "/about"],
      ["Careers", "/careers"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #f4f4f5", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: "#0a0a0a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5L7 1Z" fill="white" fillOpacity="0.85"/>
                  <path d="M4.5 7L6 8.5L9.5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a" }}>VeriDoc</span>
            </Link>
            <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.65, maxWidth: 200 }}>
              Every AI claim traced to its source document.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#a1a1aa", marginBottom: 16 }}>
                {heading}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{ fontSize: 14, color: "#71717a", textDecoration: "none" }}
                      onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = "#0a0a0a"; }}
                      onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = "#71717a"; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid #f4f4f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "#a1a1aa" }}>© 2026 VeriDoc, Inc.</p>
          <p style={{ fontSize: 13, color: "#d4d4d8" }}>
            Deterministic grounding for documents that matter.
          </p>
        </div>
      </div>
    </footer>
  );
}
