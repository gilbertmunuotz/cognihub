import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(
    path.join(__dirname, "../../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"),
).href;

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
