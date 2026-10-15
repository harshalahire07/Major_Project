import time
import json
import httpx
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"
DOCS_DIR = Path(r"C:\Users\hda00\Desktop\Major Project\docs")
PDF_PATH = DOCS_DIR / "3) Natural Language Inference Fine-tuning for Scientific Hallucination Detection.pdf"
SCIENTIFIC_DOC_ID = "adfce3b1-651c-4519-8992-5396032b2150"

output_record = {}

def run_phase_e():
    print("=" * 60)
    print("PHASE E: END-TO-END DEMONSTRATION & VERIFICATION")
    print("=" * 60)

    with httpx.Client(base_url=BASE_URL, timeout=180.0) as client:
        # 1. Health check
        print("\n[Step 0] Verifying Backend Health...")
        health_resp = client.get("/api/health")
        print(f"Health Status: {health_resp.status_code} -> {health_resp.json()}")
        assert health_resp.status_code == 200, "Backend not healthy!"

        # 2. Upload PDF
        print("\n[Step 1] Uploading PDF via POST /api/v1/documents...")
        print(f"File: {PDF_PATH.name} ({PDF_PATH.stat().st_size} bytes)")
        
        with open(PDF_PATH, "rb") as f:
            files = {"file": (PDF_PATH.name, f, "application/pdf")}
            data = {"title": "Validation Demo: SciHal Paper"}
            t0 = time.time()
            upload_resp = client.post("/api/v1/documents", files=files, data=data)
            upload_time = time.time() - t0

        print(f"Upload Status Code: {upload_resp.status_code} (took {upload_time:.2f}s)")
        upload_data = upload_resp.json()
        print(f"Response: {json.dumps(upload_data, indent=2)}")
        output_record["upload"] = {
            "status_code": upload_resp.status_code,
            "elapsed_seconds": upload_time,
            "response": upload_data
        }
        assert upload_resp.status_code == 201, f"Upload failed: {upload_resp.text}"
        uploaded_doc_id = upload_data["id"]

        # 3. Confirm Document & Page Retrieval
        print(f"\n[Step 2] Confirming Ingestion via GET /api/v1/documents/{uploaded_doc_id}...")
        # Brief pause to ensure async database transaction commit has completed
        time.sleep(1.0)
        get_doc_resp = client.get(f"/api/v1/documents/{uploaded_doc_id}")
        print(f"GET Doc Status Code: {get_doc_resp.status_code}")
        doc_detail = get_doc_resp.json()
        print(f"Document ID: {doc_detail.get('id')}")
        print(f"Title: {doc_detail.get('title')}")
        print(f"Page Count: {doc_detail.get('page_count')}")
        print(f"Status: {doc_detail.get('status')}")
        print(f"First 2 pages summary: {doc_detail.get('pages', [])[:2]}")
        output_record["ingestion_confirm"] = {
            "status_code": get_doc_resp.status_code,
            "doc_detail": doc_detail
        }
        assert get_doc_resp.status_code == 200, "Failed to get document detail"

        # 4. Confirm Chunk Retrieval for target document
        question = "What is the main goal of the SciHal paper?"
        print(f"\n[Step 3] Confirming Chunk Retrieval via POST /api/v1/queries/retrieve...")
        print(f"Query: '{question}' for Doc ID: {SCIENTIFIC_DOC_ID}")
        t0 = time.time()
        retrieval_payload = {
            "query": question,
            "document_id": SCIENTIFIC_DOC_ID,
            "top_k": 5
        }
        retrieval_resp = client.post("/api/v1/queries/retrieve", json=retrieval_payload)
        retrieval_time = time.time() - t0
        print(f"Retrieval Status Code: {retrieval_resp.status_code} (took {retrieval_time:.2f}s)")
        retrieval_data = retrieval_resp.json()
        chunks = retrieval_data.get("results", [])
        print(f"Retrieved {len(chunks)} chunks:")
        for i, c in enumerate(chunks):
            print(f"  [{i+1}] Score: {c.get('score'):.4f} | Page: {c.get('page_number')} | Chunk ID: {c.get('chunk_id')}")
            print(f"      Snippet: {c.get('text', '')[:120]}...")
        output_record["retrieval"] = {
            "status_code": retrieval_resp.status_code,
            "elapsed_seconds": retrieval_time,
            "chunks_count": len(chunks),
            "chunks": chunks
        }
        assert retrieval_resp.status_code == 200, f"Retrieval failed: {retrieval_resp.text}"
        assert len(chunks) > 0, "No chunks retrieved!"

        # 5. Baseline Mode Query
        print("\n[Step 4] Executing Baseline RAG Query via POST /api/v1/queries...")
        baseline_payload = {
            "question": question,
            "document_ids": [SCIENTIFIC_DOC_ID],
            "mode": "baseline",
            "top_k": 5
        }
        t0 = time.time()
        baseline_resp = client.post("/api/v1/queries", json=baseline_payload)
        baseline_time = time.time() - t0
        print(f"Baseline Status Code: {baseline_resp.status_code} (took {baseline_time:.2f}s)")
        baseline_data = baseline_resp.json()
        print("\n--- BASELINE ANSWER ---")
        print(baseline_data.get("draft_answer", ""))
        print(f"Used Chunks: {len(baseline_data.get('used_chunk_ids', []))}")
        print(f"Model: {baseline_data.get('model_name')}")
        output_record["baseline_query"] = {
            "status_code": baseline_resp.status_code,
            "elapsed_seconds": baseline_time,
            "response": baseline_data
        }
        assert baseline_resp.status_code == 200, f"Baseline query failed: {baseline_resp.text}"

        # 6. Full Mode Query
        print("\n[Step 5] Executing Full Verification & Repair Pipeline via POST /api/v1/queries...")
        full_payload = {
            "question": question,
            "document_ids": [SCIENTIFIC_DOC_ID],
            "mode": "full",
            "top_k": 5
        }
        t0 = time.time()
        full_resp = client.post("/api/v1/queries", json=full_payload)
        full_time = time.time() - t0
        print(f"Full Pipeline Status Code: {full_resp.status_code} (took {full_time:.2f}s)")
        full_data = full_resp.json()
        print("\n--- FULL PIPELINE DRAFT ANSWER ---")
        print(full_data.get("draft_answer", ""))
        print("\n--- FULL PIPELINE FINAL ANSWER ---")
        print(full_data.get("final_answer", ""))
        
        claims = full_data.get("claims", [])
        print(f"\nExtracted & Verified Claims: {len(claims)}")
        for i, cl in enumerate(claims):
            orig_ver = cl.get("original_verification_result", {})
            status = orig_ver.get("status")
            entail = orig_ver.get("entailment_score")
            contra = orig_ver.get("contradiction_score")
            neutral = orig_ver.get("neutral_score")
            repair_status = cl.get("repair_status")
            rep_hist = cl.get("repair_history", [])
            evidence = orig_ver.get("evidence", [])
            
            print(f"\n  [Claim {i+1}] {cl.get('original_claim_text')}")
            print(f"    Status: {status} (Entail: {entail}, Contra: {contra}, Neutral: {neutral})")
            print(f"    Repair Status: {repair_status}")
            if rep_hist:
                print(f"    Repair Attempts: {len(rep_hist)}")
                for r in rep_hist:
                    print(f"      -> Iteration {r.get('iteration')}: '{r.get('repaired_claim_text')}'")
                    after_ver = r.get("verification_after_repair", {})
                    print(f"         Post-repair status: {after_ver.get('status')}")
            if evidence:
                top_ev = evidence[0]
                print(f"    Top Evidence Page: {top_ev.get('page_number')} | Score: {top_ev.get('score'):.4f}")
                print(f"    Snippet: {top_ev.get('text', '')[:100]}...")

        output_record["full_query"] = {
            "status_code": full_resp.status_code,
            "elapsed_seconds": full_time,
            "response": full_data
        }
        assert full_resp.status_code == 200, f"Full query failed: {full_resp.text}"

        print("\n" + "=" * 60)
        print("DEMONSTRATION RESULTS SUMMARY")
        print("=" * 60)
        print(f"Upload PDF: PASS ({upload_time:.2f}s, {upload_data.get('page_count')} pages)")
        print(f"Chunk Retrieval: PASS ({retrieval_time:.2f}s, {len(chunks)} chunks)")
        print(f"Baseline Query: PASS ({baseline_time:.2f}s)")
        print(f"Full Pipeline Query: PASS ({full_time:.2f}s)")
        print(f"Total Claims: {len(claims)}")
        supported_cnt = sum(1 for c in claims if c.get("original_verification_result", {}).get("status") == "SUPPORTED")
        contra_cnt = sum(1 for c in claims if c.get("original_verification_result", {}).get("status") == "CONTRADICTED")
        unver_cnt = sum(1 for c in claims if c.get("original_verification_result", {}).get("status") == "UNVERIFIABLE")
        repaired_cnt = sum(1 for c in claims if c.get("repair_status") == "REPAIRED")
        print(f"  Supported: {supported_cnt}")
        print(f"  Contradicted: {contra_cnt}")
        print(f"  Unverifiable: {unver_cnt}")
        print(f"  Repaired: {repaired_cnt}")

    # Save artifact
    out_file = Path(r"C:\Users\hda00\Desktop\Major Project\presentation\phase_e_demo_output.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_record, f, indent=2)
    print(f"\nSaved raw demonstration output to: {out_file}")

if __name__ == "__main__":
    run_phase_e()
