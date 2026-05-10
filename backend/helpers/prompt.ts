export function buildAnalyzePrompt(text: string, instruction?: string): string {
    const trimmed = text.trim();
    const inst = instruction?.trim();
    const grounding = "You must base your answer ONLY on the TEXT below. If the TEXT does not contain information needed to fulfill the request, say clearly that it is not in the TEXT and avoid inventing details.";

    if (inst) {
        return `${grounding}

User instruction:
${inst}

TEXT:
${trimmed}`;
    }

    return `${grounding}

Respond helpfully to the content below.

TEXT:
${trimmed}`;
}