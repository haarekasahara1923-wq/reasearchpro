import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { topic, pages = 10 } = await req.json();

        if (!topic) {
            return new NextResponse("Topic is required", { status: 400 });
        }

        const prompt = `Act as an academic presentation expert. Create a detailed slide-by-slide outline for a presentation on the topic: "${topic}".
        Generate exactly ${pages} slides.
        Include:
        1. Title Slide (Title, Subtitle)
        2. Introduction
        3. Literature Review / Context
        4. Problem Statement / Research Gaps
        5. Methodology
        6. Key Findings / Proposed Solutions (2-3 slides)
        7. Discussion
        8. Conclusion
        9. References Placeholder
        
        Return ONLY a JSON array of objects where each object is: {"title": "Slide Title", "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]}.
        Make the content high-quality, academic, and professional.`;

        const slides = await generateWithFallback(
            prompt,
            "Professional Presentation Designer. Output strictly JSON array of slides.",
            true
        );

        return NextResponse.json(slides);
    } catch (error: any) {
        console.error("[PPT_GEN_ERROR]", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
