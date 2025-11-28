import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma Client...');
    try {
        // Just try to find a user and select the image field.
        // If the field doesn't exist in the client's type definition or runtime, this might fail or show it as undefined.
        // Actually, to test if the client *allows* the argument, we should try an update (mock ID).
        // But we don't want to actually mess up data.
        // Let's just inspect the dmmf (internal model definition) if possible, or just try a findFirst with select.

        // Using $queryRaw is a way to bypass client validation, but we want to test client validation.
        // Let's try to update a non-existent user. The error "Record to update not found" is success (client accepted the arg).
        // The error "Unknown argument" is failure.

        await prisma.user.update({
            where: { id: 'non-existent-id' },
            data: {
                image: 'test-image-string'
            }
        });
    } catch (e: any) {
        if (e.message.includes('Record to update not found')) {
            console.log('SUCCESS: Prisma Client accepted the "image" field (User not found, which is expected).');
        } else if (e.message.includes('Unknown argument')) {
            console.log('FAILURE: Prisma Client DOES NOT know about the "image" field.');
            console.error(e.message);
        } else {
            console.log('OTHER ERROR:', e.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
