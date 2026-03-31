import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const getCachedTutorSessions = (userId: string) =>
  unstable_cache(
    () =>
      prisma.tutorSession.findMany({
        where: { tutorId: userId },
        orderBy: { startTime: "desc" },
        include: {
          bookings: {
            include: { user: true },
          },
        },
      }),
    [`tutor-sessions-${userId}`],
    { revalidate: 60, tags: [`tutor-sessions-${userId}`] },
  )();
