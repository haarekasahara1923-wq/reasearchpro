import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await req.json();
        const { name, image } = body;

        let finalImageUrl = image;

        // If it's a base64 string, upload to Cloudinary
        if (image && image.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "research-pro-profiles",
            });
            finalImageUrl = uploadResponse.secure_url;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                image: finalImageUrl
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[PROFILE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
