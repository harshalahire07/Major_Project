import os
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide

    # Theme Colors
    COLOR_NAVY = RGBColor(24, 43, 73)      # #182B49 Primary Header
    COLOR_BLUE = RGBColor(41, 128, 185)    # #2980B9 Accent
    COLOR_DARK = RGBColor(44, 62, 80)      # #2C3E50 Text
    COLOR_MUTED = RGBColor(127, 140, 141)  # #7F8C8D Subtitles
    COLOR_LIGHT = RGBColor(245, 247, 250)  # #F5F7FA Cards
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_RED = RGBColor(192, 57, 43)      # Alert / Contradiction
    COLOR_GREEN = RGBColor(39, 174, 96)    # Supported / Success
    COLOR_BORDER = RGBColor(218, 225, 231)

    fig_dir = Path("evaluation/results/figures")
    fig1_path = str(fig_dir / "figure1_architecture.jpg")
    fig2_path = str(fig_dir / "figure2_verification.jpg")
    fig3_path = str(fig_dir / "figure3_repair.jpg")
    fig4_path = str(fig_dir / "figure4_comparison.jpg")

    def add_header(slide, title_text, category_text="MAJOR PROJECT EXAMINATION"):
        # Top Header Banner
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.9))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_cat = tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.name = "Calibri"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_BLUE

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.name = "Calibri"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_NAVY

    def add_card(slide, left, top, width, height, fill_color=COLOR_LIGHT, border_color=COLOR_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)
        return shape

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_NAVY
    bg1.line.fill.background()

    # Title Box
    t_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.333), Inches(3.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "FINAL YEAR MAJOR PROJECT (B.TECH CSE 2026–27)"
    p0.font.name = "Calibri"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_BLUE

    p1 = tf1.add_paragraph()
    p1.text = "An Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair"
    p1.font.name = "Calibri"
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.space_before = Pt(10)

    p2 = tf1.add_paragraph()
    p2.text = "A Decoupled Multi-Stage Architecture Combining RAG, Atomic Claim Decomposition, NLI Cross-Encoder Verification, and Targeted Bounded Repair"
    p2.font.name = "Calibri"
    p2.font.size = Pt(14)
    p2.font.color.rgb = RGBColor(189, 195, 199)
    p2.space_before = Pt(10)

    # Details Card
    det_card = add_card(s1, Inches(1.0), Inches(4.8), Inches(11.333), Inches(1.8), fill_color=RGBColor(32, 55, 92), border_color=COLOR_BLUE)
    det_box = s1.shapes.add_textbox(Inches(1.3), Inches(5.0), Inches(10.733), Inches(1.4))
    dtf = det_box.text_frame
    dtf.word_wrap = True

    dp1 = dtf.paragraphs[0]
    dp1.text = "Project Team: Harshal Ahire (Backend & Pipeline Architect), Mrudula Makar, Bhumika Gurjar, Parth Aher"
    dp1.font.name = "Calibri"
    dp1.font.size = Pt(13)
    dp1.font.bold = True
    dp1.font.color.rgb = COLOR_WHITE

    dp2 = dtf.add_paragraph()
    dp2.text = "Department of Computer Science and Engineering | Pimpri Chinchwad University, Pune, India"
    dp2.font.name = "Calibri"
    dp2.font.size = Pt(12)
    dp2.font.color.rgb = RGBColor(220, 225, 230)
    dp2.space_before = Pt(4)

    dp3 = dtf.add_paragraph()
    dp3.text = "Key Milestone: M9B Autonomous Pilot Evaluation & Real Benchmark Metrics Audit"
    dp3.font.name = "Calibri"
    dp3.font.size = Pt(11)
    dp3.font.color.rgb = RGBColor(142, 198, 255)
    dp3.space_before = Pt(4)

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Problem Statement: The Hallucination Vulnerability in RAG", "Context & Problem Definition")

    cards_data_s2 = [
        ("The LLM Fluency Paradox", "Large Language Models generate highly coherent and authoritative prose, but fluency does not imply factual correctness. Models frequently generate confident but false assertions.", COLOR_NAVY),
        ("Standard RAG is 'Open-Loop'", "Conventional RAG injects retrieved context into prompts, but assumes generative synthesis is faithful. It possesses no built-in verification mechanism to detect factual divergence.", COLOR_NAVY),
        ("The Blanket Regeneration Trap", "When hallucinations occur, systems typically regenerate the entire answer. Full regeneration is non-deterministic, introduces new errors, and corrupts already-supported statements.", COLOR_RED),
        ("Lack of Granular Provenance", "Users receive unstructured paragraphs without claim-level attribution. It is impossible to ascertain which specific sentence originates from source documents vs. parametric hallucination.", COLOR_NAVY)
    ]

    for idx, (title, desc, accent) in enumerate(cards_data_s2):
        row = idx // 2
        col = idx % 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(1.5 + row * 2.65)
        add_card(s2, left, top, Inches(5.75), Inches(2.4))
        
        tb = s2.shapes.add_textbox(left + Inches(0.3), top + Inches(0.25), Inches(5.15), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.name = "Calibri"
        pt.font.size = Pt(16)
        pt.font.bold = True
        pt.font.color.rgb = accent
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.name = "Calibri"
        pd.font.size = Pt(13)
        pd.font.color.rgb = COLOR_DARK
        pd.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: Motivation and Research Gap
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Motivation and Research Gap: Why Current Solutions Fall Short", "Literature & Research Gap")

    # Left Column: Existing Paradigms
    add_card(s3, Inches(0.8), Inches(1.5), Inches(5.75), Inches(5.4))
    tb_l = s3.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.15), Inches(4.8))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "Existing Industry & Research Paradigms"
    p.font.name = "Calibri"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    items_l = [
        ("Post-Hoc Verification Only (FactLens, SciHal):", "State-of-the-art benchmarks evaluate hallucination rates after generation, but act strictly as passive measurement tools rather than active repair systems."),
        ("LLM Self-Correction (HalluCorrect):", "Prompting the same generative model to find its own mistakes leads to sycophancy, missed errors, and cascading secondary hallucinations."),
        ("Sentence-Level Granularity:", "Evaluating whole sentences fails because compound sentences often merge factual facts with fabricated clauses, requiring atomic isolation.")
    ]
    for h, b in items_l:
        p = tf_l.add_paragraph()
        p.text = h
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_before = Pt(10)
        p = tf_l.add_paragraph()
        p.text = b
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_DARK

    # Right Column: The Research Gap & Our Angle
    add_card(s3, Inches(6.75), Inches(1.5), Inches(5.75), Inches(5.4))
    tb_r = s3.shapes.add_textbox(Inches(7.05), Inches(1.8), Inches(5.15), Inches(4.8))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "The Identified Architectural Gap"
    p.font.name = "Calibri"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    items_r = [
        ("Independent Verifier Separation:", "A strict engineering boundary: The generative model should NEVER verify its own output. Verification must be performed by an independent cross-encoder."),
        ("Bounded Targeted Repair:", "Instead of rewriting whole answers, isolate only the contradicted claim. Use the conflicting evidence chunk as a constrained rewrite prompt."),
        ("Mandatory Re-verification Loop:", "Never assume a repair succeeded. Repaired text must re-enter NLI verification before being approved for user consumption."),
        ("Honest Uncertainty Tracking:", "Differentiate CONTRADICTED claims from UNVERIFIABLE claims. Lack of retrieval evidence does NOT mean the assertion is false.")
    ]
    for h, b in items_r:
        p = tf_r.add_paragraph()
        p.text = h
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_GREEN
        p.space_before = Pt(8)
        p = tf_r.add_paragraph()
        p.text = b
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 4: Project Objectives & Research Questions
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Project Objectives & Guiding Research Questions", "System Goals & Hypotheses")

    add_card(s4, Inches(0.8), Inches(1.5), Inches(5.75), Inches(5.4))
    tb_obj = s4.shapes.add_textbox(Inches(1.1), Inches(1.75), Inches(5.15), Inches(4.9))
    tf_obj = tb_obj.text_frame
    tf_obj.word_wrap = True
    p = tf_obj.paragraphs[0]
    p.text = "Core Project Objectives (G1 – G7)"
    p.font.name = "Calibri"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    objs = [
        ("G1. Modular RAG Pipeline:", "Generate context-grounded draft answers from ingested PDFs."),
        ("G2. Atomic Decomposition:", "Break answers into isolated, verifiable factual propositions."),
        ("G3. Three-Way NLI Verification:", "Classify claims as SUPPORTED, CONTRADICTED, or UNVERIFIABLE."),
        ("G4. Targeted Claim Repair:", "Repair contradicted claims using conflicting evidence chunks."),
        ("G5. Evidence Expansion:", "Re-query vector index for unverified claims before flagging."),
        ("G6. Mandatory Re-Verification:", "Re-verify repaired claims with bounded iterations (max 2)."),
        ("G7. Provenance Citations:", "Reconstruct answers adorned with page-level citations.")
    ]
    for o, d in objs:
        p = tf_obj.add_paragraph()
        p.text = f"{o} {d}"
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_DARK
        p.space_before = Pt(6)

    add_card(s4, Inches(6.75), Inches(1.5), Inches(5.75), Inches(5.4))
    tb_rq = s4.shapes.add_textbox(Inches(7.05), Inches(1.75), Inches(5.15), Inches(4.9))
    tf_rq = tb_rq.text_frame
    tf_rq.word_wrap = True
    p = tf_rq.paragraphs[0]
    p.text = "Guiding Research Questions"
    p.font.name = "Calibri"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    rqs = [
        ("RQ1: Contradiction Reduction", "Does claim-level evidence verification reduce unsupported and contradicted claim classifications compared to standard RAG?"),
        ("RQ2: Targeted Repair Faithfulness", "Can evidence-based repair improve claim accuracy without causing collateral damage to already-supported statements?"),
        ("RQ3: Re-verification Reliability", "Does enforcing automated re-verification prevent secondary hallucinations introduced during LLM repair?"),
        ("RQ4: Computational Latency Overhead", "What exact latency overhead is introduced by sequential decomposition, multi-claim NLI, and repair loops?")
    ]
    for r, q in rqs:
        p = tf_rq.add_paragraph()
        p.text = r
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_before = Pt(10)
        p = tf_rq.add_paragraph()
        p.text = q
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 5: Existing Approaches vs Proposed System
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Comparative Analysis: Existing Approaches vs Proposed System", "State of the Art Comparison")

    table_shape5 = s5.shapes.add_table(5, 5, Inches(0.8), Inches(1.6), Inches(11.733), Inches(4.8))
    table5 = table_shape5.table
    table5.columns[0].width = Inches(2.333)
    table5.columns[1].width = Inches(2.35)
    table5.columns[2].width = Inches(2.35)
    table5.columns[3].width = Inches(2.35)
    table5.columns[4].width = Inches(2.35)

    headers5 = ["System / Approach", "Claim Decomposition", "Independent NLI Verifier", "Targeted Repair", "Mandatory Re-verification"]
    rows5 = [
        ["Standard RAG", "No (Whole text)", "No (Blind trust)", "No", "No"],
        ["Provenance (2024)", "Yes (Atomic)", "Yes (Cross-Encoder)", "No (Detection only)", "No"],
        ["HalluCorrect (2024)", "No (Holistic)", "No (Self-eval)", "Yes (Holistic prompt)", "No"],
        ["Proposed Architecture", "Yes (Atomic parsing)", "Yes (DeBERTa-v3 NLI)", "Yes (Isolated to claim)", "Yes (Bounded loop)"]
    ]

    for c_idx, h in enumerate(headers5):
        cell = table5.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.CENTER

    for r_idx, r in enumerate(rows5, 1):
        is_ours = (r_idx == 4)
        for c_idx, val in enumerate(r):
            cell = table5.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(235, 245, 255) if is_ours else COLOR_WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.name = "Calibri"
            p.font.size = Pt(12)
            p.font.bold = is_ours
            p.font.color.rgb = COLOR_BLUE if is_ours else COLOR_DARK
            p.alignment = PP_ALIGN.CENTER if c_idx > 0 else PP_ALIGN.LEFT

    # =========================================================================
    # SLIDE 6: Proposed Solution & Core Principles
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Proposed Solution: Core Design & Architectural Principles", "Solution Methodology")

    principles = [
        ("1. Draft-First Generation Paradigm", "Initial RAG output is explicitly treated as an unverified draft answer (A_draft). It is never displayed to end-users prior to verification.", COLOR_BLUE),
        ("2. Atomic Claim Decomposition", "Deconstructs compound generative responses into fine-grained atomic propositions. Prevents discarding an entire paragraph over a single erroneous phrase.", COLOR_BLUE),
        ("3. Decoupled Independent NLI Verifier", "Generative LLM is strictly prohibited from verifying its own claims. An independent cross-encoder computes entailment and contradiction scores against retrieved evidence.", COLOR_BLUE),
        ("4. Strict 3-Class Epistemic States", "Claims are partitioned into SUPPORTED, CONTRADICTED, or UNVERIFIABLE. Unverifiable claims are recognized as context gaps, not assumed to be false.", COLOR_GREEN),
        ("5. Isolated Bounded Claim Repair", "Repairs target only contradicted claims using evidence chunks. The repair loop is capped at MAX_ITER = 2 to prevent infinite generative cycles.", COLOR_GREEN),
        ("6. Deterministic Provenance Reconstruction", "Final answers are synthesized solely from verified SUPPORTED claims, decorated with transparent page citations mapped from PyMuPDF.", COLOR_GREEN)
    ]

    for idx, (title, desc, accent) in enumerate(principles):
        row = idx // 3
        col = idx % 3
        left = Inches(0.8 + col * 3.95)
        top = Inches(1.5 + row * 2.7)
        add_card(s6, left, top, Inches(3.8), Inches(2.45))
        
        tb = s6.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), Inches(3.4), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.name = "Calibri"
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = accent
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.name = "Calibri"
        pd.font.size = Pt(11.5)
        pd.font.color.rgb = COLOR_DARK
        pd.space_before = Pt(6)

    # =========================================================================
    # SLIDE 7: Overall System Architecture
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "System Architecture: End-to-End Orchestrated Pipeline", "Architecture & Dataflow")

    # Image Left
    if os.path.exists(fig1_path):
        s7.shapes.add_picture(fig1_path, Inches(0.8), Inches(1.5), width=Inches(4.2))

    # Text Right
    add_card(s7, Inches(5.3), Inches(1.5), Inches(7.233), Inches(5.4))
    tb7 = s7.shapes.add_textbox(Inches(5.6), Inches(1.7), Inches(6.633), Inches(5.0))
    tf7 = tb7.text_frame
    tf7.word_wrap = True

    p = tf7.paragraphs[0]
    p.text = "Pipeline Orchestration Flow"
    p.font.name = "Calibri"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    stages = [
        ("Stage 1: Document Retrieval", "User query retrieves top-5 context chunks from FAISS scoped index."),
        ("Stage 2: RAG Draft Generation", "Qwen3-4B generates draft answer (A_draft) grounded in retrieved context."),
        ("Stage 3: Atomic Decomposition", "Draft answer is parsed into atomic assertions C = {c_1, c_2, ..., c_m}."),
        ("Stage 4: Claim-Level Retrieval", "Secondary retrieval fetches dedicated evidence chunks E_i per claim."),
        ("Stage 5: NLI Cross-Encoder Verification", "DeBERTa-v3 evaluates V(c_i, E_i) -> SUPPORTED, CONTRADICTED, UNVERIFIABLE."),
        ("Stage 6: Targeted Repair / Expansion", "CONTRADICTED claims trigger LLM repair; UNVERIFIABLE claims trigger evidence expansion."),
        ("Stage 7: Re-verification & Assembly", "Repaired claims are re-verified. SUPPORTED claims are assembled with page citations.")
    ]
    for s_name, s_desc in stages:
        p = tf7.add_paragraph()
        p.text = s_name
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_before = Pt(5)
        p = tf7.add_paragraph()
        p.text = s_desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 8: Technology Stack & Architectural Roles
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Technology Stack & Architectural Layer Responsibilities", "Implementation Details")

    table_shape8 = s8.shapes.add_table(8, 3, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.3))
    table8 = table_shape8.table
    table8.columns[0].width = Inches(2.5)
    table8.columns[1].width = Inches(3.5)
    table8.columns[2].width = Inches(5.733)

    t8_headers = ["Layer / Subsystem", "Technology / Model", "Architectural Responsibility"]
    t8_rows = [
        ["Backend API", "FastAPI (Python 3.12, Pydantic)", "REST endpoints, request validation, service dependency injection."],
        ["Relational Persistence", "PostgreSQL, SQLAlchemy, Alembic", "Metadata storage, document status, chunk index, query audit logs."],
        ["Vector Search", "FAISS (IndexFlatIP)", "Inner-product cosine similarity search over dense embeddings."],
        ["Embedding Model", "BAAI/bge-small-en-v1.5", "384-dimensional dense representations for chunks and queries."],
        ["Generative LLM", "Qwen3-4B-Instruct-2507 via Ollama", "Initial draft synthesis and targeted claim repair (4-bit quantized)."],
        ["Verification Engine", "cross-encoder/nli-deberta-v3-small", "Independent 3-class NLI scoring (entailment, neutral, contradiction)."],
        ["Frontend UI", "React + TypeScript + Vite", "Interactive client UI scaffold and citation visualization interface."]
    ]

    for c_idx, h in enumerate(t8_headers):
        cell = table8.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.LEFT

    for r_idx, r in enumerate(t8_rows, 1):
        for c_idx, val in enumerate(r):
            cell = table8.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_WHITE if r_idx % 2 == 1 else COLOR_LIGHT
            p = cell.text_frame.paragraphs[0]
            p.font.name = "Calibri"
            p.font.size = Pt(11)
            p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 9: Document Ingestion, Chunking & Retrieval
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Document Processing, Chunking Strategy & Vector Retrieval", "Data Pipeline")

    data_s9 = [
        ("1. PyMuPDF Ingestion & Metadata Preservation", [
            "Uploaded research PDFs are extracted with strict page boundary awareness.",
            "Preserves physical page numbers, document titles, and structural offsets.",
            "Enables precise claim-to-page attribution in final response citations."
        ]),
        ("2. Page-Boundary Chunking Strategy", [
            "Text chunked at 500 characters with 100-character overlapping sliding window.",
            "Chunks NEVER cross page boundaries without tracking (guarantees provenance).",
            "Generates discrete semantic units for clean similarity indexing."
        ]),
        ("3. Dense BGE-Small Vector Embeddings", [
            "Embeddings generated with BAAI/bge-small-en-v1.5 (384 dimensions).",
            "Normalized vectors allow inner product calculation equivalent to cosine similarity.",
            "Compact embedding size ensures fast query search on resource-limited hardware."
        ]),
        ("4. Scoped FAISS Vector Retrieval", [
            "FAISS IndexFlatIP executes deterministic nearest-neighbor retrieval.",
            "Document Scoping: Filters search space exclusively to user-selected documents.",
            "Dual Retrieval: General query retrieval (Top-5) + per-claim retrieval (Top-3)."
        ])
    ]

    for idx, (title, bullets) in enumerate(data_s9):
        row = idx // 2
        col = idx % 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(1.5 + row * 2.65)
        add_card(s9, left, top, Inches(5.75), Inches(2.45))
        
        tb = s9.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), Inches(5.25), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.name = "Calibri"
        pt.font.size = Pt(15)
        pt.font.bold = True
        pt.font.color.rgb = COLOR_NAVY
        
        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = f"• {b}"
            pb.font.name = "Calibri"
            pb.font.size = Pt(11.5)
            pb.font.color.rgb = COLOR_DARK
            pb.space_before = Pt(4)

    # =========================================================================
    # SLIDE 10: Claim Decomposition & NLI Verification Workflow
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Claim Decomposition & 3-Class NLI Verification Workflow", "Verification Subsystem")

    if os.path.exists(fig2_path):
        s10.shapes.add_picture(fig2_path, Inches(0.8), Inches(1.5), width=Inches(11.733))

    v_states = [
        ("SUPPORTED", "tau_entailment >= 0.50", "The evidence chunk logically entails the atomic proposition. Claim is accepted with its page citation.", COLOR_GREEN),
        ("CONTRADICTED", "tau_contradiction >= 0.50", "The evidence chunk directly refutes or conflicts with the claim. Claim is isolated for targeted repair.", COLOR_RED),
        ("UNVERIFIABLE", "Neither threshold met", "The evidence is neutral or insufficient. Triggers evidence expansion. Epistemic limit != Falsehood.", COLOR_BLUE)
    ]

    for idx, (state, thresh, desc, colr) in enumerate(v_states):
        left = Inches(0.8 + idx * 3.95)
        top = Inches(4.3)
        add_card(s10, left, top, Inches(3.8), Inches(2.6))
        
        tb = s10.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), Inches(3.4), Inches(2.2))
        tf = tb.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = state
        pt.font.name = "Calibri"
        pt.font.size = Pt(18)
        pt.font.bold = True
        pt.font.color.rgb = colr
        
        pth = tf.add_paragraph()
        pth.text = thresh
        pth.font.name = "Calibri"
        pth.font.size = Pt(12)
        pth.font.bold = True
        pth.font.color.rgb = COLOR_MUTED
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.name = "Calibri"
        pd.font.size = Pt(11.5)
        pd.font.color.rgb = COLOR_DARK
        pd.space_before = Pt(6)

    # =========================================================================
    # SLIDE 11: Targeted Repair & Re-verification Loop
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Targeted Claim Repair & Mandatory Re-verification", "Repair & Correction Loop")

    # Image Left
    if os.path.exists(fig3_path):
        s11.shapes.add_picture(fig3_path, Inches(0.8), Inches(1.5), width=Inches(3.8))

    # Text Right
    add_card(s11, Inches(4.9), Inches(1.5), Inches(7.633), Inches(5.4))
    tb11 = s11.shapes.add_textbox(Inches(5.2), Inches(1.75), Inches(7.033), Inches(4.9))
    tf11 = tb11.text_frame
    tf11.word_wrap = True

    p = tf11.paragraphs[0]
    p.text = "Localized Repair Mechanics"
    p.font.name = "Calibri"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    rep_pts = [
        ("1. Bounded Context Isolation:", "Only the specific contradicted claim c_i and its conflicting chunk E_i are supplied to the LLM repair prompt. Surrounding verified claims remain untouched."),
        ("2. Evidence-Constrained Rewrite:", "Prompt instructs LLM: 'Rewrite ONLY this claim so it is directly supported by the evidence chunk.' Prevents hallucinations or speculative additions."),
        ("3. Mandatory Cross-Encoder Re-Verification:", "Repaired claim MUST be re-scored by DeBERTa-v3 cross-encoder. It is accepted only if V(c_repaired, E_i) evaluates to SUPPORTED."),
        ("4. Iteration Capping (MAX_ITER = 2):", "If repair remains CONTRADICTED, system retries once. If unverified after 2 iterations, status is marked FLAGGED to prevent infinite loops."),
        ("5. Deterministic Omission:", "FLAGGED claims are completely omitted from the final answer text, though preserved in metadata for transparency and research auditing.")
    ]
    for h, b in rep_pts:
        p = tf11.add_paragraph()
        p.text = h
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_before = Pt(8)
        p = tf11.add_paragraph()
        p.text = b
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 12: Implementation Status & API Integration
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Implementation Status: Dual-Mode Pipeline & API Integration", "System Execution")

    if os.path.exists(fig4_path):
        s12.shapes.add_picture(fig4_path, Inches(0.8), Inches(1.5), width=Inches(11.733))

    api_cards = [
        ("Dual-Mode Orchestration", [
            "mode='baseline': Standard RAG baseline (no verification, low latency).",
            "mode='full': Multi-stage claim decomposition, NLI, repair, re-verification.",
            "Ensures fair, controlled experimental evaluation of the pipeline."
        ]),
        ("Hardware-Aware Architecture", [
            "Lazy Loading: DeBERTa and Qwen3-4B models instantiate only on full mode.",
            "Memory Conservation: Prevents out-of-memory faults on 4GB VRAM GPU.",
            "Automatic Exception Degradation: Failures mark claims FLAGGED, preventing crashes."
        ]),
        ("Interactive REST Endpoints", [
            "POST /api/v1/queries: Unified endpoint returning claims, evidence, and answers.",
            "POST /api/v1/documents: Upload and index PDFs into PostgreSQL and FAISS.",
            "Swagger UI (/docs): Interactive test interface for complete system inspection."
        ])
    ]
    for idx, (title, bullets) in enumerate(api_cards):
        left = Inches(0.8 + idx * 3.95)
        top = Inches(4.3)
        add_card(s12, left, top, Inches(3.8), Inches(2.6))
        
        tb = s12.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), Inches(3.4), Inches(2.2))
        tf = tb.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.name = "Calibri"
        pt.font.size = Pt(15)
        pt.font.bold = True
        pt.font.color.rgb = COLOR_NAVY
        
        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = f"• {b}"
            pb.font.name = "Calibri"
            pb.font.size = Pt(11)
            pb.font.color.rgb = COLOR_DARK
            pb.space_before = Pt(4)

    # =========================================================================
    # SLIDE 13: Pilot Evaluation Methodology & Benchmark
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "Pilot Evaluation Methodology: Benchmark Curation & Rigorous Audit", "Empirical Evaluation")

    add_card(s13, Inches(0.8), Inches(1.5), Inches(5.75), Inches(5.4))
    tb_m1 = s13.shapes.add_textbox(Inches(1.1), Inches(1.75), Inches(5.15), Inches(4.9))
    tf_m1 = tb_m1.text_frame
    tf_m1.word_wrap = True

    p = tf_m1.paragraphs[0]
    p.text = "Benchmark Curation & Target Corpus"
    p.font.name = "Calibri"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    m1_items = [
        ("Corpus of 4 Peer-Reviewed Research Papers:", "Provenance (arXiv 2024), FactLens (arXiv 2024), SciHal (IEEE TAI 2023), HalluCorrect (ACL 2024)."),
        ("26 Curated Evaluation Questions (q001 – q026):", "Spanning 6 representative query categories:"),
        ("  • Direct Factoid (7)", "Direct textual assertions in source."),
        ("  • Numerical / Quantitative (7)", "Dates, percentages, parameters."),
        ("  • Multi-Evidence (4)", "Synthesis across separate chunks."),
        ("  • Multi-Sentence (3)", "Longer explanatory answers."),
        ("  • Contradiction-Inducing (3)", "Adversarial false premise queries."),
        ("  • Unsupported Scope (2)", "Concepts completely absent from docs.")
    ]
    for h, b in m1_items:
        p = tf_m1.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_DARK
        p.space_before = Pt(4)

    add_card(s13, Inches(6.75), Inches(1.5), Inches(5.75), Inches(5.4))
    tb_m2 = s13.shapes.add_textbox(Inches(7.05), Inches(1.75), Inches(5.15), Inches(4.9))
    tf_m2 = tb_m2.text_frame
    tf_m2.word_wrap = True

    p = tf_m2.paragraphs[0]
    p.text = "Execution Realities & Audit Findings"
    p.font.name = "Calibri"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    m2_items = [
        ("Hardware Constraints & Model Timeouts:", "Running local Qwen3-4B inference on an RTX 2050 (4GB VRAM) led to generation timeouts on complex reasoning questions."),
        ("Execution & Success Statistics:", "• Baseline Mode: 41 execution attempts yielded 24 successful records (24 unique questions; 17 failed).\n• Full Pipeline: 156 execution attempts yielded 25 successful records (17 unique questions; 8 re-tested, 131 failed due to timeouts)."),
        ("Paired Intersection (The Audited Set):", "Question q008 completed only in full mode. Exactly 16 unique questions completed successfully across BOTH modes (using the last successful run per question)."),
        ("Strict Scientific Grounding:", "All reported evaluation metrics are computed strictly from these 16 successfully paired runs (47 decomposed claims), avoiding speculative or unverified data.")
    ]
    for h, b in m2_items:
        p = tf_m2.add_paragraph()
        p.text = h
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_before = Pt(6)
        p = tf_m2.add_paragraph()
        p.text = b
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 14: Actual Results, Limitations, and Future Work
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, "Actual Evaluation Results: Audited Metrics & Honest Interpretation", "Pilot Findings")

    # Table Left
    table_shape14 = s14.shapes.add_table(8, 3, Inches(0.8), Inches(1.5), Inches(6.5), Inches(5.3))
    t14 = table_shape14.table
    t14.columns[0].width = Inches(2.9)
    t14.columns[1].width = Inches(1.8)
    t14.columns[2].width = Inches(1.8)

    t14_data = [
        ["Evaluation Metric", "Baseline (Proxy)", "Full Pipeline"],
        ["Paired Completed Questions", "16", "16"],
        ["Total Evaluated Claims", "47", "47"],
        ["Contradicted Claims", "30", "22 (-26.67%)"],
        ["Unverifiable Claims", "13", "17 (+30.77%)"],
        ["Automated Repair Success", "N/A", "2 / 41 (4.88%)"],
        ["Automated Collateral Damage", "N/A", "0 observations"],
        ["Mean Latency & Overhead", "14.30 s", "65.77 s (+51.48 s)"]
    ]
    for r_idx, r in enumerate(t14_data):
        for c_idx, val in enumerate(r):
            cell = t14.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            if r_idx == 0:
                cell.fill.fore_color.rgb = COLOR_NAVY
            else:
                cell.fill.fore_color.rgb = COLOR_WHITE if r_idx % 2 == 1 else COLOR_LIGHT
            p = cell.text_frame.paragraphs[0]
            p.font.name = "Calibri"
            p.font.size = Pt(11)
            p.font.bold = (r_idx == 0 or c_idx == 2)
            p.font.color.rgb = COLOR_WHITE if r_idx == 0 else (COLOR_BLUE if c_idx == 2 else COLOR_DARK)
            p.alignment = PP_ALIGN.CENTER if c_idx > 0 else PP_ALIGN.LEFT

    # Commentary Right
    add_card(s14, Inches(7.5), Inches(1.5), Inches(5.033), Inches(5.3))
    tb14 = s14.shapes.add_textbox(Inches(7.75), Inches(1.75), Inches(4.533), Inches(4.8))
    tf14 = tb14.text_frame
    tf14.word_wrap = True

    p = tf14.paragraphs[0]
    p.text = "Academic Findings & Insights"
    p.font.name = "Calibri"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    comm_pts = [
        ("Contradiction Reduction (-26.67%):", "Contradicted claims fell from 30 to 22. Proves that targeted evidence prompting can resolve explicit factual errors."),
        ("Unverifiable Claim Shift (+30.77%):", "Unverifiable claims rose from 13 to 17. Small 4B models struggle with strict evidence grounding, producing cautious, unverified statements."),
        ("Automated Repair Success (4.88%):", "2 of 41 repair opportunities achieved SUPPORTED state under strict cross-encoder thresholds; human evaluation pending."),
        ("Substantial Latency Overhead (+51.48s):", "Sequential decomposition, secondary retrieval, and repair loops introduce +360% latency overhead (65.77s vs 14.30s)."),
        ("Epistemic Honesty:", "We do NOT claim hallucinations were eliminated. The pipeline proves feasibility and transparency, not complete elimination.")
    ]
    for h, b in comm_pts:
        p = tf14.add_paragraph()
        p.text = h
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_RED if "Unverifiable" in h or "Latency" in h else COLOR_GREEN
        p.space_before = Pt(5)
        p = tf14.add_paragraph()
        p.text = b
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_DARK

    # =========================================================================
    # SLIDE 15: Conclusion, Demonstration & Future Work
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_header(s15, "Conclusion, Live Demonstration Plan & Future Work", "Summary & Live Demo")

    demo_cards = [
        ("Summary of Contributions", [
            "1. Engineered end-to-end modular pipeline integrating RAG, claim decomposition, NLI verification, and targeted repair.",
            "2. Decoupled generative LLM from independent cross-encoder verification.",
            "3. Enforced strict 3-way epistemic tracking with page-level citations.",
            "4. Conducted rigorous, audited pilot evaluation with honest metric reporting."
        ], COLOR_NAVY),
        ("Live Demonstration Plan", [
            "• Step 1: Verify PostgreSQL, Ollama (Qwen3-4B), and FastAPI service health.",
            "• Step 2: Ingest sample research paper and verify page-boundary indexing.",
            "• Step 3: Execute query in baseline mode (/api/v1/queries?mode=baseline).",
            "• Step 4: Execute query in full mode (/api/v1/queries?mode=full) and inspect decomposed claims, NLI states, repair actions, and citations.",
            "• Step 5: Side-by-side comparison of baseline vs full pipeline outputs."
        ], COLOR_BLUE),
        ("Future Roadmap", [
            "• Parallelized Verification: Async NLI scoring to slash the 51.5s latency overhead.",
            "• Speculative Repair Decoding: Accelerate claim rewriting loops.",
            "• Human Annotation: Finalize manual labels in human_evaluation.csv.",
            "• Frontend Integration: Connect citation visualization to full API contract."
        ], COLOR_NAVY)
    ]

    for idx, (title, bullets, colr) in enumerate(demo_cards):
        left = Inches(0.8 + idx * 3.95)
        top = Inches(1.5)
        add_card(s15, left, top, Inches(3.8), Inches(5.4))
        
        tb = s15.shapes.add_textbox(left + Inches(0.2), top + Inches(0.25), Inches(3.4), Inches(4.9))
        tf = tb.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.name = "Calibri"
        pt.font.size = Pt(16)
        pt.font.bold = True
        pt.font.color.rgb = colr
        
        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = b
            pb.font.name = "Calibri"
            pb.font.size = Pt(11.5)
            pb.font.color.rgb = COLOR_DARK
            pb.space_before = Pt(6)

    output_dir = Path("presentation")
    output_dir.mkdir(parents=True, exist_ok=True)
    deck_path = output_dir / "Major_Project_Final_Presentation.pptx"
    prs.save(str(deck_path))
    print(f"Presentation saved successfully to {deck_path} with {len(prs.slides)} slides.")

if __name__ == "__main__":
    create_deck()
