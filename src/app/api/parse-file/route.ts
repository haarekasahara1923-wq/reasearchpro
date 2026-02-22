import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as mammoth from "mammoth";

export const dynamic = "force-dynamic";

// Extended Polyfills to satisfy PDF.js (used by pdf-parse) in Node environment
if (typeof global !== 'undefined') {
    (global as any).DOMMatrix = (global as any).DOMMatrix || class DOMMatrix {
        constructor() { }
        static fromMatrix() { return new DOMMatrix(); }
        static fromFloat32Array() { return new DOMMatrix(); }
        static fromFloat64Array() { return new DOMMatrix(); }
    };
    (global as any).Node = (global as any).Node || class Node { };
    (global as any).Element = (global as any).Element || class Element { };
    (global as any).CharacterData = (global as any).CharacterData || class CharacterData { };
    (global as any).Document = (global as any).Document || class Document { };
}

export async function GET() {
    return NextResponse.json({ status: "active", message: "Enhanced Parse File API" });
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
        } else if (fileName.endsWith(".pdf")) {
            // Defensive loading for pdf-parse
            const pdfLib = require("pdf-parse");

            // Look for the actual parsing function (handles various bundler wraps)
            let parseFunc: any = null;
            if (typeof pdfLib === 'function') {
                parseFunc = pdfLib;
            } else if (pdfLib && typeof pdfLib.default === 'function') {
                parseFunc = pdfLib.default;
            } else if (pdfLib && typeof pdfLib === 'object') {
                // Last ditch effort: scan for any function property
                for (const key of Object.keys(pdfLib)) {
                    if (typeof pdfLib[key] === 'function') {
                        parseFunc = pdfLib[key];
                        break;
                    }
                }
            }

            if (typeof parseFunc !== 'function') {
                throw new Error(`PDF library failure. Available keys: ${Object.keys(pdfLib || {}).join(', ')}`);
            }

            const data = await parseFunc(buffer);
            text = (data.text || "").trim();
        } else if (fileName.endsWith(".txt")) {
            text = buffer.toString("utf-8").trim();
        } else {
            return new NextResponse("Unsupported format", { status: 400 });
        }

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("[PARSE_FILE_ERROR]", error);
        return new NextResponse(JSON.stringify({
            error: "Extraction failed",
            message: error.message,
            type: error.name
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
