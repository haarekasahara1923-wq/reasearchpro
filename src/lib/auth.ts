import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user?.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error("Invalid credentials");
                }

                // Return only the minimal data needed — no base64 images
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? "Researcher",
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        // Keep JWT short-lived to reduce token size in cookie
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            // Keep the token minimal: only id, email, name, sub, iat, exp, jti
            return {
                id: token.id,
                sub: token.sub,
                email: token.email,
                name: token.name,
                iat: token.iat,
                exp: token.exp,
                jti: token.jti,
            };
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    // Use NextAuth default cookie names so middleware can find the token
    // Do NOT override cookie names — custom names break getToken() in middleware
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
