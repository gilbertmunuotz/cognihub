import fs from "fs";
import { getDocument } from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

// Monkey patch for pdfjs-dist in Node.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Required to use PDF in Node (since no DOM)
import { createRequire } from "module";
const require = createRequire(import.meta.url);
pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/legacy/build/pdf.mjs")

export async function extractTextFromPDF(filePath: string): Promise<string> {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data }).promise

    let textContext = "";

    for (let index = 1; index <= pdf.numPages; index++) {
        const page = await pdf.getPage(index);
        const content = await page.getTextContent();
        const strings = content.items.map()
    }
}