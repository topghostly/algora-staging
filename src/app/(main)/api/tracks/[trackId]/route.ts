import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromS3 } from "@/lib/s3";
import { revalidateTag } from "next/cache";

export const revalidate = 3600;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  try {
    const { trackId } = await params;
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trackId } = await params;
    const { title, description, published } = await req.json();

    const track = await prisma.track.update({
      where: { id: trackId },
      data: {
        title,
        description,
        published,
      },
    });

    revalidateTag("tracks", "max");
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trackId } = await params;

    // Fetch all modules and lessons to clean up S3 assets and cascade deletes
    const trackWithData = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        modules: {
          include: {
            lessons: {
              select: { id: true, contentUrl: true, type: true },
            },
          },
        },
      },
    });

    if (trackWithData) {
      const allLessons = trackWithData.modules.flatMap((m) => m.lessons);
      const lessonIds = allLessons.map((l) => l.id);
      const moduleIds = trackWithData.modules.map((m) => m.id);

      // Clean up S3 assets
      for (const lesson of allLessons) {
        if (lesson.contentUrl && lesson.type === "TEXT") {
          await deleteFromS3(lesson.contentUrl);
        }
      }

      // Delete child records before parents
      if (lessonIds.length > 0) {
        await prisma.progress.deleteMany({ where: { lessonId: { in: lessonIds } } });
        await prisma.lesson.deleteMany({ where: { moduleId: { in: moduleIds } } });
      }
      if (moduleIds.length > 0) {
        await prisma.certificate.deleteMany({ where: { moduleId: { in: moduleIds } } });
        await prisma.module.deleteMany({ where: { trackId } });
      }
      await prisma.enrollment.deleteMany({ where: { trackId } });
      await prisma.badge.deleteMany({ where: { trackId } });
      await prisma.certificate.deleteMany({ where: { trackId } });
    }

    await prisma.track.delete({
      where: { id: trackId },
    });

    revalidateTag("tracks", "max");
    return NextResponse.json({ message: "Track deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
