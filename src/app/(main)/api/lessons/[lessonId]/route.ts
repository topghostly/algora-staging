import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromS3 } from "@/lib/s3";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;
    const { title, type, contentUrl, textContent, order } = await req.json();

    // Handle S3 asset cleanup if PDF is replaced
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { contentUrl: true, type: true },
    });

    if (
      existingLesson?.contentUrl &&
      existingLesson.contentUrl !== contentUrl &&
      existingLesson.type === "TEXT"
    ) {
      await deleteFromS3(existingLesson.contentUrl);
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        type,
        contentUrl,
        textContent,
        order,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;

    // Cleanup S3 asset before deleting
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { contentUrl: true, type: true },
    });

    if (lesson?.contentUrl && lesson.type === "TEXT") {
      await deleteFromS3(lesson.contentUrl);
    }

    // Delete related progress records first
    await prisma.progress.deleteMany({
      where: { lessonId },
    });

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ message: "Lesson deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
