import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // Let NextAuth auto-detect secureCookie based on request protocol
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Build response — we always continue or redirect
    let response: NextResponse;

    // Protect all dashboard routes
    if (!token && (
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/thesis-builder") ||
        req.nextUrl.pathname.startsWith("/topic-generator") ||
        req.nextUrl.pathname.startsWith("/settings")
    )) {
        response = NextResponse.redirect(new URL("/login", req.url));
    } else {
        response = NextResponse.next();
    }

    // Clear the old stale 'z' cookie that was set by a previous auth config.
    // This was causing the 494 REQUEST_HEADER_TOO_LARGE error.
    if (req.cookies.has("z")) {
        response.cookies.set("z", "", {
            maxAge: 0,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });
    }

    return response;
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
