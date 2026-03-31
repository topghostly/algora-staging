import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";
import { profileUpdateSchema } from "@/lib/schemas";
import { ZodError } from "zod";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image } = profileUpdateSchema.parse(body);

    let imageUrl = image;

    // If image is a Base64 string (new upload), upload to S3
    if (image && image.startsWith("data:image")) {
      // 1. Extract content type and base64 data
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { message: "Invalid image format" },
          { status: 400 },
        );
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // 2. Validate size (max 2MB)
      if (buffer.length > 2 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Image is too large (max 2MB)" },
          { status: 400 },
        );
      }

      // 3. Generate unique filename
      const extension = contentType.split("/")[1];
      const fileName = `profiles/${session.user.id}-${uuidv4()}.${extension}`;

      // 4. Upload to S3
      imageUrl = await uploadToS3(buffer, fileName, contentType);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        image: imageUrl,
      },
    });

    await logActivity({
      userId: session.user.id,
      action: "PROFILE_UPDATED",
      entityType: "USER",
      entityId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        image: updatedUser.image,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
