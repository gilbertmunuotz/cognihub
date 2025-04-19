import path from "path";
import { fileURLToPath } from "url";
import { SERVER_URI } from "../constants/constant";
import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { extractTextFromPDF } from "../utilities/pdfReader";
import { extractTextFromDOCX } from "../utilities/docxReader";


// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function HandleFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.file) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
            return;
        }

        // Get file details
        const filePath = path.join(__dirname, "../public", req.file.filename);
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        let extractedText = '';

        if (fileExt === ".pdf") {
            extractedText = await extractTextFromPDF(filePath);
        } else if (fileExt === ".docx") {
            extractedText = await extractTextFromDOCX(filePath);
        } else {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Unsupported file type." });
            return;
        }

        // File info
        res.json({
            message: "File uploaded successfully!",
            fileUrl: `${SERVER_URI}/public/${req.file?.filename}`,
            text: extractedText
        });
    } catch (error) {
        console.error("File upload error:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "File upload failed" });
    }
};