import type { User } from "next-auth";

import { type Course } from "@prisma/client";

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

export const StudentDashboard = ({ courses }: StudentDashboardProps) => {
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
            <section className="w-full rounded-xl border border-border bg-background p-4">
              <ul>
                {courses.map((course) => (
                  <li key={course.id}>{course.title}</li>
                ))}
              </ul>
            </section>
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
