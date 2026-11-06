"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  ["Product", "/#demo"],
  ["How it works", "/#how"],
  ["Why VeriDoc", "/#why"],
  ["Docs", "/docs"],
  ["Pricing", "/pricing"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.96)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid #f4f4f5",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "#0a0a0a",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5L7 1Z" fill="white" fillOpacity="0.85"/>
              <path d="M4.5 7L6 8.5L9.5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
            VeriDoc
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: 14,
                color: "#71717a",
                padding: "6px 12px",
                borderRadius: 6,
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#0a0a0a";
                (e.target as HTMLAnchorElement).style.background = "#f4f4f5";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#71717a";
                (e.target as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/sign-in"
            style={{ fontSize: 14, color: "#71717a", padding: "6px 12px", borderRadius: 6, textDecoration: "none" }}
            onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = "#0a0a0a"; }}
            onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = "#71717a"; }}
          >
            Sign in
          </Link>
          <Link
            href="/workbench"
            className="btn btn-dark"
            style={{ fontSize: 13, padding: "7px 16px", borderRadius: 7 }}
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Mobile */}
      {open && (
        <div style={{ borderTop: "1px solid #f4f4f5", background: "#fff", padding: "12px 24px 20px" }}>
          {[...links, ["Sign in", "/sign-in"], ["Get started", "/workbench"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "10px 0", fontSize: 15, color: "#3f3f46", textDecoration: "none", borderBottom: "1px solid #f9f9f9" }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
