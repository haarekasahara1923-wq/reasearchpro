import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const project = await prisma.project.findUnique({
            where: {
                id: params.projectId,
                userId,
            },
            include: {
                sections: {
                    orderBy: {
                        createdAt: "asc",
                    }
                }
            },
        });

        if (!project) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("[PROJECT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await req.json();
        const { title, sectionId, content } = body;

        if (sectionId && content !== undefined) {
            // Update specific section
            const section = await prisma.section.update({
                where: {
                    id: sectionId,
                    projectId: params.projectId,
                },
                data: {
                    content,
                },
            });
            return NextResponse.json(section);
        }

        // Update project metadata
        const project = await prisma.project.update({
            where: {
                id: params.projectId,
                userId,
            },
            data: {
                title,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("[PROJECT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
