import { NextResponse } from "next/server";
import { searchCitations } from "@/lib/citations";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");

        if (!q) {
            return new NextResponse("Query is required", { status: 400 });
        }

        const results = await searchCitations(q);
        return NextResponse.json(results);
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
