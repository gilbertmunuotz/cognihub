// import jwt from 'jsonwebtoken';
// import process from "process";
// import { Request, Response, NextFunction } from "express";

// // Middleware to verify JWT token
// export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

//     if (!token) {
//         res.status(401).json({ message: 'No token provided' });
//         return;
//     }

//     jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Failed to authenticate token' });
//         }
//         req.user = decoded; // Attach the decoded token (user info) to the request object
//         next();
//     });
// };