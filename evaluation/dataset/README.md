# Pilot Dataset

This directory contains `pilot.jsonl`, which is a template dataset for M9A evaluation.

## Format
Each record is a JSON object with the following fields:
- `question_id`: Unique identifier (e.g., "q001").
- `question`: The natural language question to ask the pipeline.
- `document_id`: The UUID of the document to restrict the search to. Must exist in the database.
- `category`: Evaluation category. Supported values are:
  - `direct`
  - `numerical`
  - `multi_evidence`
  - `unsupported`
  - `contradiction`
  - `multi_sentence`

## 25-Question Target
The final research dataset requires 25 human-curated questions targeting real uploaded documents in the system. The current `pilot.jsonl` is a template. DO NOT fabricate results or document IDs for the final pilot; populate this file with real data once available.
