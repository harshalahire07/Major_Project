"use client";
import { useMemo, useState } from "react";
import { Copy, X } from "lucide-react";
import ClaimBadge from "@/components/ClaimBadge";
import { documents, verifications } from "@/lib/mock";
import { summarize } from "@/lib/api";
import type { ClaimStatus } from "@/types";
const doc = documents[0], ver = verifications[0];
const filters: (ClaimStatus | "all")[] = ["all", "supported", "contradicted", "no_evidence"];
export default function Workbench() {
  const [sel, setSel] = useState(ver.claims[0].id);
  const [tab, setTab] = useState<"original" | "repaired">("original");
  const [filter, setFilter] = useState<ClaimStatus | "all">("all");
  const [mobile, setMobile] = useState<"source" | "answer">("answer");
  const r = summarize(ver);
  const claim = ver.claims.find(c => c.id === sel)!;
  const shown = ver.claims.filter(c => filter === "all" || c.status === filter);
  const repaired = ver.claims.filter(c => c.status !== "no_evidence").map(c => c.repairedText ?? c.text);
  const pre = doc.text.slice(0, claim.startOffset ?? 0), hit = claim.sourceQuote ?? "", post = doc.text.slice(claim.endOffset ?? 0);
  const refMark = (el: HTMLElement | null) => el?.scrollIntoView({ block: "center", behavior: "smooth" });
  const bar = useMemo(() => [["bg-ok", r.supported], ["bg-bad", r.contradicted], ["bg-warn", r.noEvidence]] as const, [r]);
  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-line bg-surface p-5">
        <div><p className="text-xs font-semibold tracking-wider text-mute">VERIFICATION SCORE</p><p className="font-serif text-5xl">{r.score}%</p><p className="text-sm text-mute">{r.supported} of {r.total} claims supported</p></div>
        <div className="min-w-[240px] flex-1 sm:max-w-md"><div className="flex h-2 overflow-hidden rounded-full bg-sunken" role="img" aria-label={`${r.supported} supported, ${r.contradicted} contradicted, ${r.noEvidence} no evidence`}>{bar.map(([c, n]) => <div key={c} className={c} style={{ width: `${(n / r.total) * 100}%` }} />)}</div>
          <p className="mt-2 text-xs text-mute">✓ {r.supported} supported · × {r.contradicted} contradicted · — {r.noEvidence} no evidence</p></div>
      </div>
      <div role="tablist" className="mb-3 flex gap-2 lg:hidden">{(["source", "answer"] as const).map(t => <button key={t} role="tab" aria-selected={mobile === t} onClick={() => setMobile(t)} className={`rounded-md px-3 py-1.5 text-sm capitalize ${mobile === t ? "bg-brand text-white dark:text-bg" : "bg-sunken text-mute"}`}>{t}</button>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-label="Source document" className={`rounded-lg border border-line bg-surface p-6 ${mobile === "answer" ? "hidden lg:block" : ""}`}>
          <p className="text-xs font-semibold tracking-wider text-mute">SOURCE DOCUMENT · {doc.name}</p>
          <p className="mt-4 font-serif text-lg leading-8">{pre}{hit && <mark ref={refMark} key={claim.id} className={`ev ${claim.status === "contradicted" ? "bad" : ""}`}>{hit}</mark>}{post}</p>
        </section>
        <section aria-label="Answer verification" className={mobile === "source" ? "hidden lg:block" : ""}>
          <div className="mb-3 flex items-center justify-between"><div role="tablist" className="flex rounded-md bg-sunken p-0.5 text-sm">{(["original", "repaired"] as const).map(t => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded px-3 py-1 capitalize ${tab === t ? "bg-surface shadow-sm" : "text-mute"}`}>{t}</button>)}</div>
            {tab === "repaired" && <button onClick={() => navigator.clipboard.writeText(repaired.join(" "))} className="flex items-center gap-1.5 text-sm text-brand"><Copy size={14} />Copy repaired answer</button>}</div>
          {tab === "repaired" ? <div className="rounded-lg border border-line bg-surface p-6 font-serif text-lg leading-8">{repaired.join(" ")}<p className="mt-3 font-sans text-xs text-mute">Unsupported claims removed. Fixes cited to the source.</p></div> : <>
            <div className="mb-3 flex gap-2 overflow-x-auto" role="group" aria-label="Filter claims">{filters.map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs capitalize ${filter === f ? "border-brand bg-brand text-white dark:text-bg" : "border-line text-mute"}`}>{f.replace("_", " ")}</button>)}</div>
            <ul className="space-y-2">{shown.map(c => <li key={c.id}><button onClick={() => setSel(c.id)} aria-current={sel === c.id} className={`w-full rounded-lg border bg-surface p-4 text-left ${sel === c.id ? "border-brand ring-1 ring-brand" : "border-line"}`}><ClaimBadge status={c.status} /><p className="mt-2 font-serif">{c.text}</p></button></li>)}</ul></>}
          {tab === "original" && <aside aria-label="Claim inspector" className="mt-4 rounded-lg border border-line bg-sunken p-5 text-sm">
            <div className="flex justify-between"><p className="text-xs font-semibold tracking-wider text-mute">CLAIM INSPECTOR</p><ClaimBadge status={claim.status} /></div>
            <p className="mt-2 font-serif text-base">{claim.text}</p>
            {claim.sourceQuote ? <><p className="mt-3 text-xs font-semibold tracking-wider text-mute">SOURCE EVIDENCE</p><p className="font-serif">“{claim.sourceQuote}”</p><p className="text-xs text-mute">Page {claim.page} · characters {claim.startOffset}–{claim.endOffset}</p></> : <p className="mt-3 text-mute">No passage in the source supports or contradicts this claim. It is removed from the repaired answer.</p>}
            <p className="mt-3 text-xs text-mute">Confidence {claim.confidence.toFixed(2)}</p>
            {claim.repairedText && <><p className="mt-3 text-xs font-semibold tracking-wider text-mute">REPAIRED VERSION</p><p className="font-serif text-ok">{claim.repairedText}</p></>}
            {claim.sourceQuote && <button onClick={() => { setMobile("source"); document.querySelector("mark.ev")?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="mt-3 text-brand">Open in document</button>}
          </aside>}
        </section>
      </div>
    </div>
  );
}
