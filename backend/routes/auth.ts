import express from "express";
import { GoogleOAuth, CredentialslLogin, CredentialsRegister } from "../controllers/auth";

const router = express.Router();

// Google OAuth Registration & login
router.post("/google/Oauth", GoogleOAuth);

// Credentials Auth
router.post("/credentials/auth", CredentialslLogin);

// Credentials Register
router.post("/credentials/register", CredentialsRegister);

export default router;