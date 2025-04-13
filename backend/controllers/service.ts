import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { SERVER_URI } from "../constants/constant";

export async function HandleFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.file) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
            return;
        }

        // File info
        res.json({
            message: "File uploaded successfully!",
            fileUrl: `${SERVER_URI}/public/${req.file?.filename}`,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Registration failed" });
    }
};