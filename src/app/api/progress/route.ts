import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { lessonId, completed } = await req.json();

        if (!lessonId) {
            return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
        }

        if (completed) {
            // Mark as complete
            await prisma.progress.upsert({
                where: {
                    userId_lessonId: {
                        userId: session.user.id,
                        lessonId: lessonId,
                    },
                },
                update: {
                    completedAt: new Date(),
                },
                create: {
                    userId: session.user.id,
                    lessonId: lessonId,
                    completedAt: new Date(),
                },
            });
        } else {
            // Mark as incomplete (optional, if we want to allow un-completing)
            await prisma.progress.deleteMany({
                where: {
                    userId: session.user.id,
                    lessonId: lessonId,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Progress update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
