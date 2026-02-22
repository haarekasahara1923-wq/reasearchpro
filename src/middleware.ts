import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req: NextRequest) {
        const response = NextResponse.next();

        // PURGE OLD BLOATED COOKIES
        // This force-clears old session cookies that might be stuck in the browser
        // and causing the "Header Too Large" error.
        const cookiesToClear = [
            "next-auth.session-token",
            "next-auth.callback-url",
            "next-auth.csrf-token",
            "rp-session-v1",
            "rp-session-v2",
            "rp-session-v3",
            "rp-session-v4"
        ];

        cookiesToClear.forEach(cookie => {
            if (req.cookies.has(cookie)) {
                response.cookies.delete(cookie);
            }
        });

        return response;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

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
