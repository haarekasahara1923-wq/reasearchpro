export { default } from "next-auth/middleware";

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
