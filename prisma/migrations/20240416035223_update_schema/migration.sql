/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Course` table. All the data in the column will be lost.
  - The primary key for the `CourseEnrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourseEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `textContent` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoContent` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Lesson_textContent_videoContent_chapterId_key";

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "thumbnail",
ADD COLUMN     "imageBlurDataUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("studentId", "courseId");

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "contentType",
DROP COLUMN "textContent",
DROP COLUMN "videoContent",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "length" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "ContentType";
