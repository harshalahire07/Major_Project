import type { Claim, Document, Verification } from "@/types";
const text = "Section 4.2 Liability. The Supplier's aggregate liability under this Agreement shall not exceed USD 2,000,000 in any contract year. Section 7.1 Payment. The Customer shall pay each undisputed invoice within 45 days of receipt. Section 9.3 Security. The Supplier shall maintain ISO 27001 certification throughout the term.";
const q = (s: string) => { const i = text.indexOf(s); return { sourceQuote: s, startOffset: i, endOffset: i + s.length, page: i < 130 ? 1 : 2 }; };
export const documents: Document[] = [{ id: "msa-2024", name: "Master Services Agreement.pdf", type: "PDF", pages: 2, text, status: "Needs attention" }];
const claims: Claim[] = [
 { id: "c1", text: "The Supplier's liability is capped at USD 5,000,000.", status: "contradicted", confidence: 0.97, repairedText: "The Supplier's liability is capped at USD 2,000,000.", ...q("shall not exceed USD 2,000,000 in any contract year") },
 { id: "c2", text: "The Customer must pay invoices within 30 days.", status: "contradicted", confidence: 0.95, repairedText: "The Customer must pay invoices within 45 days.", ...q("within 45 days of receipt") },
 { id: "c3", text: "The Supplier maintains ISO 27001 certification.", status: "supported", confidence: 0.99, repairedText: null, ...q("shall maintain ISO 27001 certification") },
 { id: "c4", text: "The Supplier must also hold SOC 2 certification.", status: "no_evidence", confidence: 0.91, repairedText: null },
];
export const verifications: Verification[] = [{ id: "v1", documentId: "msa-2024", claims, answer: claims.map(c => c.text).join(" ") }];
