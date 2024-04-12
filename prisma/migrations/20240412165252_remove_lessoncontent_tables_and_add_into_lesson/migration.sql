/*
  Warnings:

  - You are about to drop the column `lessonContentId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `LessonContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TextContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoContent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[textContent,videoContent,chapterId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructorId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentType` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'VIDEO');

-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_lessonContentId_fkey";

-- DropForeignKey
ALTER TABLE "LessonContent" DROP CONSTRAINT "LessonContent_textContentId_fkey";

-- DropForeignKey
ALTER TABLE "LessonContent" DROP CONSTRAINT "LessonContent_videoContentId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "thumbnail" SET DEFAULT 'https://fakeimg.pl/300x170?text=Thumbnail&font=bebas';

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "instructorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "lessonContentId",
ADD COLUMN     "contentType" "ContentType" NOT NULL,
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "textContent" TEXT,
ADD COLUMN     "videoContent" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" SET DEFAULT 'https://fakeimg.pl/96x96?text=Image&font=bebas';

-- DropTable
DROP TABLE "LessonContent";

-- DropTable
DROP TABLE "TextContent";

-- DropTable
DROP TABLE "VideoContent";

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_textContent_videoContent_chapterId_key" ON "Lesson"("textContent", "videoContent", "chapterId");

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add constraint to ensure that each lesson has either text content or video content, but not both simultaneously.
ALTER TABLE "Lesson" ADD CONSTRAINT "check_textContent_or_videoContent" CHECK (("textContent" IS NOT NULL)::integer + ("videoContent" IS NOT NULL)::integer = 1);
