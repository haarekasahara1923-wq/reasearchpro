import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: true
    });

    // Protect all dashboard routes
    if (!token && (
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/thesis-builder") ||
        req.nextUrl.pathname.startsWith("/topic-generator") ||
        req.nextUrl.pathname.startsWith("/settings")
    )) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/topic-generator/:path*",
        "/thesis-builder/:path*",
        "/literature-explorer/:path*",
        "/plagiarism-checker/:path*",
        "/citation-manager/:path*",
        "/cover-designer/:path*",
        "/ppt-generator/:path*",
        "/subscription/:path*",
        "/settings/:path*",
    ],
};
