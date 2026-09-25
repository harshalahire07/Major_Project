"""Add chunks table

Revision ID: 7a0f8b1c4d92
Revises: 65eb8a432b16
Create Date: 2026-09-25 11:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7a0f8b1c4d92'
down_revision: Union[str, Sequence[str], None] = '65eb8a432b16'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'chunks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('document_id', sa.UUID(), nullable=False),
        sa.Column('page_start', sa.Integer(), nullable=False),
        sa.Column('page_end', sa.Integer(), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('text_content', sa.Text(), nullable=False),
        sa.Column('text_length', sa.Integer(), nullable=False),
        sa.Column('faiss_index_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chunks_document_id'), 'chunks', ['document_id'], unique=False)
    op.create_index(op.f('ix_chunks_faiss_index_id'), 'chunks', ['faiss_index_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_chunks_faiss_index_id'), table_name='chunks')
    op.drop_index(op.f('ix_chunks_document_id'), table_name='chunks')
    op.drop_table('chunks')
