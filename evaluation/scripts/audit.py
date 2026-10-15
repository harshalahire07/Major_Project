import json
from pathlib import Path
from collections import defaultdict

def audit():
    baseline_records = defaultdict(list)
    full_records = defaultdict(list)
    
    with open('evaluation/results/baseline.jsonl', 'r') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            baseline_records[rec['question_id']].append(rec)
            
    with open('evaluation/results/full.jsonl', 'r') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            full_records[rec['question_id']].append(rec)
            
    print(f"Total baseline groups: {len(baseline_records)}")
    print(f"Total full groups: {len(full_records)}")
    
    # Select last successful run
    b_success = {}
    f_success = {}
    
    for qid, recs in baseline_records.items():
        successes = [r for r in recs if r.get('success')]
        if successes:
            b_success[qid] = successes[-1]
            
    for qid, recs in full_records.items():
        successes = [r for r in recs if r.get('success')]
        if successes:
            f_success[qid] = successes[-1]
            
    print(f"Successful baseline: {len(b_success)}")
    print(f"Successful full: {len(f_success)}")
    
    common = set(b_success.keys()).intersection(f_success.keys())
    print(f"Paired successful runs: {len(common)}")
    
    # Check draft answers
    exact_match_answers = 0
    for qid in common:
        b_draft = b_success[qid].get('response', {}).get('draft_answer', '').strip()
        f_draft = f_success[qid].get('response', {}).get('draft_answer', '').strip()
        if b_draft == f_draft:
            exact_match_answers += 1
            
    print(f"Draft answers exact match: {exact_match_answers}/{len(common)}")
    
    # Print out Q026 info
    if 'q026' in b_success:
        print("q026 baseline:", b_success['q026'].get('response', {}).get('question'))
    if 'q026' in f_success:
        print("q026 full:", f_success['q026'].get('response', {}).get('question'))

if __name__ == '__main__':
    audit()
