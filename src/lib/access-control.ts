import { prisma } from "@/lib/prisma";

export async function getVideoUsage(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const videoProgressCount = await prisma.progress.count({
    where: {
      userId,
      lesson: {
        type: "VIDEO",
      },
      completedAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  return videoProgressCount;
}

export async function canAccessLesson(
  userId: string,
  lessonType: "VIDEO" | "TEXT" | "QUIZ",
  userTier: "FREE" | "BASIC" | "PRO_LITE" | "PRO_PLUS"
) {
  if (userTier !== "FREE") return true;
  if (lessonType !== "VIDEO") return true;

  const usage = await getVideoUsage(userId);
  return usage < 3;
}
