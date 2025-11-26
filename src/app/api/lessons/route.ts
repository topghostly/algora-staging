import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, moduleId, type, contentUrl, textContent, order } = await req.json();

        if (!title || !moduleId || !type) {
            return NextResponse.json(
                { error: "Title, moduleId, and type are required" },
                { status: 400 }
            );
        }

        const lesson = await prisma.lesson.create({
            data: {
                title,
                moduleId,
                type,
                contentUrl,
                textContent,
                order: order || 0,
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
