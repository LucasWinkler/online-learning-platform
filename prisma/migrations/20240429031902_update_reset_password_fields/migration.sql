/*
  Warnings:

  - The primary key for the `PasswordResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `PasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `PasswordResetToken` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PasswordResetToken_email_token_key";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
ADD COLUMN     "identifier" TEXT NOT NULL,
ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("identifier", "token");
