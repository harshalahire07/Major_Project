import json
from pathlib import Path
from collections import Counter

def inspect_claims():
    full_records = {}
    with open('evaluation/results/full.jsonl', 'r') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            if rec.get("success"):
                full_records[rec['question_id']] = rec
                
    # We only care about the 16 paired ones, but let's just do it directly from full.jsonl
    # Wait, need to sync with baseline to only get the 16 pairs
    baseline_records = {}
    with open('evaluation/results/baseline.jsonl', 'r') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            if rec.get("success"):
                baseline_records[rec['question_id']] = rec
                
    common = set(baseline_records.keys()).intersection(full_records.keys())
    
    orig_status_counts = Counter()
    final_status_counts = Counter()
    repair_status_counts = Counter()
    
    for qid in common:
        claims = full_records[qid].get('response', {}).get('claims', [])
        for c in claims:
            orig_status_counts[c.get('original_verification_result', {}).get('status')] += 1
            final_status_counts[c.get('final_verification_result', {}).get('status')] += 1
            repair_status_counts[c.get('repair_status')] += 1
            
    print("Original Status:", dict(orig_status_counts))
    print("Final Status:", dict(final_status_counts))
    print("Repair Status:", dict(repair_status_counts))

if __name__ == '__main__':
    inspect_claims()
