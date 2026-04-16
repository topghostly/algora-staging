-- CreateEnum
CREATE TYPE "TutorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resumeLink" TEXT,
ADD COLUMN     "tutorStatus" "TutorStatus";
