import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve worker from backend/package `node_modules` (…/backend/utilities → ../node_modules). Using
// ../../node_modules points at the monorepo root and breaks when pdfjs-dist is only under backend/.
const workerFile = path.join(
    __dirname,
    "../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
);
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerFile).href;

export async function extractTextFromPDF(filePath: string): Promise<string> {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: unknown) => String((item as { str?: string }).str ?? "")).join(" ");
        text += pageText + "\n";
    }

    return text.trim();
}
