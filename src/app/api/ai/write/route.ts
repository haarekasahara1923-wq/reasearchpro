import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateWithFallback } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await req.json();
        const { topic, sectionTitle, currentContent, field, degreeLevel, instructions } = body;

        if (!topic) {
            return new NextResponse("Missing topic", { status: 400 });
        }

        const systemPrompt = `You are a professional academic research assistant specializing in ${field || 'academic writing'}. 
        Your goal is to help write a ${sectionTitle} for a research paper titled "${topic}" at ${degreeLevel || 'Masters'} level.
        Maintain a formal, academic tone. Use citations where appropriate (mock citations like [1, 2]).`;

        const prompt = `Write or expand the "${sectionTitle}" section for the research: "${topic}".
        ${instructions ? `Instructions: ${instructions}` : ""}
        ${currentContent ? `Current content to improve/expand: ${currentContent}` : "Start writing the section from scratch."}
        
        Requirements:
        - Academic language
        - Minimum 300 words
        - Structured with subheadings if needed
        - No conversational filler at start/end.`;

        const result = await generateWithFallback(prompt, systemPrompt, false);

        return NextResponse.json({ content: result });
    } catch (error) {
        console.error("[AI_WRITE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
