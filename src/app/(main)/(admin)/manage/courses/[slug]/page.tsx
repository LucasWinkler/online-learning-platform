import type { Metadata } from "next";

import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { PrimaryHeading } from "~/components/primary-heading";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import auth from "~/lib/auth";
import { cn } from "~/lib/utils";
import {
  findCourseSlugs,
  findCourseWithChaptersBySlug,
} from "~/server/data-access/course";

import { CourseWrapper } from "../_components/course-wrapper";
import { CourseChaptersCard } from "./_components/course-chapters-card";
import { CourseDescriptionCard } from "./_components/course-description-card";
import { CoursePriceCard } from "./_components/course-price-card";
import { CourseTitleCard } from "./_components/course-title-card";
import { DeleteCourseDialog } from "./_components/delete-course-dialog";

export const generateStaticParams = async () => {
  const slugs = await findCourseSlugs();

  return slugs.map((course) => ({
    slug: course.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const course = await fetchCourse(params.slug);

  return {
    title: course?.title ?? "Course not found",
    description: course?.description ?? "Course not found",
  };
};

const fetchCourse = async (slug: string) => {
  return await findCourseWithChaptersBySlug(slug);
};

const CourseDetails = async ({ params }: { params: { slug: string } }) => {
  const session = await auth();
  const user = session?.user;
  const { slug } = params;

  const course = await fetchCourse(slug);

  if (user?.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }

  if (!course || course.instructorId !== user.id) {
    redirect("/manage/courses");
  }

  const isPublished = !!course.publishedAt;

  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.image,
    course.chapters.some((chapter) => !!chapter.publishedAt),
  ];

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
          <PrimaryHeading>Course Details</PrimaryHeading>
          <div className="flex gap-2 xs:gap-4">
            <Button
              variant={isPublished ? "outline" : "default"}
              disabled={progressPercentage < 100}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <DeleteCourseDialog courseId={course.id} courseSlug={course.slug} />
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
          <CourseTitleCard id={course.id} title={course.title} />
          <CourseDescriptionCard
            id={course.id}
            description={course.description}
          />
        </div>
        <div className="flex flex-col gap-4 xl:gap-9">
          <CourseChaptersCard chapters={course.chapters} />
          <CoursePriceCard id={course.id} price={course.price} />
        </div>
      </div>
    </CourseWrapper>
  );
};

export default CourseDetails;
