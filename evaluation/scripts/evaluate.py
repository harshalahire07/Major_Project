import argparse
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="Run retrieval evaluation.")
    parser.add_argument("--dataset", type=str, default="evaluation/datasets/mvp_retrieval.jsonl", help="Path to evaluation dataset")
    args = parser.parse_args()
    
    dataset_path = Path(args.dataset)
    if not dataset_path.exists():
        print(f"ERROR: Dataset '{args.dataset}' is unavailable.")
        print("Please manually curate a ground-truth dataset in JSONL format before running evaluations.")
        print("Do NOT auto-generate ground-truth data from the retriever itself.")
        return

    print(f"Found dataset {args.dataset}. Evaluation runner is not yet fully wired to RetrievalService.")
    print("Implementation of the full evaluation loop will follow in future iterations.")

if __name__ == "__main__":
    main()
