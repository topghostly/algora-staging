import { prisma } from "@/lib/prisma";

export type ActivityAction = 
  | "USER_REGISTERED"
  | "USER_LOGIN"
  | "PROFILE_UPDATED"
  | "ROLE_UPDATED"
  | "ROLE_SELECTED"
  | "USER_DISABLED"
  | "USER_SUSPENDED"
  | "USER_UNSUSPENDED"
  | "TRACK_CREATED"
  | "TRACK_UPDATED"
  | "TRACK_DELETED"
  | "SESSION_CREATED"
  | "SESSION_DELETED"
  | "LESSON_COMPLETED";

interface LogActivityOptions {
  userId?: string;
  action: ActivityAction;
  entityType?: string;
  entityId?: string;
  metadata?: any;
}

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  metadata,
}: LogActivityOptions) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // We don't want to throw here to avoid breaking the main business logic
  }
}
