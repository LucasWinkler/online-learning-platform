"use client";

import type { CourseForHome } from "~/types/course";

import CourseListItem from "./course-list-item";

type CourseListProps = {
  courses: CourseForHome[];
};

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <>
        <h2 className="mb-4 text-base font-bold xs:text-lg md:text-xl">
          Sorry, we couldn&apos;t find any courses
        </h2>
        <h3 className="mb-2 text-sm font-semibold xs:text-base md:text-lg">
          Here are some ideas:
        </h3>
        <ul className="list-inside list-disc space-y-1 text-sm xs:text-base">
          <li>Ensure words are spelled correctly</li>
          <li>Try different search terms</li>
          <li>Try more general search terms</li>
        </ul>
      </>
    );
  }

  const courseListItems = courses.map((course) => (
    <CourseListItem key={course.slug} course={course} />
  ));

  return <ul className="flex flex-col gap-4">{courseListItems}</ul>;
};

export default CourseList;
