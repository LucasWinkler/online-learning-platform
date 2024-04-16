import type { CoursesPagePayload } from "~/types/course";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import CourseList from "~/components/courses/CourseList";
import { calculateCourseLengthInSeconds } from "~/lib/utils";
import { getCoursesForHome } from "~/server/queries/course";

type CoursesProps = {
  courses: CoursesPagePayload[];
};

export const Courses: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ courses }) => {
  return (
    <section className="max-w-[850px] px-8 mx-auto">
      <h1 className="my-8 text-3xl font-bold">Courses</h1>
      <CourseList courses={courses} />
    </section>
  );
};

export const getServerSideProps = (async () => {
  const courses = (await getCoursesForHome()).map(({ lessons, ...course }) => {
    const lengthInSeconds = calculateCourseLengthInSeconds(lessons);
    const numberOfLessons = lessons.length;

    return {
      ...course,
      lengthInSeconds,
      numberOfLessons,
    };
  });

  return {
    props: {
      courses,
    },
  };
}) satisfies GetServerSideProps<CoursesProps>;

export default Courses;
