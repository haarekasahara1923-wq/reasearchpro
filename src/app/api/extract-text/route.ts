import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Use require for CJS libraries to avoid ESM/CJS interop issues in Next.js
const mammoth = require("mammoth");
const pdf = require("pdf-parse");

export async function GET() {
    return NextResponse.json({ message: "Extract Text API is live. Use POST to upload files." });
}

export async function POST(req: Request) {
    console.log("[EXTRACT_TEXT] Request received");
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            console.error("[EXTRACT_TEXT] Unauthorized access attempt");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("[EXTRACT_TEXT] No file found in form data");
            return new NextResponse("No file uploaded", { status: 400 });
        }

        console.log(`[EXTRACT_TEXT] Parsing file: ${file.name}, Size: ${file.size}`);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let text = "";

        if (file.name.toLowerCase().endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (file.name.toLowerCase().endsWith(".pdf")) {
            const data = await pdf(buffer);
            text = data.text;
        } else if (file.name.toLowerCase().endsWith(".txt")) {
            text = buffer.toString("utf-8");
        } else {
            return new NextResponse("Unsupported file format. Please use PDF, DOCX, or TXT.", { status: 400 });
        }

        console.log(`[EXTRACT_TEXT] Successfully extracted ${text.length} characters`);
        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("[EXTRACT_TEXT_ERROR]", error);
        return new NextResponse(`Internal Error: ${error.message || "Unknown error"}`, { status: 500 });
    }
}
