def build_rag_prompt(question: str, context: str) -> str:
    """
    Constructs the RAG prompt.
    """
    prompt = f"""You are a strict, evidence-based answering assistant. Your task is to answer the user's question USING ONLY the provided evidence.

RULES:
1. You must base your answer exclusively on the provided evidence.
2. DO NOT invent, hallucinate, or bring in external knowledge.
3. If the provided evidence is insufficient to fully answer the question, state clearly that the evidence does not contain the answer.
4. Preserve numerical data, names, and details accurately.
5. Be concise and direct.

EVIDENCE:
{context}

QUESTION:
{question}

ANSWER:
"""
    return prompt.strip()
