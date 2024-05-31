import type { Metadata } from "next";

import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { DashboardBackLink } from "~/app/(main)/(admin)/_components/dashboard-back-link";
import { PrimaryHeading } from "~/components/primary-heading";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import auth from "~/lib/auth";
import { cn } from "~/lib/utils";
import {
  findLessonByIdWithCourseAndChaptersAndMuxData,
  findLessonIds,
} from "~/server/data-access/lesson";

import { DeleteLessonDialog } from "../_components/delete-lesson-dialog";
import { LessonDescriptionCard } from "../_components/lesson-description-card";
import { LessonTitleCard } from "../_components/lesson-title-card";
import { LessonVideoCard } from "../_components/lesson-video-card";
import { CourseWrapper } from "../../../../../_components/course-wrapper";

export const dynamic = "force-dynamic";

export const generateStaticParams = async () => {
  const ids = await findLessonIds();

  return ids.map((lesson) => ({
    lessonId: lesson.id,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: LessonSetupParams;
}): Promise<Metadata> => {
  const lesson = await fetchLesson(params.lessonId);

  return {
    title: lesson?.title ?? "Lesson not found",
  };
};

const fetchLesson = async (id: string) => {
  return await findLessonByIdWithCourseAndChaptersAndMuxData(id);
};

type LessonSetupParams = { lessonId: string };

type LessonSetupProps = {
  params: LessonSetupParams;
};

const LessonSetup = async ({ params }: LessonSetupProps) => {
  const user = (await auth())?.user;

  if (user?.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }

  const { lessonId } = params;
  const lesson = await fetchLesson(lessonId);

  if (!lesson || lesson.course.instructorId !== user.id) {
    redirect("/manage/courses");
  }

  const isPublished = !!lesson.publishedAt;

  const requiredFields = [lesson.title, lesson.description, lesson.video];

  const validFieldsCount = requiredFields.filter(Boolean).length;
  const progressPercentage = (validFieldsCount / requiredFields.length) * 100;

  const requiredText = `Required Fields (${validFieldsCount}/${requiredFields.length})`;
  const progressText =
    progressPercentage === 100
      ? "Ready to publish!"
      : `${progressPercentage.toFixed(0)}% complete`;

  return (
    <>
      <DashboardBackLink
        href={`/manage/courses/${lesson.course.slug}/chapter/${lesson.chapter.id}`}
        title={lesson.chapter.title}
      />
      <CourseWrapper>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start justify-between gap-2 xs:flex-row xs:items-center xs:gap-4">
            <PrimaryHeading>Lesson Setup</PrimaryHeading>
            <div className="flex gap-2 xs:gap-4">
              <Button
                variant={isPublished ? "outline" : "default"}
                disabled={progressPercentage < 100}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </Button>
              <DeleteLessonDialog
                courseSlug={lesson.course.slug}
                chapterId={lesson.chapter.id}
                lessonId={lesson.id}
                lessonTitle={lesson.title}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <p className="text-sm font-medium text-gray-600">
                {requiredText}
              </p>
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
            <LessonTitleCard id={lesson.id} title={lesson.title} />
            <LessonDescriptionCard
              id={lesson.id}
              description={lesson.description}
              completed={!!lesson.description}
            />
          </div>
          <div className="flex flex-col gap-4 xl:gap-9">
            <LessonVideoCard
              id={lesson.id}
              video={lesson.video}
              muxData={lesson.muxData}
              courseId={lesson.course.id}
              completed={!!lesson.video}
            />
          </div>
        </div>
      </CourseWrapper>
    </>
  );
};

export default LessonSetup;
