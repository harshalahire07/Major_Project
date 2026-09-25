import uuid
import pytest
from evaluation.scripts.metrics import calculate_recall_at_k, calculate_mrr, aggregate_metric

def test_recall_at_k():
    rel1 = uuid.uuid4()
    rel2 = uuid.uuid4()
    irrel1 = uuid.uuid4()
    irrel2 = uuid.uuid4()
    
    # 1. Relevant is at rank 1
    assert calculate_recall_at_k([rel1, irrel1], [rel1], k=1) == 1.0
    
    # 2. Relevant is at rank 2, but k=1
    assert calculate_recall_at_k([irrel1, rel1], [rel1], k=1) == 0.0
    
    # 3. Relevant is at rank 2, k=2
    assert calculate_recall_at_k([irrel1, rel1], [rel1], k=2) == 1.0
    
    # 4. Multiple relevant, one found
    assert calculate_recall_at_k([irrel1, rel1], [rel1, rel2], k=2) == 1.0
    
    # 5. Empty relevant
    assert calculate_recall_at_k([irrel1], [], k=1) == 0.0
    
    # 6. Empty retrieved
    assert calculate_recall_at_k([], [rel1], k=1) == 0.0

def test_mrr():
    rel = uuid.uuid4()
    irrel1 = uuid.uuid4()
    irrel2 = uuid.uuid4()
    
    # Rank 1 -> 1/1 = 1.0
    assert calculate_mrr([rel, irrel1], [rel]) == 1.0
    
    # Rank 2 -> 1/2 = 0.5
    assert calculate_mrr([irrel1, rel, irrel2], [rel]) == 0.5
    
    # Rank 3 -> 1/3 = 0.333...
    assert calculate_mrr([irrel1, irrel2, rel], [rel]) == pytest.approx(0.33333333)
    
    # Not found -> 0.0
    assert calculate_mrr([irrel1, irrel2], [rel]) == 0.0
    
    # Empty
    assert calculate_mrr([], [rel]) == 0.0
    assert calculate_mrr([irrel1], []) == 0.0

def test_aggregate_metric():
    assert aggregate_metric([1.0, 0.5, 0.0]) == 0.5
    assert aggregate_metric([]) == 0.0
