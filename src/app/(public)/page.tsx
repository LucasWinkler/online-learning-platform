import type { Metadata } from "next";

import { Suspense } from "react";

import { calculateCourseLengthInSeconds } from "~/lib/utils";
import { getCoursesForHome } from "~/server/queries/course";

import CourseList from "./_components/course/course-list";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Home",
};

const getCourses = async () => {
  const courses = (await getCoursesForHome()).map(({ lessons, ...course }) => {
    const lengthInSeconds = calculateCourseLengthInSeconds(lessons);
    const numberOfLessons = lessons.length;

    return {
      ...course,
      lengthInSeconds,
      numberOfLessons,
    };
  });

  return courses;
};

const Page = async () => {
  const courses = await getCourses();

  return (
    <section className="mx-auto max-w-7xl px-4 focus:outline-none sm:px-3 md:px-5">
      <h1 className="my-8 text-3xl font-bold">Courses</h1>
      <Suspense fallback={<Loading />}>
        <CourseList courses={courses} />
      </Suspense>
    </section>
  );
};

export default Page;
