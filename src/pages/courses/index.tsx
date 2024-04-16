import type { CoursesPagePayload } from "~/types/course";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import CourseList from "~/components/courses/CourseList";
import { CourseSelectForCoursesPage } from "~/lib/prisma/validators";
import { calculateCourseLengthInSeconds } from "~/lib/utils";
import { db } from "~/server/db";

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
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      chapters: {
        some: {
          isPublished: true,
          lessons: {
            some: {
              isPublished: true,
              chapter: {
                isPublished: true,
              },
            },
          },
        },
      },
    },
    select: {
      ...CourseSelectForCoursesPage,
      id: true,
      _count: {
        select: {
          courseEnrollments: true,
        },
      },
      lessons: {
        where: {
          isPublished: true,
          chapter: {
            isPublished: true,
          },
        },
        select: {
          length: true,
        },
      },
    },
  });

  const publishedCourses: CoursesPagePayload[] = courses.map((course) => {
    const lessons = course.lessons;
    const lengthInSeconds = calculateCourseLengthInSeconds(lessons);
    const numberOfLessons = lessons.length;

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      price: course.price,
      imageUrl: course.imageUrl,
      imageBlurDataUrl: course.imageBlurDataUrl,
      instructor: course.instructor,
      discount: course.discount,
      _count: course._count,
      lengthInSeconds,
      numberOfLessons,
    };
  });

  return {
    props: {
      courses: publishedCourses,
    },
  };
}) satisfies GetServerSideProps<CoursesProps>;

export default Courses;
