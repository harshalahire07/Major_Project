import asyncio
import httpx
import json
import time
import os
import argparse
from pathlib import Path
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def run_query(client: httpx.AsyncClient, question: str, document_id: str, mode: str, top_k: int = 5):
    payload = {
        "question": question,
        "document_ids": [document_id],
        "top_k": top_k,
        "mode": mode
    }
    
    start_time = time.time()
    try:
        response = await client.post(f"{BASE_URL}/api/v1/queries", json=payload, timeout=60.0)
        latency = time.time() - start_time
        
        if response.status_code == 200:
            return True, latency, response.json()
        else:
            return False, latency, {"status_code": response.status_code, "text": response.text}
    except Exception as e:
        latency = time.time() - start_time
        return False, latency, {"error": str(e)}

async def main():
    parser = argparse.ArgumentParser(description="Run pilot evaluation harness")
    parser.add_argument("--dataset", type=str, default="evaluation/dataset/pilot.jsonl")
    parser.add_argument("--out-dir", type=str, default="evaluation/results")
    args = parser.parse_args()

    dataset_path = Path(args.dataset)
    out_dir = Path(args.out_dir)
    
    if not dataset_path.exists():
        print(f"Dataset not found: {dataset_path}")
        return
        
    out_dir.mkdir(parents=True, exist_ok=True)
    baseline_out = out_dir / "baseline.jsonl"
    full_out = out_dir / "full.jsonl"
    
    records = []
    with open(dataset_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                record = json.loads(line)
                # Validation
                if not all(k in record for k in ["question_id", "question", "document_id"]):
                    print(f"Skipping line {line_num}: missing required fields.")
                    continue
                records.append(record)
            except json.JSONDecodeError:
                print(f"Skipping line {line_num}: invalid JSON.")
                
    if not records:
        print("No valid records found.")
        return

    print(f"Loaded {len(records)} questions. Beginning pilot run...")
    
    # Open files in append mode so we can resume or not lose data on crash
    with open(baseline_out, "w", encoding="utf-8") as bf, open(full_out, "w", encoding="utf-8") as ff:
        async with httpx.AsyncClient() as client:
            for record in records:
                q_id = record["question_id"]
                question = record["question"]
                doc_id = record["document_id"]
                
                print(f"[{q_id}] Running baseline...")
                # Baseline
                b_success, b_latency, b_response = await run_query(client, question, doc_id, "baseline")
                bf.write(json.dumps({
                    "question_id": q_id,
                    "mode": "baseline",
                    "timestamp": datetime.utcnow().isoformat(),
                    "success": b_success,
                    "latency_seconds": round(b_latency, 3),
                    "response": b_response
                }) + "\n")
                bf.flush()
                
                print(f"[{q_id}] Running full...")
                # Full
                f_success, f_latency, f_response = await run_query(client, question, doc_id, "full")
                ff.write(json.dumps({
                    "question_id": q_id,
                    "mode": "full",
                    "timestamp": datetime.utcnow().isoformat(),
                    "success": f_success,
                    "latency_seconds": round(f_latency, 3),
                    "response": f_response
                }) + "\n")
                ff.flush()
                
                print(f"[{q_id}] Completed. Baseline: {b_success} ({round(b_latency, 2)}s), Full: {f_success} ({round(f_latency, 2)}s)")

if __name__ == "__main__":
    asyncio.run(main())
