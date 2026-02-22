import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { query } = await req.json();

        if (!query) {
            return new NextResponse("Query is required", { status: 400 });
        }

        const prompt = `Find 3-5 real or highly plausible research papers for the topic: "${query}". 
        For each paper, provide:
        - Title
        - Authors
        - Year (between 2018-2024)
        - A concise abstract (2-3 sentences)
        - A mock or real URL
        
        Return the response in this exact JSON format:
        {
            "papers": [
                {
                    "title": "...",
                    "authors": "...",
                    "year": "...",
                    "abstract": "...",
                    "url": "..."
                }
            ]
        }`;

        const results = await generateWithFallback(prompt, "You are an academic librarian helping students find relevant literature.", true);

        return NextResponse.json(results);
    } catch (error) {
        console.error("[AI_EXPLORE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
