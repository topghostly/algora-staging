import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { trackId: string } }
) {
    try {
        const track = await prisma.track.findUnique({
            where: { id: params.trackId },
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
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { trackId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, published } = await req.json();

        const track = await prisma.track.update({
            where: { id: params.trackId },
            data: {
                title,
                description,
                published,
            },
        });

        return NextResponse.json(track);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { trackId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.track.delete({
            where: { id: params.trackId },
        });

        return NextResponse.json({ message: "Track deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
