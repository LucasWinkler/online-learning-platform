import type { CoursesPagePayload } from "~/types/course";

import CourseListItem from "./CourseListItem";

type CourseListProps = {
  courses: CoursesPagePayload[];
};

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  const courseListItems = courses.map((course) => (
    <CourseListItem key={course.slug} course={course} />
  ));

  return (
    <div className="w-full">
      {courseListItems.length > 0 ? (
        <ul className="flex flex-col gap-4">{courseListItems}</ul>
      ) : (
        <p>No courses available</p>
      )}
    </div>
  );
};

export default CourseList;
