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

        const project = await prisma.project.create({
            data: {
                userId,
                title,
                type,
                field,
                degreeLevel: degreeLevel || "Masters",
                sections: {
                    create: [
                        { title: "Abstract", content: "" },
                        { title: "Introduction", content: "" },
                        { title: "Literature Review", content: "" },
                        { title: "Methodology", content: "" },
                        { title: "Results", content: "" },
                        { title: "Discussion", content: "" },
                        { title: "Conclusion", content: "" },
                        { title: "References", content: "" },
                    ]
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
