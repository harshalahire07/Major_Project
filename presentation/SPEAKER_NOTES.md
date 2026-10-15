# Major Project Final Presentation: Slide-by-Slide Speaker Notes
**Target Presentation Time**: 15–20 minutes (~1 minute per slide + 5 minutes live demo)  
**Tone**: Rigorous, academic, candid about trade-offs, technically precise.

---

### Slide 1: Title & Team Details
- **Time**: 1:00
- **Speaker**: Harshal Ahire (or Team Lead)
- **Key Talking Points**:
  - Welcome the examination committee and project guides.
  - Introduce project title: *"An Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair."*
  - Introduce team members and acknowledge domain responsibilities: Harshal Ahire (Backend & Pipeline Architect), Mrudula Makar, Bhumika Gurjar, Parth Aher.
  - State project context: B.Tech Computer Science and Engineering, Pimpri Chinchwad University (A.Y. 2026–27).
- **Transition**: *"To motivate why this work is critical, let us examine the persistent challenge of hallucinations in modern Retrieval-Augmented Generation systems."*

---

### Slide 2: Problem Statement: The Hallucination Vulnerability in RAG
- **Time**: 1:15
- **Key Talking Points**:
  - Distinguish **linguistic fluency** from **factual faithfulness**: LLMs write convincingly, but often fabricate dates, scores, or claims.
  - Highlight the blind spot of standard RAG: Retrieval finds evidence, but the synthesis stage is "open-loop" (unverified).
  - Address the "blanket regeneration trap": If a system detects an error and simply regenerates the whole answer, it often introduces new errors and mutates facts that were already correct.
  - Conclude with the lack of attribution: Users receive black-box paragraphs without knowing which sentences came from which document page.
- **Transition**: *"Given these challenges, let us examine how existing academic literature attempts to address hallucinations and where the current research gap lies."*

---

### Slide 3: Motivation and Research Gap: Why Current Solutions Fall Short
- **Time**: 1:15
- **Key Talking Points**:
  - Survey existing paradigms:
    - Benchmarking frameworks like *FactLens* and *SciHal* measure hallucinations post-hoc, but don't actively repair them.
    - Self-correction models like *HalluCorrect* rely on the LLM to spot its own flaws—leading to sycophancy.
  - Define the research gap:
    1. Independent verifier separation (LLMs should not grade their own homework).
    2. Atomic claim decomposition rather than sentence-level guessing.
    3. Targeted, bounded repair that touches only the contradicted assertion.
    4. Distinguishing *unverifiable* (context missing) from *contradicted* (actively false).
- **Transition**: *"To address this gap, we formalized our project around seven engineering goals and four research questions."*

---

### Slide 4: Project Objectives & Guiding Research Questions
- **Time**: 1:15
- **Key Talking Points**:
  - Walk through objectives G1–G7: Modular RAG, atomic claim parsing, NLI cross-encoder verification, targeted repair, evidence expansion, bounded re-verification, and page citation assembly.
  - Introduce our four research questions:
    - **RQ1**: Does claim-level verification reduce contradiction classifications?
    - **RQ2**: Can targeted repair fix errors without causing collateral damage?
    - **RQ3**: Does re-verification prevent secondary hallucinations?
    - **RQ4**: What latency overhead does this multi-stage pipeline introduce?
- **Transition**: *"Let us compare our architectural scope directly against related published approaches."*

---

### Slide 5: Comparative Analysis: Existing Approaches vs Proposed System
- **Time**: 1:00
- **Key Talking Points**:
  - Walk through Table 1:
    - Standard RAG has no decomposition, no NLI, and no repair.
    - *Provenance* (2024) introduced claim decomposition and NLI, but provided no repair mechanism.
    - *HalluCorrect* (2024) explored repair, but lacked atomic decomposition and independent cross-encoder verification.
    - Our system combines all four: atomic decomposition, independent cross-encoder, targeted claim-level repair, and mandatory re-verification.
- **Transition**: *"Now, let us examine the core design principles that enable this multi-stage system."*

---

### Slide 6: Proposed Solution: Core Design & Architectural Principles
- **Time**: 1:15
- **Key Talking Points**:
  - Principle 1: **Draft-First Generation**—The initial RAG output is an unverified draft ($A_{draft}$), never shown to users prematurely.
  - Principle 2: **Atomic Decomposition**—Complex answers split into atomic subject-predicate-object propositions.
  - Principle 3: **Decoupled Cross-Encoder**—DeBERTa-v3 cross-encoder handles verification independently from the Qwen3-4B generative LLM.
  - Principle 4: **Three-Way Epistemic States**—SUPPORTED, CONTRADICTED, UNVERIFIABLE.
  - Principle 5: **Bounded Targeted Repair**—Rewrites only the single broken claim ($MAX\_ITER=2$).
  - Principle 6: **Deterministic Reconstruction**—Assembles final text solely from verified claims with page citations.
- **Transition**: *"Let us visualize how these principles translate into our end-to-end system architecture."*

---

### Slide 7: System Architecture: End-to-End Orchestrated Pipeline
- **Time**: 1:30
- **Key Talking Points**:
  - Guide the committee through Figure 1:
    - Step 1: User Query retrieves context chunks from FAISS.
    - Step 2: Generative LLM produces initial Draft Answer.
    - Step 3: Decomposer extracts atomic claims.
    - Step 4: Claim-level retrieval fetches targeted evidence chunks.
    - Step 5: NLI cross-encoder assigns states.
    - Step 6: Supported claims are preserved; Contradicted claims trigger LLM repair; Unverifiable claims trigger evidence expansion.
    - Step 7: Repaired/expanded claims re-enter NLI verification.
    - Step 8: Reconstructed final answer returned with page citations.
- **Transition**: *"To implement this architecture on local hardware, we selected a modern, resource-conscious technology stack."*

---

### Slide 8: Technology Stack & Architectural Layer Responsibilities
- **Time**: 1:15
- **Key Talking Points**:
  - Explain Table 2:
    - **Backend API**: FastAPI (Python 3.12, Pydantic v2 schemas).
    - **Relational Persistence**: PostgreSQL with SQLAlchemy async ORM and Alembic migrations.
    - **Vector Search**: FAISS `IndexFlatIP` on normalized embeddings.
    - **Embeddings**: BAAI/bge-small-en-v1.5 (384-dimensional dense vectors).
    - **Generative LLM**: Qwen3-4B-Instruct via local Ollama runtime (4-bit quantized).
    - **Verification**: `cross-encoder/nli-deberta-v3-small` (3-class NLI).
    - **Frontend**: React + TypeScript + Vite.
  - Emphasize service boundaries: Repositories isolate queries, services isolate logic, models isolate tables.
- **Transition**: *"Let us look closer at how documents are ingested, chunked, and retrieved."*

---

### Slide 9: Document Processing, Chunking Strategy & Vector Retrieval
- **Time**: 1:15
- **Key Talking Points**:
  - **PyMuPDF Ingestion**: Extracts text while tracking physical page numbers, ensuring every chunk retains its exact document origin.
  - **Page-Boundary Chunking**: Target size 500 characters, 100-character overlap. Chunks *never* cross page boundaries without tracking, preventing attribution loss.
  - **Scoped FAISS Retrieval**: Document filtering guarantees the model cannot hallucinate by retrieving text from unrelated files.
  - **Dual Retrieval**: Initial query retrieval fetches top-5 chunks; claim-level retrieval fetches top-3 chunks specific to each atomic proposition.
- **Transition**: *"Once the draft is generated, how does our system verify individual claims?"*

---

### Slide 10: Claim Decomposition & 3-Class NLI Verification Workflow
- **Time**: 1:15
- **Key Talking Points**:
  - Explain Figure 2: Atomic Claim + Retrieved Evidence $\rightarrow$ NLI Cross-Encoder.
  - Define the three mathematical thresholds:
    - **SUPPORTED** ($\tau_e \ge 0.50$): Evidence entails claim.
    - **CONTRADICTED** ($\tau_c \ge 0.50$): Evidence refutes claim.
    - **UNVERIFIABLE**: Neutral or insufficient context.
  - **Crucial Academic Caveat**: Emphasize that *UNVERIFIABLE does not mean false*. It denotes context boundaries, not necessarily an active fabrication.
- **Transition**: *"When a claim is marked CONTRADICTED, how does the system repair it without breaking surrounding facts?"*

---

### Slide 11: Targeted Claim Repair & Mandatory Re-verification
- **Time**: 1:15
- **Key Talking Points**:
  - Guide the committee through Figure 3:
    - **Context Isolation**: The LLM repair prompt receives *only* the contradicted claim and the conflicting evidence chunk.
    - **Constrained Rewrite**: Prompt instructs the model to correct the specific erroneous fact.
    - **Mandatory Re-Verification**: The repaired claim must be evaluated by the cross-encoder. It is accepted *only* if re-verification returns SUPPORTED.
    - **Iteration Bound ($MAX\_ITER = 2$)**: Prevents infinite loops. Unresolved claims degrade to FLAGGED.
    - **Deterministic Exclusion**: FLAGGED claims are excluded from the synthesized answer text, preserving audit history in the metadata.
- **Transition**: *"Let us examine the operational status of our implementation and how baseline and full modes are orchestrated."*

---

### Slide 12: Implementation Status: Dual-Mode Pipeline & API Integration
- **Time**: 1:15
- **Key Talking Points**:
  - Highlight Figure 4 (Comparison Diagram):
    - `mode="baseline"`: Fast, traditional RAG pass-through.
    - `mode="full"`: Comprehensive verification, repair, and citation pipeline.
  - Hardware engineering: **Lazy initialization** loads heavy PyTorch models only when full mode is triggered, preventing out-of-memory faults on our 4GB VRAM GPU.
  - Transparent Swagger UI: Accessible at `/docs` with live request/response schemas.
- **Transition**: *"To validate our implementation, we conducted an empirical pilot evaluation on four research papers."*

---

### Slide 13: Pilot Evaluation Methodology: Benchmark Curation & Rigorous Audit
- **Time**: 1:15
- **Key Talking Points**:
  - **Benchmark**: 26 curated questions across 6 categories (Direct, Numerical, Multi-Evidence, Multi-Sentence, Contradiction, Unsupported) evaluated on 4 published research papers.
  - **Hardware Realities**: Running 4B models locally on a 4GB RTX 2050 caused generation timeouts on complex queries.
  - **Execution Audit**:
    - 41 baseline execution attempts yielded 24 successful records (across 24 unique questions; 17 failed attempts).
    - 156 full pipeline execution attempts yielded 25 successful records (across 17 unique questions; 8 questions were successfully re-tested during retry loops, and 131 attempts failed due to local inference timeouts).
    - Exactly **16 unique questions** completed successfully in *both* modes (`q008` completed in full mode but failed in baseline).
  - Emphasize scientific integrity: Metrics are calculated strictly from the **16 paired successful runs** (47 claims, taking the last successful run per question), avoiding fabricated or extrapolated numbers.
- **Transition**: *"Let us examine the audited experimental metrics and their honest interpretation."*

---

### Slide 14: Actual Evaluation Results: Audited Metrics & Honest Interpretation
- **Time**: 1:45
- **Key Talking Points**:
  - Walk through Table 5:
    - **Contradiction Reduction**: 30 contradicted claims before repair fell to 22 claims after repair—an observed **26.67% reduction** (-8 claims).
    - **Unverifiable Shift**: Rose from 13 to 17 claims (+30.77%). Explain the grounding friction of small models: when prompted to repair contradictions, the 4B model produced cautious, neutral statements that the cross-encoder could not confirm as strictly entailed.
    - **Automated Repair Success**: 2 out of 41 repair opportunities succeeded under strict NLI thresholds (4.88%).
    - **Collateral Damage**: 0 automated observations recorded.
    - **Latency Overhead**: Baseline averaged 14.30s; Full pipeline averaged 65.77s. The overhead is **51.48 seconds** ($+360\%$), driven by sequential decomposition, secondary retrieval, and repair loops.
  - **Honest Academic Tone**: Reiterate that we do *not* claim hallucinations are eliminated. The system demonstrates the feasibility and trade-offs of claim-level auditing.
- **Transition**: *"Let us summarize our contributions, outline our demonstration plan, and discuss future work."*

---

### Slide 15: Conclusion, Demonstration Plan & Future Work
- **Time**: 1:30
- **Key Talking Points**:
  - **Conclusion**: We successfully engineered an end-to-end evidence-grounded system that decouples generation from verification, enforces claim-level attribution, and provides transparent page citations.
  - **Demo Plan**: Transition to the live demonstration showing baseline vs. full pipeline execution via the Swagger API.
  - **Future Roadmap**:
    1. Parallelize NLI cross-encoder scoring to reduce the 51.5s latency overhead.
    2. Explore speculative decoding for faster claim repair.
    3. Complete manual labeling of the 47 claims in `human_evaluation.csv`.
- **Closing**: *"Thank you. We are now ready to demonstrate the live system and welcome your questions."*

---

## Anticipated Defense Questions & Recommended Answers

**Q1: Why did you use DeBERTa-v3 as an NLI cross-encoder instead of asking Qwen3-4B to verify claims?**  
*Answer*: Asking the generative LLM to verify its own output creates an epistemic conflict of interest and causes sycophancy. Cross-encoder NLI models are specifically trained for premise-hypothesis relationship classification, providing objective mathematical entailment probabilities without generative bias.

**Q2: Why was your automated repair success rate only 4.88% (2 out of 41)?**  
*Answer*: Operating a 4B parameter model under 4-bit quantization creates severe grounding friction. When asked to rewrite a contradicted claim, the model often generated cautious, generic statements rather than tight factual assertions directly entailed by the chunk. This shifted claims into the UNVERIFIABLE state rather than achieving the strict $\ge 0.50$ entailment score required for SUPPORTED status.

**Q3: Why is the latency overhead so high (+51.48 seconds)?**  
*Answer*: The prototype runs sequentially on consumer hardware (4GB VRAM). For a single query, the pipeline performs: (1) RAG draft generation, (2) LLM claim decomposition, (3) up to 5 secondary FAISS retrievals, (4) sequential cross-encoder scoring across claim-chunk pairs, (5) LLM repair prompt execution, and (6) cross-encoder re-verification. In future work, parallelizing NLI scoring and batching chunk evaluation will drastically reduce this overhead.

**Q4: How do you know there was zero collateral damage?**  
*Answer*: In our automated pipeline audit, zero claims that originally achieved SUPPORTED status degraded to CONTRADICTED or UNVERIFIABLE post-repair. However, as noted in our research paper, true semantic collateral damage requires independent human annotation, which is currently prepared in `human_evaluation.csv`.
