import requests
from pathlib import Path
import json

def upload_pdfs():
    docs_dir = Path("../docs")
    pdf_files = list(docs_dir.glob("*.pdf"))

    mapping = {}
    key_mapping = {
        "Provenance": "Provenance",
        "FactLens": "FactLens",
        "Natural Language Inference": "SciHal",
        "Correcting Hallucinations": "HalluCorrect"
    }

    url = "http://127.0.0.1:8000/api/v1/documents"
    for pdf in pdf_files:
        file_name = pdf.name
        print(f"Uploading {file_name}...")
        
        with open(pdf, "rb") as f:
            files = {"file": (file_name, f, "application/pdf")}
            response = requests.post(url, files=files)
            
        if response.status_code == 201 or response.status_code == 200:
            data = response.json()
            document_id = data.get("id")
            print(f"Uploaded successfully. ID: {document_id}")
            
            doc_key = None
            for key, val in key_mapping.items():
                if key in file_name:
                    doc_key = val
                    break
                    
            if doc_key:
                mapping[doc_key] = document_id
        else:
            print(f"Failed to upload {file_name}. Status: {response.status_code}, Body: {response.text}")

    out_dir = Path("../evaluation/dataset")
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "document_mapping.json", "w") as f:
        json.dump(mapping, f, indent=2)

    print("Mapping saved to evaluation/dataset/document_mapping.json")

if __name__ == "__main__":
    upload_pdfs()
