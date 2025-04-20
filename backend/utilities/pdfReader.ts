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
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
}