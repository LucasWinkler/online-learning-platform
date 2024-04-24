/*
  Warnings:

  - You are about to drop the column `slug` on the `Chapter` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Chapter_courseId_slug_key";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "slug";
