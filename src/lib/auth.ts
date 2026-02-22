import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
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
                    where: {
                        email: credentials.email,
                    },
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

                // Return essential fields + image for safety check in JWT
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;

                // SAFELY include image ONLY if it's a short URL
                const userImage = (user as any).image;
                if (userImage && typeof userImage === "string" && !userImage.startsWith("data:")) {
                    token.image = userImage;
                } else {
                    token.image = null;
                }
            }

            if (trigger === "update") {
                if (session?.name) token.name = session.name;
                // Only update image if it's a safe URL coming from Cloudinary
                if (session?.image && typeof session.image === "string" && !session.image.startsWith("data:")) {
                    token.image = session.image;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                session.user.name = token.name as string;
                session.user.image = token.image as string | null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
