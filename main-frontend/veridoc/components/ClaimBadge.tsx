import { Check, X, Minus } from "lucide-react";
import type { ClaimStatus } from "@/types";
const m = { supported: ["Supported", Check, "bg-okbg text-ok"], contradicted: ["Contradicted", X, "bg-badbg text-bad"], no_evidence: ["No evidence", Minus, "bg-warnbg text-warn"] } as const;
export default function ClaimBadge({ status }: { status: ClaimStatus }) {
  const [label, Icon, cls] = m[status];
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${cls}`}><Icon size={12} aria-hidden />{label}</span>;
}
