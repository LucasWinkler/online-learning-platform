import type { Metadata } from "next";

import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { PrimaryHeading } from "~/components/primary-heading";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import auth from "~/lib/auth";
import { cn } from "~/lib/utils";
import {
  findChapterIds,
  findChapterWithLessonsAndCourseById,
} from "~/server/data-access/chapter";

import { ChapterTitleCard } from "../_components/chapter-title-card";
import { DeleteChapterDialog } from "../_components/delete-chapter-dialog";
import { CourseWrapper } from "../../../_components/course-wrapper";

export const generateStaticParams = async () => {
  const ids = await findChapterIds();

  return ids.map((chapter) => ({
    chapterId: chapter.id,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: ChapterSetupParams;
}): Promise<Metadata> => {
  const chapter = await fetchChapter(params.chapterId);

  return {
    title: chapter?.title ?? "Chapter not found",
  };
};

const fetchChapter = async (id: string) => {
  return await findChapterWithLessonsAndCourseById(id);
};

type ChapterSetupParams = { chapterId: string };

type ChapterSetupProps = {
  params: ChapterSetupParams;
};

const ChapterSetup = async ({ params }: ChapterSetupProps) => {
  const session = await auth();
  const user = session?.user;
  const { chapterId } = params;

  const chapter = await fetchChapter(chapterId);

  if (user?.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }

  if (!chapter || chapter.course.instructorId !== user.id) {
    redirect("/manage/courses");
  }

  const isPublished = !!chapter.publishedAt;
  const hasPublishedLessons = chapter.lessons.some(
    (lesson) => !!lesson.publishedAt,
  );

  const requiredFields = [chapter.title, hasPublishedLessons];

  const validFieldsCount = requiredFields.filter(Boolean).length;
  const progressPercentage = (validFieldsCount / requiredFields.length) * 100;

  const requiredText = `Required Fields (${validFieldsCount}/${requiredFields.length})`;
  const progressText =
    progressPercentage === 100
      ? "Ready to publish!"
      : `${progressPercentage.toFixed(0)}% complete`;

  return (
    <CourseWrapper>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start justify-between gap-2 xs:flex-row xs:items-center xs:gap-4">
          <PrimaryHeading>Chapter Setup</PrimaryHeading>
          <div className="flex gap-2 xs:gap-4">
            <Button
              variant={isPublished ? "outline" : "default"}
              disabled={progressPercentage < 100}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <DeleteChapterDialog
              courseSlug={chapter.course.slug}
              chapterId={chapter.id}
              chapterTitle={chapter.title}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <p className="text-sm font-medium text-gray-600">{requiredText}</p>
            <p className="text-xs text-gray-600">{progressText}</p>
          </div>
          <Progress
            className={cn(
              "h-4 w-full lg:h-5 [&>*]:bg-yellow-500",
              progressPercentage < 100 && "[&>*]:animate-pulse",
              progressPercentage === 100 && "[&>*]:bg-emerald-500",
              progressPercentage === 100 &&
                !isPublished &&
                "[&>*]:animate-pulse",
            )}
            value={progressPercentage}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:gap-9">
        <div className="flex flex-col gap-4 xl:gap-9">
          <ChapterTitleCard
            courseId={chapter.course.id}
            id={chapter.id}
            title={chapter.title}
          />
        </div>
        <div className="flex flex-col gap-4 xl:gap-9">
          {/* <CourseLessonsCard
            courseId={course.id}
            courseSlug={course.slug}
            chapters={course.chapters}
            completed={hasPublishedChapters}
          /> */}
          List of lessons
        </div>
      </div>
    </CourseWrapper>
  );
};

export default ChapterSetup;
