/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "isPublished",
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isPublished",
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "isPublished",
ADD COLUMN     "publishedAt" TIMESTAMP(3);
