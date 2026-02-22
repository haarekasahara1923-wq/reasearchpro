import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as mammoth from "mammoth";

// Dynamic require to bypass ESM export checks during build
const pdf = require("pdf-parse");

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ status: "active", message: "Extract Text API" });
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

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (fileName.endsWith(".pdf")) {
            const data = await pdf(buffer);
            text = data.text;
        } else if (fileName.endsWith(".txt")) {
            text = buffer.toString("utf-8");
        } else {
            return new NextResponse("Unsupported format", { status: 400 });
        }

        return NextResponse.json({ text: text.trim() });
    } catch (error: any) {
        console.error("Extraction error:", error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
