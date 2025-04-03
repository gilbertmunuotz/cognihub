import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SERVER_URI } from "@/constants/constant";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Local Credentials Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("All fields are required");
                }

                try {
                    const response = await axios.post(`${SERVER_URI}/api/v1/auth/local/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    }, {
                        headers: { "Content-Type": "application/json" },
                    });

                    const { token, user } = response.data;

                    // Return user object with token for Auth.js to manage
                    return { name: user.name, email: user.email, token };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    // Throw the exact backend error message
                    console.error("Auth error:", error);
                    return null; // Return null instead of throwing
                }
            },
        }),
    ],
    trustHost: true,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.user) {
                session.user.id = token.id;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
});