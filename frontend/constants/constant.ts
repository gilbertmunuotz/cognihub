/** Backend origin (REST + Socket.IO). Override with NEXT_PUBLIC_BACKEND_URL in .env.local */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
