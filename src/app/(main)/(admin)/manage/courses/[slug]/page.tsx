import type { Metadata } from "next";

import { Role } from "@prisma/client";
import { SquarePenIcon, SquarePlusIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { PrimaryHeading } from "~/components/primary-heading";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import auth from "~/lib/auth";
import { cn, formatCurrency } from "~/lib/utils";
import {
  findCourseSlugs,
  findCourseWithChaptersBySlug,
} from "~/server/data-access/course";

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

  if (!course) {
    redirect("/manage/courses");
  }

  if (course.instructorId !== user.id) {
    redirect("/manage/courses");
  }

  const isPublished = !!course.publishedAt;

  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.image,
    course.chapters,
  ];

  const validFieldsCount = requiredFields.filter(
    (field) => field != null && field !== "",
  ).length;

  const progressPercentage = (validFieldsCount / requiredFields.length) * 100;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 xxs:p-5 xs:p-6 sm:gap-5 lg:gap-6 xl:gap-9">
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
          <p className="text-sm font-medium text-gray-600">
            Required Fields ({validFieldsCount}/{requiredFields.length})
          </p>
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
          <Card className="border-0 bg-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Course Title</CardTitle>
              <Button variant="outline" size="icon">
                <span className="sr-only">Edit Title</span>
                <SquarePenIcon className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{course.title}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
              The maximum length of your title is 60 characters.
            </CardFooter>
          </Card>
          <Card className="border-0 bg-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Course Description</CardTitle>
              <Button variant="outline" size="icon">
                <span className="sr-only">Edit Description</span>
                <SquarePenIcon className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {course.description ?? "No description."}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
              The maximum length of your description is 250 characters.
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col gap-4 xl:gap-9">
          <Card className="border-0 bg-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Course Chapters</CardTitle>
              <Button variant="outline" size="icon">
                <span className="sr-only">Add Chapter</span>
                <SquarePlusIcon className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {course.chapters.length === 0 ? (
                <p className="text-sm text-gray-600">No chapters</p>
              ) : (
                course.chapters.map((chapter) => (
                  <p key={chapter.id} className="text-sm text-gray-600">
                    {chapter.title}
                  </p>
                ))
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
              You can drag and drop chapters to reorder them.
            </CardFooter>
          </Card>
          <Card className="border-0 bg-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Course Price</CardTitle>
              <Button variant="outline" size="icon">
                <span className="sr-only">Edit Price</span>
                <SquarePenIcon className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {course.price ? formatCurrency(course.price) : "Free"}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
              To make the course free, leave this empty.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
