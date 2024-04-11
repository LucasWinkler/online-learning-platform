/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,order]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chapterId,order]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_courseId_order_key" ON "Chapter"("courseId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_chapterId_order_key" ON "Lesson"("chapterId", "order");
