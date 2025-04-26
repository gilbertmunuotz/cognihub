import fs from "fs";
import path from "path";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { pathToFileURL } from "url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(
    path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.js")
  ).href;

export async function extractTextFromPDF(filePath: string): Promise<string> {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        text += pageText + "\n";
    }

    return text.trim();
}