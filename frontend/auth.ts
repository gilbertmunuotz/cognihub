import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SERVER_URI } from "./constants/constant";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Google Providers
        GoogleProvider({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent", // Force consent screen for debugging
                    access_type: "offline", // Request refresh token
                    response_type: "code",
                },
            },
        }),

        // Local Providers
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Username and password are required");
                }

                try {
                    const response = await axios.post(`${SERVER_URI}/api/v1/auth/credentials/auth`, {
                        username: credentials.username,
                        password: credentials.password,
                    }, {
                        headers: { "Content-Type": "application/json" },
                    });

                    const { user: userData } = response.data;
                    if (response.status === 200 || userData) {
                        return {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Credentials login error:", error);
                    throw new Error("Invalid credentials");
                }
            }
        })
    ],
    session: {
        strategy: "jwt" // Use JWT for session management
    },
    callbacks: {
        async jwt({ token, account, profile, user }) {
            // Google OAuth
            if (account && profile) {
                token.accessToken = account.access_token; // Google access token
                token.id = profile?.sub ?? undefined; // Google user ID (sub)

                // Call backend API & send payload
                const payload = { googleId: profile.sub, email: profile.email, username: profile.name, };

                try {
                    const response = await axios.post(
                        `${SERVER_URI}/api/v1/auth/google/OAuth`, payload,
                        { headers: { "Content-Type": "application/json" }, }
                    );
                    if (response.status !== 200) {
                        console.error("Failed to save user to backend:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error sending user data to backend:", error);
                }
            }

            // Credentials login
            if (user) {
                token.id = user.id
            }
            return token;
        },

        async session({ session, token }) {
            // Pass access token and ID to the session
            if (token.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login"
    }
});