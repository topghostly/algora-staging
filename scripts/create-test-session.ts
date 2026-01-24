import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Get Admin (Tutor)
  const admin = await prisma.user.findUnique({
    where: { email: "admin@algora.ng" },
  });

  if (!admin) {
    console.error("Admin not found. Run seed first?");
    return;
  }

  // 2. Create Session
  const session = await prisma.tutorSession.create({
    data: {
      title: "Test Mentorship Session",
      type: "ONE_ON_ONE",
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000), // +1 hour
      tutorId: admin.id,
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
  });
  console.log("Created session:", session.id);

  // 3. Update Test User Credits
  const testUser = await prisma.user.findUnique({
    where: { email: "testuser@example.com" },
  });

  if (testUser) {
    await prisma.user.update({
      where: { id: testUser.id },
      data: { credits1on1: 5, subscriptionTier: "PRO_PLUS" },
    });
    console.log("Updated test user credits.");
  } else {
    console.log("Test user not found. Please register first.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
