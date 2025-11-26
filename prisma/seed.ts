import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    // Create Admin User
    const adminPassword = await hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@algora.ng" },
        update: {},
        create: {
            email: "admin@algora.ng",
            name: "Algora Admin",
            passwordHash: adminPassword,
            role: "ADMIN",
        },
    });
    console.log({ admin });

    // Create a Sample Track
    const track = await prisma.track.create({
        data: {
            title: "Frontend Development Mastery",
            description: "Master modern frontend development with React, Next.js, and TypeScript. Build real-world projects and get job-ready.",
            published: true,
            modules: {
                create: [
                    {
                        title: "Introduction to Web Development",
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: "How the Web Works",
                                    type: "VIDEO",
                                    contentUrl: "https://www.youtube.com/embed/hQAHSlTtcmY", // Placeholder
                                    order: 1,
                                },
                                {
                                    title: "Setting up your Environment",
                                    type: "TEXT",
                                    textContent: "## VS Code Setup\n\n1. Download VS Code\n2. Install Extensions...",
                                    order: 2,
                                },
                            ],
                        },
                    },
                    {
                        title: "HTML & CSS Fundamentals",
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: "HTML5 Semantic Elements",
                                    type: "VIDEO",
                                    contentUrl: "https://www.youtube.com/embed/DefJ87r5IBw", // Placeholder
                                    order: 1,
                                },
                                {
                                    title: "CSS Box Model",
                                    type: "VIDEO",
                                    contentUrl: "https://www.youtube.com/embed/rIO5326GpQk", // Placeholder
                                    order: 2,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log({ track });

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
