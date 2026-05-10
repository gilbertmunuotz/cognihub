import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { extractTextFromDOCX } from "../utilities/docxReader";
import { extractTextFromPDF } from "../utilities/pdfReader";

async function removeUploadedFile(req: Request): Promise<void> {
    const fp = req.file?.path;
    if (!fp) return;
    try {
        await fs.promises.unlink(fp);
    } catch {
        // ignore missing file errors
    }
}


export async function HandleFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.file) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    try {
        let extractedText = "";

        if (fileExt === ".pdf") {
            extractedText = await extractTextFromPDF(filePath);
        } else if (fileExt === ".docx") {
            extractedText = await extractTextFromDOCX(filePath);
        } else {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Unsupported file type." });
            return;
        }

        res.json({
            message: "File processed successfully.",
            text: extractedText,
        });
    } catch (error) {
        console.error("File upload error:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "File processing failed" });
    } finally {
        await removeUploadedFile(req);
    }
}
