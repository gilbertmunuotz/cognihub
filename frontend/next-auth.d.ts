import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    /**
     * Extend the built-in session types
     */
    interface Session {
        user: {
            id: string
            name: string
            email: string
            // Add any other properties you need
        } & DefaultSession["user"]
    }

    /**
     * Extend the built-in user types
     */
    interface User extends DefaultUser {
        id: string
        name?: string
        email?: string
        image?: string
        // Add any other properties you need
    }
}

declare module "next-auth/jwt" {
    /**
     * Extend the built-in JWT types
     */
    interface JWT {
        id: string
        name?: string
        email?: string
        picture?: string
        // This is important for your session callback
        user?: {
            id: string
            name: string
            email: string
            image?: string
            // Add any other properties you need
        }
    }
}