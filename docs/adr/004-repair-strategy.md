# ADR 004: Repair Strategy

## Status

**Accepted**

## Date

2026-09-23

## Context

When verification identifies contradicted or unverifiable claims, the system must decide how to handle them. Two broad strategies exist:

1. **Full regeneration:** Discard the entire answer and regenerate with additional constraints.
2. **Targeted repair:** Modify only the problematic claims, leaving supported claims intact.

## Decision

Use **targeted, evidence-constrained repair** of individual claims, followed by mandatory **re-verification**.

## Rationale

### 1. Precision

Full regeneration risks modifying already-correct parts of the answer. If 8 out of 10 claims are supported, regenerating the entire answer may change those 8 claims unnecessarily. Targeted repair preserves them.

### 2. Evidence Grounding

Repair is constrained by the retrieved evidence. The repair prompt provides the problematic claim, the contradicting/missing evidence, and instructs the LLM to rewrite the claim using only the available evidence. This reduces the chance of introducing new hallucinations.

### 3. Measurability

Targeted repair enables precise measurement of:
- **Repair success rate:** What fraction of repaired claims become supported.
- **Collateral modification rate:** Whether originally-supported claims are unintentionally altered during final answer reconstruction (supported claims are never intentionally sent to repair).
- **Supported-claim preservation:** Whether the final answer preserves originally-supported claims unchanged.

Full regeneration makes these per-claim metrics impossible.

### 4. Research Contribution

Targeted repair addresses RQ2 directly: "Can targeted evidence-based repair improve claim faithfulness without unnecessarily modifying already-supported claims?"

### 5. Re-Verification Requirement

Repair can introduce new unsupported content. Mandatory re-verification after repair catches these cases, addressing RQ3.

## Repair Process

```
1. Identify claims by verification status:
   a. Supported → keep unchanged (never sent to repair)
   b. Contradicted → targeted repair using contradictory/source evidence
   c. Unverifiable → attempt additional evidence retrieval first
2. For each contradicted claim:
   a. Retrieve the evidence passages used during verification
   b. Construct a repair prompt:
      - Original claim
      - Evidence passages (including contradictory evidence)
      - Instruction: rewrite using only the evidence
   c. Generate repaired claim via LLM
3. For each unverifiable claim:
   a. Attempt additional evidence retrieval with expanded queries
   b. If new evidence is found, re-verify the claim
   c. If still unverifiable, flag the claim — do not fabricate information
4. Re-verify each repaired claim against evidence using the NLI model
5. If re-verification fails and iteration < max_iterations, repeat from step 2
6. Assemble the final answer from supported + repaired + flagged claims
```

## Bounded Iteration

To prevent infinite repair–verify loops:

- Maximum repair iterations: **2** (configurable).
- If a claim still fails re-verification after max iterations, it is included in the final answer with its verification status explicitly marked (e.g., "unverified after repair").
- The system does not silently drop claims.

## Alternatives Considered

| Alternative | Decision | Reason |
|-------------|----------|--------|
| Full answer regeneration | Rejected | Loses already-supported claims. Not measurable per-claim. |
| Drop contradicted claims | Rejected | Loses information. May produce incomplete answers. |
| Mark contradicted claims without repair | Deferred | Simpler but provides no corrective action. May be used as a comparison in evaluation. |
| Multi-agent debate for repair | Rejected | Over-engineered for MVP. Adds complexity without proven benefit at this scale. |

## Risks

- Repair may introduce new unsupported claims (mitigated by re-verification).
- The LLM may fail to produce a meaningfully different claim during repair (may repeat the original).
- Evidence may be insufficient for the LLM to construct a correct alternative claim.
- Repair quality depends on the LLM's ability to synthesize evidence-grounded text.

## Consequences

- The `RepairStrategy` interface is defined in the service layer. Alternative repair strategies can be implemented and compared.
- Pipeline orchestration must implement the repair → re-verification loop with bounded iterations.
- Repair metrics (success rate, collateral modification rate) must be tracked in the database (`repair_actions` table).
- The system preserves transparency: users see which claims were repaired, the original text, and the re-verification status.

## Cross-References

- Repair evaluation metrics: [../EVALUATION_PLAN.md](../EVALUATION_PLAN.md#6-repair-evaluation)
- Pipeline architecture: [../ARCHITECTURE.md](../ARCHITECTURE.md#4-ai-pipeline-data-flow)
- Research question RQ2: [../RESEARCH_PLAN.md](../RESEARCH_PLAN.md#rq2)
- Research question RQ3: [../RESEARCH_PLAN.md](../RESEARCH_PLAN.md#rq3)
- Database — repair_actions table: [../DATABASE_DESIGN.md](../DATABASE_DESIGN.md#210-repair_actions)
