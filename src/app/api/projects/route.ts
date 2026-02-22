import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await req.json();
        const { title, type, field, degreeLevel } = body;

        if (!title || !type || !field) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Define default sections based on type
        let sections: { title: string, content: string }[] = [];

        switch (type) {
            case "SYNOPSIS":
                sections = [
                    { title: "Introduction", content: "" },
                    { title: "Problem Statement", content: "" },
                    { title: "Objectives", content: "" },
                    { title: "Methodology Plan", content: "" },
                    { title: "Expected Outcomes", content: "" },
                    { title: "Bibliography", content: "" },
                ];
                break;
            case "INTERNSHIP_REPORT":
                sections = [
                    { title: "Introduction", content: "" },
                    { title: "Company Profile", content: "" },
                    { title: "Task Performed", content: "" },
                    { title: "Learning Outcomes", content: "" },
                    { title: "Conclusion", content: "" },
                    { title: "Certificate/Appendices", content: "" },
                ];
                break;
            case "RESEARCH_PAPER":
            case "REVIEW":
                sections = [
                    { title: "Abstract", content: "" },
                    { title: "Introduction", content: "" },
                    { title: "Key Keywords", content: "" },
                    { title: "Materials and Methods", content: "" },
                    { title: "Results & Discussion", content: "" },
                    { title: "Conclusion", content: "" },
                    { title: "References", content: "" },
                ];
                break;
            case "DISSERTATION":
                sections = [
                    { title: "Front Matter", content: "" },
                    { title: "Abstract", content: "" },
                    { title: "Chapters / Body", content: "" },
                    { title: "Appendices", content: "" },
                    { title: "Bibliography", content: "" },
                ];
                break;
            default: // PHD and THESIS
                sections = [
                    { title: "Abstract", content: "" },
                    { title: "Introduction", content: "" },
                    { title: "Literature Review", content: "" },
                    { title: "Methodology", content: "" },
                    { title: "Data Analysis", content: "" },
                    { title: "Results", content: "" },
                    { title: "Discussion", content: "" },
                    { title: "Conclusion", content: "" },
                    { title: "References", content: "" },
                ];
        }

        const project = await prisma.project.create({
            data: {
                userId,
                title,
                type,
                field,
                degreeLevel: degreeLevel || "PhD",
                sections: {
                    create: sections
                }
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("[PROJECTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const projects = await prisma.project.findMany({
            where: {
                userId,
            },
            include: {
                _count: {
                    select: { sections: true }
                }
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("[PROJECTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
