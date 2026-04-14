import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.tutorSession.findMany({
    where: {
      status: "PENDING",
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
    }
  });

  console.log("Current time (Node.js new Date()):", new Date());
  console.log("Current time (ISO):", new Date().toISOString());

  for (const s of sessions) {
    console.log(`Session ${s.id} - ${s.title}`);
    console.log(`  start: ${s.startTime.toISOString()}`);
    console.log(`  end:   ${s.endTime.toISOString()}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
