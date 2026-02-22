import { NextResponse } from "next/server";
import { lookupDOI } from "@/lib/citations";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const doi = searchParams.get("doi");

        if (!doi) {
            return new NextResponse("DOI is required", { status: 400 });
        }

        const result = await lookupDOI(doi);
        return NextResponse.json(result);
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
