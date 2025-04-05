import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**** Extend the built-in session types ****/
    interface Session {
        accessToken?: string; // Google access token
        user: {
            id?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    /**** Extend the built-in JWT types ****/
    interface JWT {
        accessToken?: string; // Google access token
        id?: string; // User ID
    }
}