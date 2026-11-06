export type ClaimStatus = "supported" | "contradicted" | "no_evidence";
export interface Claim { id: string; text: string; status: ClaimStatus; sourceQuote?: string; page?: number; startOffset?: number; endOffset?: number; confidence: number; repairedText?: string | null }
export interface Document { id: string; name: string; type: "PDF"|"DOCX"|"TXT"; pages: number; text: string; status: "Ready"|"Processing"|"Verified"|"Needs attention" }
export interface Verification { id: string; documentId: string; answer: string; claims: Claim[] }
export interface VerificationResult { score: number; supported: number; contradicted: number; noEvidence: number; total: number }
