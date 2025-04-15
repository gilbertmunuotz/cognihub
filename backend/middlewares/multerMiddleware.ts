import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { Request } from "express";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload directory (backend/public/)
const uploadDir = path.join(__dirname, "../public");

// Configure Multer for storing uploads in "/public" directory
const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, uploadDir) // Save files in "public" folder
    },
    filename: (req: Request, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 1MB
});