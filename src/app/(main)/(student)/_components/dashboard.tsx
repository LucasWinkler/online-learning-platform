import type { User } from "next-auth";

import { type Course } from "@prisma/client";
import { BookIcon, ClockIcon } from "lucide-react";
import Image from "next/image";

import { Link } from "~/components/link";
import NumberTicker from "~/components/magicui/number-ticker";
import { PrimaryHeading } from "~/components/primary-heading";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { formatCourseLength, formatCurrency } from "~/lib/utils";

// StudentCourse
// Recently accessed courses from the user with progress or some other stats

// FeaturedCourse
// Featured courses for logged out users
// Most likely just the top 5 most popular courses

// type StudentDashboardCourse = StudentCourse | FeaturedCourse;

type StudentDashboardProps = {
  user?: User;
  courses?: Course[];
};

export const StudentDashboard = ({ user, courses }: StudentDashboardProps) => {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:gap-6">
      <PrimaryHeading>Overview</PrimaryHeading>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-5 lg:gap-6 xl:gap-9">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <section className="grid grid-cols-2 gap-4 xs:flex-row">
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardDescription>Courses</CardDescription>
                <CardTitle className="flex items-center gap-1 text-4xl">
                  <NumberTicker value={10} />
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="flex items-center gap-1 text-4xl">
                  <NumberTicker value={4} />
                  <div className="text-xs text-muted-foreground">
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      10
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Progress value={40} aria-label="40% completed" />
              </CardFooter>
            </Card>
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="flex items-center gap-1 text-4xl">
                  <NumberTicker value={3} />
                  <div className="text-xs text-muted-foreground">
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      6
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Progress value={50} aria-label="50% in progress" />
              </CardFooter>
            </Card>
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardDescription>Not Started</CardDescription>
                <CardTitle className="flex items-center gap-1 text-4xl">
                  <NumberTicker value={3} />
                  <div className="text-xs text-muted-foreground">
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      6
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Progress value={50} aria-label="50% not started" />
              </CardFooter>
            </Card>
          </section>
          {courses && courses.length > 0 ? (
            <DashboardCourseList
              user={user}
              title={user ? "Your Recent Courses" : "Popular Courses"}
              description={
                user
                  ? "Continue learning from where you left off"
                  : "Join thousands of students learning from these courses"
              }
              courses={courses}
            />
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-4 lg:col-span-2">
          <Calendar
            mode="default"
            disableNavigation
            className="w-full rounded-md border bg-background"
            classNames={{
              months:
                "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
              month: "space-y-4 w-full flex flex-col",
              table: "w-full h-full border-collapse space-y-1",
              head_row: "",
              row: "w-full mt-2",
            }}
          />
        </div>
      </div>
    </div>
  );
};

type DashboardCourseListProps = {
  title: string;
  description: string;
  courses: Course[];
  user?: User;
};

export const DashboardCourseList = ({
  title,
  description,
  courses,
  user,
}: DashboardCourseListProps) => {
  return (
    <section className="w-full rounded-xl border border-border bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <ul className="divide-y divide-border">
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/courses/${course.slug}`}
              className="group block rounded-lg p-4 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex gap-4">
                {/* Thumbnail with optional "NEW" badge */}
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md xs:w-40">
                  {course.publishedAt &&
                    course.publishedAt >
                      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) && (
                      <div className="absolute right-0 top-0 z-[1] rounded-bl-lg rounded-tr-lg bg-red-500 px-2 py-1 text-xs font-medium text-white">
                        NEW
                      </div>
                    )}
                  <Image
                    src={course.image ?? ""}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground group-hover:text-primary">
                        {course.title}
                      </h3>
                      <span className="text-sm font-medium text-muted-foreground">
                        {course.price ? formatCurrency(course.price) : "Free"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="size-4 shrink-0 text-amber-500" />
                        {formatCourseLength(72512)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookIcon className="size-4 shrink-0 text-purple-500" />
                        30 lessons
                      </span>
                    </div>

                    {/* Only show progress for enrolled users */}
                    {user && (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={40} // Placeholder value - will be replaced with actual progress
                          className="h-2 w-20"
                          aria-label="40% complete"
                        />
                        <span className="text-xs text-muted-foreground">
                          40%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
