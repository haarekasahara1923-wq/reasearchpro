import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mammoth from "mammoth";
const pdf = require("pdf-parse");

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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let text = "";

        if (file.name.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (file.name.endsWith(".pdf")) {
            const data = await pdf(buffer);
            text = data.text;
        } else if (file.name.endsWith(".txt")) {
            text = buffer.toString("utf-8");
        } else {
            return new NextResponse("Unsupported file format", { status: 400 });
        }

        return NextResponse.json({ text });
    } catch (error) {
        console.error("[EXTRACT_TEXT_ERROR]", error);
        return new NextResponse("Internal Error during file parsing", { status: 500 });
    }
}
