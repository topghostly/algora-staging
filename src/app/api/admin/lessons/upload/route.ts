import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToS3 } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { file, contentType, fileName: originalFileName } = await req.json();

    if (!file || !contentType) {
      return NextResponse.json(
        { message: "File and Content Type are required" },
        { status: 400 },
      );
    }

    // Validation: PDF only
    if (contentType !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // Extract base64 data
    const matches = file.match(/^data:application\/pdf;base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        { message: "Invalid PDF format" },
        { status: 400 },
      );
    }
    const base64Data = matches[1];
    const buffer = Buffer.from(base64Data, "base64");

    // Validation: 3MB max
    if (buffer.length > 3 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File is too large (max 3MB)" },
        { status: 400 },
      );
    }

    // Generate unique filename in lesson/ folder
    const extension = "pdf";
    const fileName = `lessons/${uuidv4()}.${extension}`;

    // Upload to S3
    const fileUrl = await uploadToS3(buffer, fileName, contentType);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error: any) {
    console.error("Lesson upload error:", error);
    return NextResponse.json(
      { message: "Internal Server Error: " + error.message },
      { status: 500 },
    );
  }
}
