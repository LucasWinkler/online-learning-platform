/*
  Warnings:

  - You are about to drop the `TwoFactorConfirmationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TwoFactorConfirmationToken";

-- CreateTable
CREATE TABLE "TwoFactorToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFactorToken_pkey" PRIMARY KEY ("identifier","token")
);
