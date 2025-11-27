import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const questions = await prisma.question.findMany({
            where: { lessonId },
            include: {
                options: {
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { order: "asc" },
        });

        // For learners, we might want to hide isCorrect if we were doing server-side grading only,
        // but for immediate feedback, sending it is fine or we can strip it and check on submit.
        // For now, let's send it to make the client-side viewer easier to build.
        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lessonId } = await params;
        const { questions } = await req.json();

        // Transaction to replace all questions/options
        // This is a simple approach: delete all for this lesson and recreate.
        // For a production app, we might want to update in place to preserve IDs if needed,
        // but for this scope, full replacement is cleaner.

        await prisma.$transaction(async (tx) => {
            // Delete existing
            await tx.question.deleteMany({
                where: { lessonId },
            });

            // Create new
            for (const q of questions) {
                await tx.question.create({
                    data: {
                        lessonId,
                        text: q.text,
                        order: q.order,
                        options: {
                            create: q.options.map((o: any) => ({
                                text: o.text,
                                isCorrect: o.isCorrect,
                            })),
                        },
                    },
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Quiz save error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
