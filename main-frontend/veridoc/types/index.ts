export type VerificationStatus = "SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE" | "REPAIRED";

export type RepairStatus = "NOT_REQUIRED" | "REPAIRED" | "FAILED" | "FLAGGED";

export interface RetrievalResultItem {
  chunk_id: string;
  document_id: string;
  page_number: number;
  text: string;
  score: number;
}

export interface VerificationResult {
  claim_id: string;
  claim_text: string;
  status: "SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE";
  entailment_score?: number | null;
  contradiction_score?: number | null;
  neutral_score?: number | null;
  evidence: RetrievalResultItem[];
  model_name: string;
}

export interface RepairAttempt {
  iteration: number;
  original_claim_text: string;
  repaired_claim_text: string;
  verification_after_repair: VerificationResult;
}

export interface FinalClaimState {
  claim_id: string;
  claim_order: number;
  original_claim_text: string;
  current_claim_text: string;
  original_verification_result: VerificationResult;
  repair_history: RepairAttempt[];
  final_verification_result: VerificationResult;
  repair_status: RepairStatus;
}

export interface QueryResponse {
  query_id: string;
  mode: "baseline" | "full";
  question: string;
  draft_answer: string;
  final_answer?: string | null;
  claims?: FinalClaimState[] | null;
  used_chunk_ids: string[];
  model_name: string;
}

export interface PageSummary {
  page_number: number;
  text_length: number;
}

export interface DocumentSummary {
  id: string;
  title: string;
  filename: string;
  page_count: number;
  status: string;
  created_at: string;
}

export interface DocumentDetail extends DocumentSummary {
  pages: PageSummary[];
}

export interface DocumentListResponse {
  items: DocumentSummary[];
  total: number;
  offset: number;
  limit: number;
}

export interface EvaluationMetrics {
  total_paired_questions: number;
  total_claims_evaluated: number;
  baseline_contradicted_claims: number;
  full_contradicted_claims: number;
  contradiction_reduction_pct: number;
  baseline_unsupported_claims: number;
  full_unsupported_claims: number;
  total_repair_opportunities: number;
  successful_repairs: number;
  repair_success_pct: number;
  collateral_damage_observations: number;
  avg_latency_baseline_sec: number;
  avg_latency_full_sec: number;
  added_latency_overhead_sec: number;
}

export interface EvaluationSummaryItem {
  question_id: string;
  category: string;
  baseline_latency: number;
  full_latency: number;
  baseline_answer: string;
  full_answer: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  queryResponse?: QueryResponse;
}
