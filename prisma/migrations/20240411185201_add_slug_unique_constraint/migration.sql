/*
  Warnings:

  - A unique constraint covering the columns `[courseId,slug]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chapterId,slug]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Chapter_slug_key";

-- DropIndex
DROP INDEX "Lesson_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_courseId_slug_key" ON "Chapter"("courseId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_chapterId_slug_key" ON "Lesson"("chapterId", "slug");
