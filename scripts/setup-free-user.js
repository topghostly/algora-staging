require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'free_user@example.com';
    const password = await bcrypt.hash('password123', 10);

    // Create or update user
    const user = await prisma.user.upsert({
        where: { email },
        update: { subscriptionTier: 'FREE' },
        create: {
            email,
            passwordHash: password,
            name: 'Free User',
            role: 'LEARNER',
            subscriptionTier: 'FREE',
            credits1on1: 0
        }
    });

    console.log(`User created/updated: ${user.email}`);

    // Get 3 video lessons
    const lessons = await prisma.lesson.findMany({
        where: { type: 'VIDEO' },
        take: 3
    });

    if (lessons.length < 3) {
        console.error('Not enough video lessons found to test limit.');
        return;
    }

    // Create progress for these 3 lessons
    for (const lesson of lessons) {
        await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lesson.id
                }
            },
            update: { completedAt: new Date() },
            create: {
                userId: user.id,
                lessonId: lesson.id,
                completedAt: new Date()
            }
        });
        console.log(`Marked lesson ${lesson.title} as completed.`);
    }

    console.log('Setup complete.');

    // Find a 4th video lesson to test access
    let extraLesson = await prisma.lesson.findFirst({
        where: {
            type: 'VIDEO',
            id: { notIn: lessons.map(l => l.id) }
        },
        include: { module: { include: { track: true } } }
    });

    if (!extraLesson) {
        console.log('Creating dummy video lesson for testing...');
        // Need a module first
        const module = await prisma.module.findFirst();
        if (module) {
            extraLesson = await prisma.lesson.create({
                data: {
                    title: 'Dummy Test Video',
                    type: 'VIDEO',
                    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    order: 999,
                    moduleId: module.id
                },
                include: { module: { include: { track: true } } }
            });
        }
    }

    if (extraLesson) {
        console.log(`TEST_URL: http://localhost:3000/tracks/${extraLesson.module.track.id}/lessons/${extraLesson.id}`);
    } else {
        console.log('No 4th video lesson found and could not create one.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
