import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    console.log("Middleware - Token:", token); 

    if (!token && pathname !== "/auth/login") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/home"], // Only protect /home
};