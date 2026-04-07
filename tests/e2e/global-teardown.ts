import { PrismaClient } from "@prisma/client";
import { purgeTestData } from "./global-setup";

const prisma = new PrismaClient();

async function globalTeardown() {
  await purgeTestData();
  await prisma.$disconnect();
}

export default globalTeardown;
