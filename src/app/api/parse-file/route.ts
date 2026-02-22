import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as mammoth from "mammoth";

export const dynamic = "force-dynamic";

// Polyfill for DOMMatrix which is sometimes expected by internal PDF.js bundled with pdf-parse
if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {
        constructor() { }
    };
}

export async function GET() {
    return NextResponse.json({ status: "active", message: "Extract Text API" });
}

export async function POST(req: Request) {
    console.log("[PARSE_FILE] Request started");
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
        console.log(`[PARSE_FILE] Processing: ${fileName} (${file.size} bytes)`);

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        if (fileName.endsWith(".docx")) {
            console.log("[PARSE_FILE] Parsing DOCX");
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (fileName.endsWith(".pdf")) {
            console.log("[PARSE_FILE] Parsing PDF");
            // Lazy load pdf-parse only when needed to avoid top-level crashes
            const pdf = require("pdf-parse");
            const data = await pdf(buffer);
            text = data.text;
        } else if (fileName.endsWith(".txt")) {
            console.log("[PARSE_FILE] Parsing TXT");
            text = buffer.toString("utf-8");
        } else {
            return new NextResponse("Unsupported format", { status: 400 });
        }

        console.log(`[PARSE_FILE] Success. Extracted ${text?.length || 0} chars`);
        return NextResponse.json({ text: (text || "").trim() });
    } catch (error: any) {
        console.error("[PARSE_FILE_ERROR]", error);
        // Return a more detailed error to help debugging
        return new NextResponse(JSON.stringify({
            error: "Extraction failed",
            details: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
