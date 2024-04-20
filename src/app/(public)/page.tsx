import type { CourseSearchParams } from "~/server/actions/course";
import type { Metadata } from "next";

import { Suspense } from "react";

import GetCoursesForHome from "~/server/actions/course";

import CourseFilters from "./_components/course/course-filters";
import CourseList from "./_components/course/course-list";
import CoursePagination from "./_components/course/course-pagination";
import CourseSearch from "./_components/course/course-search";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Home",
};

const Home = async ({ searchParams }: { searchParams: CourseSearchParams }) => {
  const { search, page, limit, sort, order } = searchParams;

  const {
    courses,
    total: courseTotal,
    page: coursePage,
    limit: courseLimit,
    sort: courseSort,
    order: courseOrder,
  } = await GetCoursesForHome({
    search,
    page,
    limit,
    sort,
    order,
  });

  return (
    <section className="mx-auto mb-12 max-w-7xl px-3 sm:px-4 md:px-5 lg:px-6">
      <h1 className="my-6 text-base font-bold xs:text-lg md:text-2xl">
        {courseTotal} results found{" "}
        {search && search.length > 0 && `for "${search}"`}
      </h1>
      <div className="mb-4 flex flex-col gap-2 xs:mb-6 xs:flex-row xs:gap-2 md:mb-8 lg:mb-12">
        <CourseSearch className="w-full" />
        <div className="ml-auto flex w-fit gap-1">
          <CourseFilters sort={courseSort} order={courseOrder} />
        </div>
      </div>
      <Suspense
        key={`${search}-${page}-${sort}-${order}`}
        fallback={<Loading />}
      >
        <CourseList courses={courses} />
      </Suspense>
      {courseTotal > 0 && (
        <CoursePagination
          total={courseTotal}
          page={coursePage}
          limit={courseLimit}
        />
      )}
    </section>
  );
};

export default Home;
