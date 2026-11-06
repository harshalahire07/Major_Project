import { documents, verifications } from "./mock";
import type { Document, Verification, VerificationResult } from "@/types";
const wait = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 150));
export const getDocuments = () => wait(documents);
export const getDocument = (id: string) => wait(documents.find(d => d.id === id) ?? null);
export const createDocument = (name: string) => wait<Document>({ id: crypto.randomUUID(), name, type: "TXT", pages: 1, text: "", status: "Processing" });
export const createVerification = (documentId: string, answer: string) => wait<Verification>({ ...verifications[0], documentId, answer });
export const getVerification = (id: string) => wait(verifications.find(v => v.id === id) ?? null);
export const summarize = (v: Verification): VerificationResult => {
  const s = v.claims.filter(c => c.status === "supported").length, c = v.claims.filter(c => c.status === "contradicted").length, n = v.claims.length - s - c;
  return { supported: s, contradicted: c, noEvidence: n, total: v.claims.length, score: Math.round((s / v.claims.length) * 100) };
};
