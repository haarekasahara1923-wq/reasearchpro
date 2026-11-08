import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateWithFallback } from "@/lib/ai";

const SECTION_TEMPLATES: Record<string, string[]> = {
    SYNOPSIS: ["Introduction", "Problem Statement", "Objectives", "Methodology Plan", "Expected Outcomes", "Bibliography"],
    THESIS: ["Abstract", "Introduction", "Literature Review", "Methodology", "Data Analysis", "Results", "Discussion", "Conclusion", "References"],
    PHD: ["Abstract", "Introduction", "Literature Review", "Methodology", "Data Analysis", "Results", "Discussion", "Conclusion", "References"],
    RESEARCH_PAPER: ["Abstract", "Introduction", "Key Keywords", "Materials and Methods", "Results & Discussion", "Conclusion", "References"],
    REVIEW: ["Abstract", "Introduction", "Key Keywords", "Materials and Methods", "Results & Discussion", "Conclusion", "References"],
    DISSERTATION: ["Front Matter", "Abstract", "Chapters / Body", "Appendices", "Bibliography"],
    INTERNSHIP_REPORT: ["Introduction", "Company Profile", "Task Performed", "Learning Outcomes", "Conclusion", "Certificate/Appendices"],
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { content, type } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const sections = SECTION_TEMPLATES[type] || SECTION_TEMPLATES["THESIS"];

        const systemPrompt = `You are an expert academic document structuring assistant. Your job is to analyze raw thesis/research content and organize it into proper academic sections. Return ONLY valid JSON.`;

        const prompt = `Analyze the following raw academic content and organize it into these sections: ${sections.join(", ")}.

RAW CONTENT:
---
${content.substring(0, 8000)}
---

Instructions:
- Extract and assign relevant text to each section
- If a section's content is not found in the raw text, write a brief placeholder noting what should go there
- Maintain academic language and tone
- Each section should have meaningful content (at least 2-3 sentences)

Return ONLY this JSON (no markdown, no explanation):
{
  "sections": [
    ${sections.map(s => `{ "title": "${s}", "content": "..." }`).join(',\n    ')}
  ]
}`;

        const result = await generateWithFallback(prompt, systemPrompt, true);

        if (!result?.sections || !Array.isArray(result.sections)) {
            return NextResponse.json({ error: "AI returned invalid structure" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[AI_STRUCTURE_POST]", error);
        return NextResponse.json(
            { error: "Structuring failed", message: error.message },
            { status: 500 }
        );
    }
}
