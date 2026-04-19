-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "authorizationCode" TEXT,
ADD COLUMN     "bank" TEXT,
ADD COLUMN     "cardType" TEXT,
ADD COLUMN     "channel" TEXT,
ADD COLUMN     "customerCode" TEXT,
ADD COLUMN     "expMonth" TEXT,
ADD COLUMN     "expYear" TEXT,
ADD COLUMN     "last4" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3);
