import json
import argparse
from pathlib import Path

def calculate_metrics(baseline_path: Path, full_path: Path, output_path: Path):
    if not baseline_path.exists() or not full_path.exists():
        print("Missing result files.")
        return

    baseline_records = {}
    with open(baseline_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            if rec.get("success"):
                baseline_records[rec['question_id']] = rec

    full_records = {}
    with open(full_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            if rec.get("success"):
                full_records[rec['question_id']] = rec

    # Select the *last* successful run (the loop above inherently overwrites to the last one)
    common_qids = set(baseline_records.keys()).intersection(full_records.keys())
    
    total = len(common_qids)
    if total == 0:
        print("No common records found.")
        return

    total_claims = 0
    b_unsupported = 0
    b_contradicted = 0
    b_supported = 0
    
    f_unsupported = 0
    f_contradicted = 0
    f_supported = 0
    
    successful_repairs = 0
    total_repaired_attempted = 0
    collateral_damage_count = 0
    
    b_latency_sum = 0
    f_latency_sum = 0

    for qid in common_qids:
        b_rec = baseline_records[qid]
        f_rec = full_records[qid]
        
        b_latency_sum += b_rec.get('latency_seconds', 0)
        f_latency_sum += f_rec.get('latency_seconds', 0)
        
        f_resp = f_rec.get('response', {})
        f_claims = f_resp.get('claims') or []
        
        for c in f_claims:
            total_claims += 1
            
            orig = c.get('original_verification_result', {})
            orig_status = orig.get('status')
            
            if orig_status == 'UNVERIFIABLE':
                b_unsupported += 1
            elif orig_status == 'CONTRADICTED':
                b_contradicted += 1
            elif orig_status == 'SUPPORTED':
                b_supported += 1
                
            final = c.get('final_verification_result', {})
            final_status = final.get('status')
            
            if final_status == 'UNVERIFIABLE':
                f_unsupported += 1
            elif final_status == 'CONTRADICTED':
                f_contradicted += 1
            elif final_status == 'SUPPORTED':
                f_supported += 1
                
            r_status = c.get('repair_status')
            if r_status in ['REPAIRED', 'FAILED', 'FLAGGED']:
                total_repaired_attempted += 1
            if r_status == 'REPAIRED':
                successful_repairs += 1
                
            if orig_status == 'SUPPORTED' and final_status in ['CONTRADICTED', 'UNVERIFIABLE']:
                collateral_damage_count += 1
                
    b_avg_latency = b_latency_sum / total if total else 0
    f_avg_latency = f_latency_sum / total if total else 0
    
    contradiction_reduction = 0
    if b_contradicted > 0:
        contradiction_reduction = ((b_contradicted - f_contradicted) / b_contradicted) * 100
        
    repair_success = 0
    if total_repaired_attempted > 0:
        repair_success = (successful_repairs / total_repaired_attempted) * 100

    metrics = {
        "definitions": {
            "total_paired_questions": "Number of questions with successful runs in both modes (last successful attempt used).",
            "total_claims_evaluated": "Total atomic claims decomposed from the draft answers of the paired runs.",
            "baseline_contradicted_claims": "Number of claims labeled CONTRADICTED prior to repair (proxy for baseline generation).",
            "full_contradicted_claims": "Number of claims labeled CONTRADICTED after repair pipeline.",
            "baseline_unsupported_claims": "Number of claims labeled UNVERIFIABLE prior to repair.",
            "full_unsupported_claims": "Number of claims labeled UNVERIFIABLE after repair pipeline.",
            "contradiction_reduction_pct": "Percentage reduction strictly in CONTRADICTED claims: (Baseline - Full) / Baseline.",
            "repair_opportunities": "Number of claims that entered the repair/expansion loop.",
            "successful_repairs": "Number of claims successfully converted to SUPPORTED.",
            "collateral_damage_observations": "Automated pipeline observation of originally SUPPORTED claims degrading to an unsupported state.",
            "avg_latency_baseline_sec": "Mean latency of the baseline mode over paired questions.",
            "avg_latency_full_sec": "Mean latency of the full mode over paired questions.",
            "added_latency_overhead_sec": "Absolute latency overhead of the full pipeline (Full - Baseline)."
        },
        "total_paired_questions": total,
        "total_claims_evaluated": total_claims,
        "baseline_contradicted_claims": b_contradicted,
        "full_contradicted_claims": f_contradicted,
        "contradiction_reduction_pct": round(contradiction_reduction, 2),
        "baseline_unsupported_claims": b_unsupported,
        "full_unsupported_claims": f_unsupported,
        "total_repair_opportunities": total_repaired_attempted,
        "successful_repairs": successful_repairs,
        "repair_success_pct": round(repair_success, 2),
        "collateral_damage_observations": collateral_damage_count,
        "avg_latency_baseline_sec": round(b_avg_latency, 2),
        "avg_latency_full_sec": round(f_avg_latency, 2),
        "added_latency_overhead_sec": round(f_avg_latency - b_avg_latency, 2)
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=4)
        
    print(json.dumps(metrics, indent=4))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline", type=str, default="evaluation/results/baseline.jsonl")
    parser.add_argument("--full", type=str, default="evaluation/results/full.jsonl")
    parser.add_argument("--out", type=str, default="evaluation/results/metrics.json")
    args = parser.parse_args()
    
    calculate_metrics(Path(args.baseline), Path(args.full), Path(args.out))
