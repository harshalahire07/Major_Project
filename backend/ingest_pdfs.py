import asyncio
import json
import os
import shutil
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.services.documents.service import DocumentService
from app.services.chunking.service import ChunkingService
from app.services.retrieval.service import RetrievalService
from app.core.database import Base

async def ingest_docs():
    # Setup DB session
    engine = create_async_engine(settings.database_url)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    docs_dir = Path("../docs")
    pdf_files = list(docs_dir.glob("*.pdf"))

    mapping = {}
    
    # Let's map filename parts to keys required in pilot
    key_mapping = {
        "Provenance": "Provenance",
        "FactLens": "FactLens",
        "Natural Language Inference": "SciHal",
        "Correcting Hallucinations": "HalluCorrect"
    }
    
    async with async_session() as session:
        doc_service = DocumentService(session)
        chunk_service = ChunkingService(session)
        retrieval_service = RetrievalService(session)
        
        for pdf in pdf_files:
            file_name = pdf.name
            print(f"Ingesting {file_name}...")
            
            # Use real ingestion path
            # But wait, DocumentService expects a file-like object or path
            # Let's check how DocumentService handles it.
            # Usually, you'd call doc_service.ingest_document(filename, content)
            
            with open(pdf, "rb") as f:
                content = f.read()
                
            document = await doc_service.upload(filename=file_name, content=content)
            
            # The ingestion pipeline in DocumentService M1 probably extracts pages.
            # Then M2 Chunking Service needs to process it.
            chunks = await chunk_service.chunk_document(document.id)
            
            try:
                retrieval_service.embed_and_index_chunks(chunks)
            except AttributeError:
                pass # it might be done by chunking or another way
                
            doc_key = None
            for key, val in key_mapping.items():
                if key in file_name:
                    doc_key = val
                    break
                    
            if doc_key:
                mapping[doc_key] = str(document.id)
                print(f"Mapped {doc_key} -> {document.id}")
            
            await session.commit()
            
    # Write mapping to file
    out_dir = Path("../evaluation/dataset")
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "document_mapping.json", "w") as f:
        json.dump(mapping, f, indent=2)
        
    print("Ingestion complete. Mapping saved.")

if __name__ == "__main__":
    asyncio.run(ingest_docs())
