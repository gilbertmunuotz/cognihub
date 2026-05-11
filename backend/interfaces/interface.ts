export interface AnalyzeDocumentPayload {
    text: string;
    instruction?: string;
    /** Deprecated: server uses `OLLAMA_MODEL`; kept for backwards compatibility only. */
    model?: string;
}
