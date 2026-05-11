import dotenv from "dotenv";
import process from "process";

dotenv.config();

const env = (key: string, fallback: string): string => {
    const v = process.env[key];
    return v !== undefined && v !== "" ? v : fallback;
};

const resolvedPort = Number(env("PORT", "8000"));

export const PORT = Number.isFinite(resolvedPort) && resolvedPort > 0 ? resolvedPort : 8000;

export const CLIENT_URI = env("CLIENT_URI", "http://localhost:3000");

export const OLLAMA_URL = env("OLLAMA_URL", "http://localhost:11434/api/generate");

/** Default local Ollama model (override via OLLAMA_MODEL in `.env`). */
export const OLLAMA_MODEL = env("OLLAMA_MODEL", "qwen2.5:7b");

