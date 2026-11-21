from __future__ import annotations

import json
import csv
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/evaluation", tags=["Evaluation"])

ROOT_DIR = Path(__file__).resolve().parents[4]
EVAL_RESULTS_DIR = ROOT_DIR / "evaluation" / "results"

@router.get("/metrics")
async def get_evaluation_metrics():
    """Return the paired evaluation metrics computed during Phase 2."""
    metrics_file = EVAL_RESULTS_DIR / "metrics.json"
    if not metrics_file.exists():
        return JSONResponse(status_code=404, content={"error": "Metrics file not found"})
    try:
        data = json.loads(metrics_file.read_text(encoding="utf-8"))
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to load metrics: {e}"})

@router.get("/summary")
async def get_evaluation_summary():
    """Return the paired comparison questions and answers from summary.csv."""
    summary_file = EVAL_RESULTS_DIR / "summary.csv"
    if not summary_file.exists():
        return JSONResponse(status_code=404, content={"error": "Summary file not found"})
    try:
        records = []
        with open(summary_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append({
                    "question_id": row.get("question_id"),
                    "category": row.get("category"),
                    "baseline_latency": float(row.get("baseline_latency", 0)),
                    "full_latency": float(row.get("full_latency", 0)),
                    "baseline_answer": row.get("baseline_answer"),
                    "full_answer": row.get("full_answer"),
                })
        return {"items": records, "total": len(records)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to load summary: {e}"})

