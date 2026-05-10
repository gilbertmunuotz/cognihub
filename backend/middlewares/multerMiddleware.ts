import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ephemeral uploads (files are deleted after text extraction).
const uploadDir = path.join(__dirname, "..", "tmp", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination(req: Request, file, cb) {
        cb(null, uploadDir);
    },
    filename(req: Request, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
