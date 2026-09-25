"""Unit tests for Document Chunking (M2A)."""
from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.models.document import Document, Page
from app.services.chunking.base import ExtractedChunk
from app.services.chunking.service import ChunkingService
from app.services.chunking.tiktoken_chunker import TiktokenChunker


class TestTiktokenChunker:
    def setup_method(self) -> None:
        # Use small sizes to easily test behavior
        self.chunker = TiktokenChunker(chunk_size=10, chunk_overlap=2)
        self.doc_id = uuid.uuid4()

    def test_short_page(self) -> None:
        """1. Short page (less than chunk_size)."""
        text = "Hello world."
        chunks = self.chunker.chunk_text(self.doc_id, 1, text)
        assert len(chunks) == 1
        assert chunks[0].text_content == "Hello world."
        assert chunks[0].page_start == 1
        assert chunks[0].page_end == 1
        assert chunks[0].chunk_index == 0

    def test_long_page_and_overlap(self) -> None:
        """2. Long page, 8. Chunk overlap, 12. Boundary behavior."""
        # 10 tokens chunk size, 2 tokens overlap.
        # "word " is ~1 token depending on the encoder. We will use simple repeating string.
        text = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z"
        chunks = self.chunker.chunk_text(self.doc_id, 1, text)
        assert len(chunks) > 1
        # Check overlap: last few words of chunk 0 should be first words of chunk 1
        words_0 = chunks[0].text_content.split()
        words_1 = chunks[1].text_content.split()
        
        # Tiktoken encodes text precisely, but we know there must be overlapping text.
        overlap_found = any(w in words_1 for w in words_0[-2:])
        assert overlap_found

    def test_empty_page(self) -> None:
        """4. Empty page."""
        chunks = self.chunker.chunk_text(self.doc_id, 1, "")
        assert len(chunks) == 0
        chunks2 = self.chunker.chunk_text(self.doc_id, 1, "   \n  ")
        assert len(chunks2) == 0

    def test_very_little_text(self) -> None:
        """5. Page with very little text."""
        chunks = self.chunker.chunk_text(self.doc_id, 2, "A")
        assert len(chunks) == 1
        assert chunks[0].text_content == "A"
        assert chunks[0].page_start == 2

    def test_metadata_preservation(self) -> None:
        """9. Chunk metadata preservation."""
        chunks = self.chunker.chunk_text(self.doc_id, 5, "Metadata test", start_chunk_index=42)
        assert len(chunks) == 1
        c = chunks[0]
        assert c.document_id == self.doc_id
        assert c.page_start == 5
        assert c.page_end == 5
        assert c.chunk_index == 42

    def test_deterministic_output(self) -> None:
        """11. Deterministic output for the same input."""
        text = "This is a deterministic test. It should produce the exact same chunks every single time."
        chunks1 = self.chunker.chunk_text(self.doc_id, 1, text)
        chunks2 = self.chunker.chunk_text(self.doc_id, 1, text)
        assert chunks1 == chunks2

    def test_whitespace_handling(self) -> None:
        """13. Whitespace handling."""
        # Chunks should be stripped
        text = "   Leading and trailing   "
        chunks = self.chunker.chunk_text(self.doc_id, 1, text)
        assert len(chunks) == 1
        assert chunks[0].text_content == "Leading and trailing"

    def test_unicode_and_punctuation(self) -> None:
        """14. Unicode text, 15. Numbers and punctuation."""
        chunker = TiktokenChunker(chunk_size=50, chunk_overlap=10)
        text = "Temperature: 98.6°F! Cost is €45,000. 日本語 (Japanese)."
        chunks = chunker.chunk_text(self.doc_id, 1, text)
        assert len(chunks) > 0
        combined = " ".join(c.text_content for c in chunks)
        assert "98.6°F!" in combined
        assert "€45,000" in combined
        assert "日本語" in combined


@pytest.fixture
def mock_session() -> AsyncMock:
    session = AsyncMock()
    session.add_all = MagicMock()
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    return session


class TestChunkingService:
    async def test_multiple_pages_and_ordering(self, mock_session: AsyncMock) -> None:
        """3. Multiple pages, 6. Page ordering, 7. Chunk ordering, 10. Relationships, 16. No cross-page boundaries."""
        service = ChunkingService(mock_session, strategy=TiktokenChunker(chunk_size=5, chunk_overlap=1))
        
        doc_id = uuid.uuid4()
        doc = Document(id=doc_id, title="Test", filename="test.pdf", file_path="/fake", file_size_bytes=100)
        
        # "1 2 3 4 5 6" will be split into at least 2 chunks with chunk_size=5
        page1 = Page(document_id=doc_id, page_number=1, text_content="One two three four five six", text_length=20)
        page2 = Page(document_id=doc_id, page_number=2, text_content="Seven eight nine ten", text_length=20)
        doc.pages = [page1, page2]
        
        # Mock repo
        service._doc_repo.get_by_id = AsyncMock(return_value=doc)
        service._chunk_repo.create_chunks = AsyncMock()
        
        db_chunks = await service.chunk_document(doc_id)
        
        assert len(db_chunks) >= 3
        
        # Verify page boundary preservation
        page1_chunks = [c for c in db_chunks if c.page_start == 1]
        page2_chunks = [c for c in db_chunks if c.page_start == 2]
        
        assert len(page1_chunks) > 1
        assert len(page2_chunks) >= 1
        
        # Verify no cross-page boundaries
        for c in db_chunks:
            assert c.page_start == c.page_end
            
        # Verify ordering
        assert page1_chunks[0].chunk_index == 0
        assert page1_chunks[1].chunk_index == 1
        assert page2_chunks[0].chunk_index == len(page1_chunks)
        
        # Verify mock persistence
        service._chunk_repo.create_chunks.assert_called_once()
        saved_chunks = service._chunk_repo.create_chunks.call_args[0][0]
        assert len(saved_chunks) == len(db_chunks)
