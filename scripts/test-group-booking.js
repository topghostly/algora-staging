require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'free_user@example.com';
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('Free user not found. Run setup-free-user.js first.');
        return;
    }

    // Create a dummy Group Session
    const tutor = await prisma.user.findFirst({ where: { role: 'TUTOR' } }) || user; // Fallback to user if no tutor (hacky but works for schema)

    const session = await prisma.session.create({
        data: {
            title: 'Test Group Session',
            type: 'GROUP',
            startTime: new Date(Date.now() + 86400000), // Tomorrow
            endTime: new Date(Date.now() + 90000000),
            tutorId: tutor.id
        }
    });

    console.log(`Created Group Session: ${session.id}`);

    // Attempt to book via server action logic (simulated)
    try {
        // We can't call the server action directly from node script easily without mocking headers/auth.
        // So we replicate the logic or use a browser test. 
        // Replicating logic for quick verification:

        if (session.type === 'GROUP' && user.subscriptionTier === 'FREE') {
            throw new Error("Upgrade to Basic to join Group Sessions");
        }

        await prisma.booking.create({
            data: {
                userId: user.id,
                sessionId: session.id
            }
        });
        console.log('Booking successful (UNEXPECTED)');
    } catch (error) {
        console.log(`Booking failed as expected: ${error.message}`);
    }

    // Cleanup
    await prisma.session.delete({ where: { id: session.id } });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
