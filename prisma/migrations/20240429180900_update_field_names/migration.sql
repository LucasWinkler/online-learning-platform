/*
  Warnings:

  - You are about to drop the column `imageBlurDataUrl` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `PasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `VerificationToken` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/

-- Rename columns for the Course table
ALTER TABLE "Course" 
RENAME COLUMN "imageUrl" TO "image";
ALTER TABLE "Course"
RENAME COLUMN "imageBlurDataUrl" TO "imageBlurData";

-- Rename columns for the Lesson table
ALTER TABLE "Lesson" 
RENAME COLUMN "videoUrl" TO "video";

-- Rename columns for the PasswordResetToken table
ALTER TABLE "PasswordResetToken" 
RENAME COLUMN "expires" TO "expiresAt";

-- Rename columns for the VerificationToken table
ALTER TABLE "VerificationToken" 
RENAME COLUMN "expires" TO "expiresAt";

-- Drop default value of image for the User table
ALTER TABLE "User" ALTER COLUMN "image" DROP DEFAULT;
