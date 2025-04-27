import jwt from 'jsonwebtoken';
import process from "process";
import { Request, Response, NextFunction } from "express";

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        res.status(401).json({ message: "Unauthorized! No token provided" }); // Return to stop execution
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        // Type assertion since we know decoded will contain user data
        (req as any).user = decoded;
        next();
    });
};