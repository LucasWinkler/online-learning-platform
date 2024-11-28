import { BookIcon, ClockIcon, UsersIcon } from "lucide-react";
import Image from "next/image";

import { Link } from "~/components/link";
import { PrimaryHeading } from "~/components/primary-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCourseLength, formatCurrency } from "~/lib/utils";
import { findPublishedCourses } from "~/server/data-access/course";

const fetchCourses = async () => {
  const courses = await findPublishedCourses();

  return courses;
};

const CoursesPage = async () => {
  const courses = await fetchCourses();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:gap-6">
      <PrimaryHeading>Courses</PrimaryHeading>
      <ul className="3xl:grid-cols-4 grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {courses.map((course) => {
          const isCourseNew =
            course.publishedAt &&
            course.publishedAt >
              new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

          return (
            <li key={course.id}>
              <Link
                aria-label={`View ${course.title} course`}
                className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href={`/courses/${course.slug}`}
              >
                <Card className="overflow-hidden shadow transition-all duration-200 ease-out will-change-transform group-hover:-translate-y-[2px] group-hover:shadow-lg group-focus-visible:-translate-y-[1px] group-focus-visible:shadow-lg">
                  <div className="relative aspect-video h-full w-full overflow-hidden">
                    {isCourseNew && (
                      <div className="absolute right-0 top-0 z-[1] rounded-bl-lg rounded-tr-lg bg-red-500 px-2 py-2 text-xs font-medium text-white">
                        NEW
                      </div>
                    )}
                    <Image
                      className="aspect-video object-cover"
                      src={course.image ?? ""}
                      alt={`${course.title} thumbnail`}
                      fill
                    />
                  </div>
                  <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="transition-colors duration-200 ease-out group-hover:text-primary group-focus-visible:text-primary">
                      {course.title}
                    </CardTitle>
                    <span className="pb-1 text-sm">
                      By {course.instructor.name}
                    </span>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pb-4">
                    <div className="flex flex-row flex-wrap justify-between gap-2">
                      <span className="flex items-center gap-1 text-nowrap text-sm text-muted-foreground">
                        <ClockIcon className="size-4 shrink-0 text-amber-500" />
                        {formatCourseLength(72512)}
                      </span>
                      <span className="flex items-center gap-1 text-nowrap text-sm text-muted-foreground">
                        <BookIcon className="size-4 shrink-0 text-purple-500" />
                        30 lessons
                      </span>
                      <span className="flex items-center gap-1 text-nowrap text-sm text-muted-foreground">
                        <UsersIcon className="size-4 shrink-0 text-blue-500" />
                        50 students
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start">
                    <div className="flex w-full items-end justify-between gap-2">
                      <div className="flex flex-col text-sm font-medium">
                        Updated{" "}
                        <span className="text-xs text-muted-foreground">
                          {course.updatedAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(course.price)}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CoursesPage;
