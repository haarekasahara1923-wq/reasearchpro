import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateTopics } from "@/lib/groq";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { field, degreeLevel } = await req.json();

        if (!field || !degreeLevel) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const topics = await generateTopics(field, degreeLevel);

        return NextResponse.json(topics);
    } catch (error) {
        console.error("[TOPICS_GENERATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
