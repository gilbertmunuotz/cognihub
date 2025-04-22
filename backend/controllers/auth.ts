import bcrypt from "bcryptjs";
import UserModel from "../models/user";
import { Request, Response } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";

// (DESC) Google OAuth Registration & login
export async function GoogleOAuth(req: Request, res: Response): Promise<void> {
    try {
        const { googleId, email, username } = req.body;
        if (!googleId || !email || !username) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "All Fields required" });
            return;
        }

        const user = await UserModel.findOneAndUpdate({ googleId }, { email, username }, { new: true, upsert: true });

        res.status(HttpStatusCodes.OK).json({ message: "User registered or updated successfully", user: user });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Google OAuth failed" });
    }
}

// (DESC) Credentials Auth
export async function CredentialslLogin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "All Fields required" });
            return;
        }

        const user = await UserModel.findOne({ username });

        const isPasswordValid = await bcrypt.compare(password, user?.password || "");

        // Ensure both user and password match
        if (!user || !isPasswordValid) {
            res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: "Invalid credentials" });
            return;
        }

        res.status(HttpStatusCodes.OK).json({ user: { id: user?.id, name: user?.username, email: user?.email } });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Credentialsl Auth failed" });
    }
}

// (DESC) Credentials Register
export async function CredentialsRegister(req: Request, res: Response) {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "All Fields required" });
            return;
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(HttpStatusCodes.CONFLICT).json({ message: "Email Already Exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({ email, username, password: hashedPassword });

        res.status(HttpStatusCodes.CREATED).json({
            message: "User Created Successfully!", user: {
                id: user.id,
                email: user.email,
                name: user.username,
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}