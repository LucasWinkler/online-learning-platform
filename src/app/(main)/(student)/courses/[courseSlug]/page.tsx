import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { DashboardBackLink } from "~/app/(main)/(admin)/_components/dashboard-back-link";
import { formatDate } from "~/lib/utils";
import { findPublishedCourseBySlug } from "~/server/data-access/course";
import { isEnrolledInCourse } from "~/server/data-access/enrollment";

import { CourseChapters } from "./_components/course-chapters";
import { CourseHeader } from "./_components/course-header";
import { CourseSidebar } from "./_components/course-sidebar";

export const generateMetadata = async ({
  params,
}: {
  params: { courseSlug: string };
}): Promise<Metadata> => {
  const course = await findPublishedCourseBySlug(params.courseSlug);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
};

const CoursePage = async ({ params }: { params: { courseSlug: string } }) => {
  const course = await findPublishedCourseBySlug(params.courseSlug);

  if (!course) {
    redirect("/courses");
  }

  const isEnrolled = await isEnrolledInCourse(course.id);
  const isFree = !course.price || course.price === 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <DashboardBackLink
        className="mb-0 flex justify-start lg:mb-0"
        href="/courses"
        title="Courses"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseHeader
            image={course.image}
            title={course.title}
            description={course.description ?? "No description available."}
          />
          <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              {course.publishedAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Published:
                  </span>
                  <time
                    dateTime={course.publishedAt.toISOString()}
                    className="text-muted-foreground"
                  >
                    {formatDate(course.publishedAt)}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Last updated:
                </span>
                <time
                  dateTime={course.updatedAt.toISOString()}
                  className="text-muted-foreground"
                >
                  {formatDate(course.updatedAt)}
                </time>
              </div>
            </div>
          </div>
          <CourseChapters chapters={course.chapters} />
        </div>
        <CourseSidebar
          courseId={course.id}
          price={course.price}
          chaptersCount={course.chapters.length}
          isEnrolled={isEnrolled}
          isFree={isFree}
          instructor={course.instructor}
          courseSlug={course.slug}
        />
      </div>
    </div>
  );
};

export default CoursePage;
