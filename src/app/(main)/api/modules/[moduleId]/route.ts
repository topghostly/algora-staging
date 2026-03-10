import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromS3 } from "@/lib/s3";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await params;
    const { title, order } = await req.json();

    const module = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title,
        order,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await params;

    // Cleanup S3 assets for all lessons in this module
    const moduleWithLessons = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        lessons: {
          select: { contentUrl: true, type: true },
        },
      },
    });

    if (moduleWithLessons) {
      for (const lesson of moduleWithLessons.lessons) {
        if (lesson.contentUrl && lesson.type === "TEXT") {
          await deleteFromS3(lesson.contentUrl);
        }
      }
    }

    await prisma.module.delete({
      where: { id: moduleId },
    });

    return NextResponse.json({ message: "Module deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
