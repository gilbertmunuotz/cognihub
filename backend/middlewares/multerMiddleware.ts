import multer from "multer";
import { Request, NextFunction } from "express";

// Configure Multer for storing uploads in "/public" directory
const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, "/public") // Save files in "public" folder)
    },
    filename: (req: Request, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
})

export const upload = multer({ storage });