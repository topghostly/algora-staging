import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_EMAILS = [
  "e2e.learner@test.algora.io",
  "e2e.learner.basic@test.algora.io",
  "e2e.tutor@test.algora.io",
];

/**
 * Wipes all test-owned rows in FK-safe order.
 * Resolves actual user IDs from email so it handles cases where a user
 * has the right email but an unexpected ID (e.g. leftover from a different
 * setup version), ensuring nothing is missed.
 */
export async function purgeTestData() {
  // Resolve actual IDs from the DB — covers both the expected IDs and any
  // legacy rows that share the same email but have a different ID.
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: TEST_EMAILS } },
    select: { id: true },
  });
  const resolvedIds = [
    ...new Set([
      ...existingUsers.map((u) => u.id),
      TEST_IDS.learner,
      TEST_IDS.basicLearner,
      TEST_IDS.tutor,
    ]),
  ];

  await prisma.paymentTransaction.deleteMany({
    where: {
      OR: [
        { reference: TEST_IDS.processedTransaction },
        { userId: { in: resolvedIds } },
      ],
    },
  });
  await prisma.sessionEnrollment.deleteMany({
    where: {
      OR: [
        { sessionId: TEST_IDS.groupSession },
        { userId: { in: resolvedIds } },
      ],
    },
  });
  await prisma.booking.deleteMany({
    where: {
      OR: [
        { tutorSessionId: TEST_IDS.groupSession },
        { userId: { in: resolvedIds } },
      ],
    },
  });
  await prisma.tutorSession.deleteMany({
    where: { tutorId: { in: resolvedIds } },
  });
  await prisma.progress.deleteMany({
    where: { userId: { in: resolvedIds } },
  });
  await prisma.enrollment.deleteMany({
    where: { userId: { in: resolvedIds } },
  });
  await prisma.lesson.deleteMany({
    where: { id: { in: [TEST_IDS.videoLesson, TEST_IDS.textLesson] } },
  });
  await prisma.module.deleteMany({ where: { id: TEST_IDS.module } });
  await prisma.track.deleteMany({ where: { id: TEST_IDS.track } });

  // Delete by email — not ID — so legacy rows with unexpected IDs are caught.
  await prisma.user.deleteMany({
    where: { email: { in: TEST_EMAILS } },
  });
}

export const TEST_IDS = {
  learner: "e2e-user-learner-001",
  basicLearner: "e2e-user-basic-learner-001",
  tutor: "e2e-user-tutor-001",
  track: "e2e-track-001",
  module: "e2e-module-001",
  videoLesson: "e2e-lesson-video-001",
  textLesson: "e2e-lesson-text-001",
  groupSession: "e2e-session-group-001",
  processedTransaction: "e2e-txn-processed-001",
};

export const TEST_USERS = {
  learner: {
    id: TEST_IDS.learner,
    email: "e2e.learner@test.algora.io",
    password: "E2eTestPass123!",
    name: "E2E Learner",
    role: "LEARNER" as const,
    subscriptionTier: "FREE" as const,
  },
  basicLearner: {
    id: TEST_IDS.basicLearner,
    email: "e2e.learner.basic@test.algora.io",
    password: "E2eTestPass123!",
    name: "E2E Basic Learner",
    role: "LEARNER" as const,
    subscriptionTier: "BASIC" as const,
  },
  tutor: {
    id: TEST_IDS.tutor,
    email: "e2e.tutor@test.algora.io",
    password: "E2eTestPass123!",
    name: "E2E Tutor",
    role: "TUTOR" as const,
    subscriptionTier: "FREE" as const,
  },
};

async function globalSetup() {
  // Wipe any leftover data from interrupted previous runs before seeding.
  await purgeTestData();

  const passwordHash = await bcrypt.hash(TEST_USERS.learner.password, 10);

  // ── Users ──────────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { id: TEST_IDS.learner },
    update: { passwordHash, emailVerified: new Date() },
    create: {
      id: TEST_IDS.learner,
      email: TEST_USERS.learner.email,
      name: TEST_USERS.learner.name,
      passwordHash,
      role: "LEARNER",
      emailVerified: new Date(),
      subscriptionTier: "FREE",
      hasCompletedOnboarding: true,
    },
  });

  await prisma.user.upsert({
    where: { id: TEST_IDS.basicLearner },
    update: { passwordHash, emailVerified: new Date() },
    create: {
      id: TEST_IDS.basicLearner,
      email: TEST_USERS.basicLearner.email,
      name: TEST_USERS.basicLearner.name,
      passwordHash,
      role: "LEARNER",
      emailVerified: new Date(),
      subscriptionTier: "BASIC",
      hasCompletedOnboarding: true,
      credits1on1: 2,
    },
  });

  await prisma.user.upsert({
    where: { id: TEST_IDS.tutor },
    update: { passwordHash, emailVerified: new Date() },
    create: {
      id: TEST_IDS.tutor,
      email: TEST_USERS.tutor.email,
      name: TEST_USERS.tutor.name,
      passwordHash,
      role: "TUTOR",
      emailVerified: new Date(),
      subscriptionTier: "FREE",
      hasCompletedOnboarding: true,
    },
  });

  // ── Track / Module / Lessons ───────────────────────────────────────────────
  const track = await prisma.track.upsert({
    where: { id: TEST_IDS.track },
    update: {},
    create: {
      id: TEST_IDS.track,
      title: "E2E Test Track",
      description: "Track used exclusively for automated E2E tests",
      published: true,
    },
  });

  const module_ = await prisma.module.upsert({
    where: { id: TEST_IDS.module },
    update: {},
    create: {
      id: TEST_IDS.module,
      title: "E2E Module 1",
      order: 1,
      trackId: track.id,
    },
  });

  await prisma.lesson.upsert({
    where: { id: TEST_IDS.videoLesson },
    update: {},
    create: {
      id: TEST_IDS.videoLesson,
      title: "E2E Video Lesson",
      type: "VIDEO",
      contentUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order: 1,
      moduleId: module_.id,
    },
  });

  await prisma.lesson.upsert({
    where: { id: TEST_IDS.textLesson },
    update: {},
    create: {
      id: TEST_IDS.textLesson,
      title: "E2E Text Lesson",
      type: "TEXT",
      textContent: "# E2E Test Content\n\nThis lesson is used for automated testing.",
      order: 2,
      moduleId: module_.id,
    },
  });

  // ── Enroll learners in track ───────────────────────────────────────────────
  for (const userId of [TEST_IDS.learner, TEST_IDS.basicLearner]) {
    await prisma.enrollment.upsert({
      where: { userId_trackId: { userId, trackId: TEST_IDS.track } },
      update: {},
      create: { userId, trackId: TEST_IDS.track },
    });
  }

  // ── Tutor session (GROUP) ──────────────────────────────────────────────────
  const sessionStart = new Date(Date.now() + 24 * 60 * 60 * 1000); // tomorrow
  const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000); // +1 hour

  await prisma.tutorSession.upsert({
    where: { id: TEST_IDS.groupSession },
    update: {},
    create: {
      id: TEST_IDS.groupSession,
      title: "E2E Group Session",
      type: "GROUP",
      startTime: sessionStart,
      endTime: sessionEnd,
      meetingLink: "https://meet.google.com/e2e-test-link",
      googleEventId: "e2e-google-event-001",
      tutorId: TEST_IDS.tutor,
    },
  });

  // ── Pre-processed payment transaction (for idempotency test) ──────────────
  await prisma.paymentTransaction.upsert({
    where: { reference: TEST_IDS.processedTransaction },
    update: {},
    create: {
      id: "e2e-pmt-001",
      reference: TEST_IDS.processedTransaction,
      userId: TEST_IDS.basicLearner,
      amount: 5000,
      currency: "NGN",
      status: "success",
      planCode: "PLN_test_basic",
    },
  });

  await prisma.$disconnect();
}

export default globalSetup;
