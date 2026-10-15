import json
import csv
from pathlib import Path
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_csvs(
    baseline_path: Path,
    full_path: Path,
    summary_out: Path,
    human_out_csv: Path,
    human_out_xlsx: Path,
    document_mapping_path: Path = Path("evaluation/dataset/document_mapping.json"),
    pilot_path: Path = Path("evaluation/dataset/pilot.jsonl")
):
    # Load document mapping (UUID -> Name)
    doc_map = {}
    if document_mapping_path.exists():
        with open(document_mapping_path, "r", encoding="utf-8") as f:
            raw_map = json.load(f)
            # Map UUID to Title
            doc_map = {v: k for k, v in raw_map.items()}

    # Load pilot question metadata (category, default document)
    pilot_metadata = {}
    if pilot_path.exists():
        with open(pilot_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    item = json.loads(line)
                    pilot_metadata[item["question_id"]] = item

    # Load baseline runs (latest successful run per question)
    baseline_records = {}
    with open(baseline_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            if rec.get("success"):
                baseline_records[rec['question_id']] = rec

    # Load full pipeline runs (latest successful run per question)
    full_records = {}
    with open(full_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip(): continue
            rec = json.loads(line)
            if rec.get("success"):
                full_records[rec['question_id']] = rec

    # Find common successfully paired questions
    common_qids = sorted(list(set(baseline_records.keys()).intersection(full_records.keys())))
    
    summary_data = []
    human_data = []
    
    for qid in common_qids:
        b_rec = baseline_records[qid]
        f_rec = full_records[qid]
        
        b_resp = b_rec.get('response', {})
        f_resp = f_rec.get('response', {})
        
        b_ans = b_resp.get('draft_answer', '')
        f_ans = f_resp.get('final_answer', '')
        
        pilot_info = pilot_metadata.get(qid, {})
        category = pilot_info.get("category", "pilot")
        default_doc_id = pilot_info.get("document_id", "")
        default_doc_name = doc_map.get(default_doc_id, default_doc_id)
        
        summary_data.append({
            "question_id": qid,
            "category": category,
            "baseline_latency": b_rec.get('latency_seconds', 0),
            "full_latency": f_rec.get('latency_seconds', 0),
            "baseline_answer": b_ans,
            "full_answer": f_ans
        })
        
        f_claims = f_resp.get('claims', [])
        for c in f_claims:
            orig_claim = c.get('original_claim_text', '')
            repaired_claim = c.get('current_claim_text', '')
            
            final_vr = c.get('final_verification_result', {})
            orig_vr = c.get('original_verification_result', {})
            
            verif_status = final_vr.get('status') or orig_vr.get('status', '')
            
            # Extract evidence chunks
            ev_list = final_vr.get('evidence', [])
            if not ev_list:
                ev_list = orig_vr.get('evidence', [])
                
            ev_texts = []
            page_numbers = []
            source_docs = set()
            
            for item in ev_list:
                text = item.get('text', '').strip()
                p_num = item.get('page_number')
                d_id = item.get('document_id', '')
                d_name = doc_map.get(d_id, default_doc_name)
                
                if text:
                    ev_texts.append(f"[Page {p_num}]: {text}")
                if p_num is not None:
                    page_numbers.append(str(p_num))
                if d_name:
                    source_docs.add(d_name)
                    
            joined_evidence = "\n\n".join(ev_texts)
            distinct_pages = ", ".join(sorted(set(page_numbers), key=lambda x: int(x) if x.isdigit() else x))
            joined_docs = ", ".join(sorted(source_docs)) if source_docs else default_doc_name
            
            human_data.append({
                "question_id": qid,
                "category": category,
                "baseline_answer": b_ans,
                "full_answer": f_ans,
                "original_claim": orig_claim,
                "verification_status": verif_status,
                "repaired_claim": repaired_claim,
                "evidence_text": joined_evidence,
                "source_document": joined_docs,
                "page_number": distinct_pages,
                "human_label": ""  # Kept blank for manual human evaluation
            })
            
    # 1. Write summary.csv
    summary_out.parent.mkdir(parents=True, exist_ok=True)
    with open(summary_out, 'w', encoding='utf-8', newline='') as f:
        if summary_data:
            writer = csv.DictWriter(f, fieldnames=summary_data[0].keys())
            writer.writeheader()
            writer.writerows(summary_data)
            
    # 2. Write human_evaluation.csv
    human_out_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(human_out_csv, 'w', encoding='utf-8', newline='') as f:
        if human_data:
            writer = csv.DictWriter(f, fieldnames=human_data[0].keys())
            writer.writeheader()
            writer.writerows(human_data)

    # 3. Write styled human_evaluation.xlsx
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Human Evaluation"

    # Define styles
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    label_header_fill = PatternFill(start_color="C00000", end_color="C00000", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    cell_font = Font(name="Calibri", size=10)
    label_cell_fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
    thin_border = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )
    align_top_left = Alignment(vertical="top", horizontal="left", wrap_text=True)
    align_center = Alignment(vertical="top", horizontal="center", wrap_text=True)

    headers = list(human_data[0].keys()) if human_data else []
    ws.append(headers)

    # Style header row
    for col_idx, col_name in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = label_header_fill if col_name == "human_label" else header_fill
        cell.alignment = Alignment(vertical="center", horizontal="center", wrap_text=False)
        cell.border = thin_border

    # Add rows
    for row_idx, record in enumerate(human_data, 2):
        row_values = [record[h] for h in headers]
        ws.append(row_values)
        for col_idx, col_name in enumerate(headers, 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = cell_font
            cell.border = thin_border
            if col_name in ["question_id", "category", "verification_status", "page_number", "source_document"]:
                cell.alignment = align_center
            else:
                cell.alignment = align_top_left
            if col_name == "human_label":
                cell.fill = label_cell_fill

    # Set column widths
    col_widths = {
        "question_id": 14,
        "category": 16,
        "baseline_answer": 35,
        "full_answer": 35,
        "original_claim": 35,
        "verification_status": 20,
        "repaired_claim": 35,
        "evidence_text": 50,
        "source_document": 18,
        "page_number": 14,
        "human_label": 20
    }
    for col_idx, col_name in enumerate(headers, 1):
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = col_widths.get(col_name, 25)

    # Freeze header row
    ws.freeze_panes = "A2"

    wb.save(human_out_xlsx)
    print(f"Generated {len(human_data)} records in {human_out_csv} and {human_out_xlsx}")

if __name__ == "__main__":
    generate_csvs(
        baseline_path=Path("evaluation/results/baseline.jsonl"),
        full_path=Path("evaluation/results/full.jsonl"),
        summary_out=Path("evaluation/results/summary.csv"),
        human_out_csv=Path("evaluation/results/human_evaluation.csv"),
        human_out_xlsx=Path("evaluation/results/human_evaluation.xlsx")
    )
