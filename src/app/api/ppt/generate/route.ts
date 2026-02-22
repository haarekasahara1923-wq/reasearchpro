import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const { topic, pages = 10, type = "thesis", projectId } = await req.json();

        if (!topic && !projectId) {
            return new NextResponse("Topic or Project ID is required", { status: 400 });
        }

        let context = "";
        let finalTopic = topic;

        if (projectId) {
            const project = await prisma.project.findUnique({
                where: { id: projectId, userId },
                include: { sections: true }
            });

            if (project) {
                finalTopic = project.title;
                context = project.sections
                    .map(s => `Section: ${s.title}\nContent: ${s.content.substring(0, 500)}`)
                    .join("\n\n");
            }
        }

        const typeContext = type === "thesis"
            ? "academic dissertation/thesis"
            : "professional research paper/journal";

        const prompt = `Act as an academic presentation expert. Create a detailed slide-by-slide outline for a ${typeContext} presentation.
        Target Topic: "${finalTopic}"
        
        ${context ? `Use the following project content as the primary source of information:\n${context}` : "Generate professional content based on the topic."}

        Generate exactly ${pages} slides.
        Include elements like: Title Slide, Introduction, Literature Review, Methodology, Key Findings, Discussion, and Conclusion.
        
        Return ONLY a JSON array of objects: [{"title": "Slide Title", "content": ["Bullet point 1", "...", "..."]}].
        Make the content high-quality, technically accurate, and professional.`;

        const slides = await generateWithFallback(
            prompt,
            "Professional Presentation Designer. Output strictly JSON array.",
            true
        );

        return NextResponse.json(slides);
    } catch (error: any) {
        console.error("[PPT_GEN_ERROR]", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
