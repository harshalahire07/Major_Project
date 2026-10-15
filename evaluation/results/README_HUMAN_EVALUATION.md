# Human Evaluation Guidelines & Reviewer Instructions
**Project**: AI Document Verification & Hallucination Repair  
**Milestone**: M9B Real Pilot Evaluation — Human Labeling Dataset  
**Target Files**: 
- `evaluation/results/human_evaluation.csv`
- `evaluation/results/human_evaluation.xlsx`

---

## 1. Overview and Objective
This evaluation dataset contains **47 atomic claims** decomposed from the draft answers generated during the M9B pilot evaluation across **16 successfully paired benchmark questions**.

The objective of manual human annotation is to provide an independent, ground-truth audit of:
1. **Factual Faithfulness**: Whether decomposed claims are factually aligned with the underlying research documents.
2. **Automated Verification Accuracy**: How well the automated NLI cross-encoder's classification (`SUPPORTED`, `CONTRADICTED`, `UNVERIFIABLE`) correlates with human judgment.
3. **Repair Quality & Faithfulness**: Whether targeted LLM repairs of contradicted claims produced truthful statements without introducing secondary hallucinations.
4. **Collateral Damage Assessment**: Confirming whether already-supported claims were preserved without distortion.

---

## 2. Dataset Schema

Each record contains the following 11 fields:

| Column Header | Description |
| :--- | :--- |
| `question_id` | Identifier of the benchmark query (e.g., `q003`, `q005`). |
| `category` | Query category (e.g., `direct`, `numerical`, `multi-evidence`, `multi-sentence`, `contradiction`, `unsupported`). |
| `baseline_answer` | Raw generated answer from standard RAG (baseline mode). |
| `full_answer` | Final reconstructed answer after claim decomposition, verification, and targeted repair. |
| `original_claim` | The atomic claim decomposed from the initial draft answer prior to repair. |
| `verification_status` | Automated NLI classification (`SUPPORTED`, `CONTRADICTED`, or `UNVERIFIABLE`). |
| `repaired_claim` | The claim text after targeted repair (identical to `original_claim` if no repair occurred). |
| `evidence_text` | Exact text chunks retrieved by the system with explicit `[Page X]` provenance markers. |
| `source_document` | Human-readable document title (e.g., `Provenance`, `FactLens`, `SciHal`, `HalluCorrect`). |
| `page_number` | Document page number(s) where the evidence chunks originate. |
| `human_label` | **Reviewer input column (blank by default)**. Enter one of the five standard labels below. |

---

## 3. Reviewer Instructions & Decision Taxonomy

For each row, inspect the `original_claim`, `verification_status`, `repaired_claim`, and cross-reference them against the provided `evidence_text` and source document pages.

Assign exactly **one** of the following labels in the `human_label` column:

### `CORRECT`
- **Definition**: The claim is factually accurate and directly entailed/supported by the cited document evidence.
- **Criteria**:
  - The assertion is true based on the provided evidence chunk(s).
  - Paraphrasing or minor syntactic variation is acceptable as long as the core proposition is strictly entailed.

### `INCORRECT`
- **Definition**: The claim is factually wrong, directly contradicted, or refuted by the cited document evidence or known source context.
- **Criteria**:
  - The claim states numbers, dates, findings, or relationships that conflict directly with the source text.
  - Active hallucinations or inverted statements belong here.

### `UNSUPPORTED`
- **Definition**: The claim cannot be confirmed or refuted solely from the provided evidence chunks, but is not an active falsehood.
- **Criteria**:
  - The evidence chunks do not contain sufficient context to verify the claim.
  - The statement makes extrapolations beyond the text that are not mentioned in the source chunks.

### `INCORRECT_REPAIR`
- **Definition**: The claim was modified during targeted repair, but the resulting `repaired_claim` is flawed.
- **Criteria**:
  - The repair introduced a new hallucination or factual error.
  - The repair distorted the question's meaning or became nonsensical.
  - The repair failed to resolve the contradiction identified by the verifier.

### `UNCLEAR`
- **Definition**: The claim is ambiguous, incomplete, or poorly formulated due to claim-decomposition errors.
- **Criteria**:
  - The atomic claim is a sentence fragment that lacks a clear subject, verb, or object.
  - The claim loses its semantic meaning when isolated from the surrounding paragraph.

---

## 4. Critical Epistemic Rule: `UNVERIFIABLE` $\neq$ `INCORRECT`

> [!IMPORTANT]
> **Do not automatically label every `UNVERIFIABLE` claim as `INCORRECT`.**
> 
> In evidence-grounded systems, `UNVERIFIABLE` denotes **epistemic uncertainty** due to context window limits or retrieval boundaries (i.e., the retriever did not surface the necessary chunk). It does **not** imply that the statement is factually false in the real world.
> 
> - If the claim makes an uncorroborated assertion that the evidence simply does not mention $\rightarrow$ assign **`UNSUPPORTED`**.
> - Only assign **`INCORRECT`** if the evidence or document context actively refutes or contradicts the claim.

---

## 5. Reviewing Repair Faithfulness and Collateral Damage

1. **Repair Faithfulness**:
   - For claims where `original_claim` $\neq$ `repaired_claim` (or where `verification_status` was repaired):
   - Compare `original_claim` vs. `repaired_claim` vs. `evidence_text`.
   - If the repair corrected the contradicted fact to accurately mirror the evidence, label as `CORRECT`.
   - If the repair failed or introduced new inaccuracies, label as `INCORRECT_REPAIR`.
2. **Collateral Damage**:
   - Note if any claim originally deemed `SUPPORTED` in the draft was corrupted or rewritten unnecessarily during the pipeline execution.

---

## 6. Deliverable Formats
- **CSV Review Copy**: `evaluation/results/human_evaluation.csv` (UTF-8 encoded standard CSV).
- **Excel Review Copy**: `evaluation/results/human_evaluation.xlsx` (Styled spreadsheet with frozen headers, word wrap, and highlighted input column).

Once manual labeling is complete, save the file to `evaluation/results/human_evaluation_labeled.csv` before running subsequent inter-annotator agreement or audit scripts.
