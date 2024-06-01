/*
  Warnings:

  - You are about to drop the column `slug` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Lesson_chapterId_slug_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "slug";
