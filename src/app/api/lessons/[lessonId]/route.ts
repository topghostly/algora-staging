import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, type, contentUrl, textContent, order } = await req.json();

        const lesson = await prisma.lesson.update({
            where: { id: params.lessonId },
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
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.lesson.delete({
            where: { id: params.lessonId },
        });

        return NextResponse.json({ message: "Lesson deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
