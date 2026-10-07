# Harshal's Contribution: Backend Architecture, Hallucination Repair, and Re-verification

## 1. Role
**Role:** Backend Engineering & Core Verification Pipeline Architect

## 2. Responsibilities
My primary responsibility was the design and implementation of the backend infrastructure and the sophisticated pipeline logic governing hallucination detection, repair, and orchestration. This encompassed setting up the FastAPI application structure, integrating various machine learning components (retrieval, RAG, claim decomposition, NLI verification, and LLM repair), and ensuring deterministic answer reconstruction. 

## 3. Backend Architecture
The backend is built with FastAPI (Python 3.12) and utilizes Pydantic for strict schema validation. The architecture follows a modular, service-oriented design where each stage of the pipeline (RAG, Decomposition, Verification, Repair) is decoupled and injected into a central `PipelineOrchestrator`. 
Key features:
- **Lazy Initialization:** Expensive models (e.g., NLI, LLM for decomposition/repair) are only instantiated when the pipeline explicitly requests `mode="full"`, conserving the limited VRAM (4GB) of the target deployment environment.
- **REST API:** Robust endpoints with comprehensive error handling that prevents internal stack traces from leaking to the client.

## 4. Pipeline Orchestration
The `PipelineOrchestrator` (`app/services/pipeline/pipeline_orchestrator.py`) handles the sequential execution of the multi-stage system:
- **Baseline Mode:** Bypasses all verification logic, passing the raw RAG output back to the user to serve as an experimental control.
- **Full Mode:** Routes the output through Claim Decomposition -> NLI Verification -> Targeted Repair -> Re-verification before synthesizing the final output.

## 5. Hallucination Repair
The `ClaimRepairService` evaluates claims flagged as `CONTRADICTED` by the NLI verifier. Instead of a blanket regeneration of the entire draft answer—which risks altering already-supported facts—the system isolates the specific contradictory claim and its associated evidence, passing them to an `LLMRepairProvider`. This targeted approach strictly repairs only what is broken.

## 6. Evidence Expansion
For claims evaluated as `UNVERIFIABLE`, the initial context may lack sufficient detail. The system executes evidence expansion by launching a secondary FAISS retrieval specifically querying the isolated claim text (with an expanded `top_k`), attempting to source previously un-retrieved context to resolve the claim state.

## 7. Re-verification
To ensure the repair loop does not introduce secondary hallucinations, any claim modified by the `LLMRepairProvider` or subjected to evidence expansion undergoes mandatory re-verification by the independent NLI model.

## 8. Repair Iterations
The system bounds the repair loop with an engineering constraint (`repair_max_iterations = 2`) to prevent infinite generative cycles. If a claim remains `CONTRADICTED` or `UNVERIFIABLE` after exhaustion of attempts, it falls back to a `FLAGGED` state and is safely omitted from the final user response.

## 9. Audit Trail
To ensure transparent research analysis, the backend maintains a robust audit trail (`FinalClaimState`). This structure preserves the original claim, the original verification result, every repair attempt (and its subsequent re-verification), the final claim text, and the final state.

## 10. Baseline vs. Full Modes
The architecture guarantees strict adherence to experimental modes. `mode="baseline"` reliably measures traditional RAG latency and hallucination rates without contamination from the verification stack, while `mode="full"` activates the comprehensive verification and repair pipeline.

## 11. Error Handling
The pipeline enforces resilient exception management. Failures in the repair provider or NLI verifier automatically degrade the specific claim to a `FLAGGED` state rather than crashing the orchestrator, ensuring the user still receives the partially verified answer.

## 12. Testing
The contribution includes a comprehensive unit testing suite using `pytest`. Extensive mocks were written to simulate various claim states (SUPPORTED, CONTRADICTED -> repaired successfully, CONTRADICTED -> failed repair, UNVERIFIABLE -> expanded, etc.), proving that the logic handles edge cases and loop limits predictably.

## 13. Design Decisions
- **Deterministic Reconstruction:** The final answer is synthesized by concatenating only the `SUPPORTED` claims in their original structural order. This guarantees that unverified or flagged claims are mechanically excluded from the user's view, though they remain in the metadata for auditing.
- **Independent Verification:** The generative LLM is structurally prohibited from verifying its own claims; verification is strictly delegated to the independent NLI cross-encoder.

## 14. Limitations
- Answer reconstruction via simple concatenation may result in slightly disjointed prose if significant transitional claims are flagged and omitted.
- The pipeline's sequential nature introduces measurable latency overhead when multiple claims require iterative repair.

## 15. Future Work
- Implementing parallelized claim verification and repair to reduce the latency overhead of `mode="full"`.
- Exploring speculative decoding during the targeted repair phase to further optimize response times.
