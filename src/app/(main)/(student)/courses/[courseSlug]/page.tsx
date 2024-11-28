import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { DashboardBackLink } from "~/app/(main)/(admin)/_components/dashboard-back-link";
import { findPublishedCourseBySlug } from "~/server/data-access/course";

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

  const isEnrolled = false;
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
          <CourseChapters chapters={course.chapters} />
        </div>
        <CourseSidebar
          price={course.price}
          chaptersCount={course.chapters.length}
          isEnrolled={isEnrolled}
          isFree={isFree}
          instructor={course.instructor}
        />
      </div>
    </div>
  );
};

export default CoursePage;
