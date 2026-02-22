import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as mammoth from "mammoth";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ status: "active", message: "Parse File API (DOCX/TXT)" });
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const fileName = file.name.toLowerCase();
        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        if (fileName.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = (result.value || "").trim();
        } else if (fileName.endsWith(".txt")) {
            text = buffer.toString("utf-8").trim();
        } else {
            return new NextResponse("Unsupported format. Use DOCX or TXT.", { status: 400 });
        }

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("[PARSE_FILE_ERROR]", error);
        return new NextResponse(JSON.stringify({
            error: "Extraction failed",
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
