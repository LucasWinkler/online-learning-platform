import type { Metadata } from "next";

import {
  BookIcon,
  ClockIcon,
  UserRoundIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { DashboardBackLink } from "~/app/(main)/(admin)/_components/dashboard-back-link";
import { PrimaryHeading } from "~/components/primary-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCourseLength, formatCurrency } from "~/lib/utils";
import { findPublishedCourseBySlug } from "~/server/data-access/course";

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
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={course.image ?? ""}
              alt={course.title}
              fill
              sizes="(min-width: 1024px) 683px, calc(100vw - 48px)"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-6">
            <PrimaryHeading>{course.title}</PrimaryHeading>
            <p className="text-muted-foreground">{course.description}</p>
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Course Content</h2>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {course.chapters
                  .filter((chapter) => chapter.publishedAt)
                  .map((chapter) => (
                    <AccordionItem
                      key={chapter.id}
                      value={chapter.id}
                      className="rounded-lg border bg-card px-6 shadow-sm [&:has([data-state=open])]:shadow-md"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col items-start gap-1 py-2">
                          <div className="flex items-center gap-2">
                            {chapter.title}
                            <Badge variant="secondary" className="ml-2">
                              {
                                chapter.lessons.filter(
                                  (lesson) => lesson.publishedAt,
                                ).length
                              }{" "}
                              {chapter.lessons.filter(
                                (lesson) => lesson.publishedAt,
                              ).length === 1
                                ? "lesson"
                                : "lessons"}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 pb-2">
                          {chapter.lessons
                            .filter((lesson) => lesson.publishedAt)
                            .map((lesson) => (
                              <Accordion
                                key={lesson.id}
                                type="single"
                                collapsible
                                className="w-full overflow-hidden rounded-md border bg-muted/30 transition-colors hover:bg-muted/50"
                              >
                                <AccordionItem
                                  value={lesson.id}
                                  className="border-none"
                                >
                                  <AccordionTrigger className="flex gap-2 px-4 py-2 hover:no-underline">
                                    <div className="flex flex-1 items-center gap-2">
                                      <VideoIcon className="size-4 shrink-0 text-slate-500" />
                                      <span className="text-sm">
                                        {lesson.title}
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="border-t bg-background/50 px-4 pb-3 pt-2">
                                    <p className="text-sm text-muted-foreground">
                                      {lesson.description ??
                                        "No description available."}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </div>
        </div>
        <div className="relative lg:h-[calc(100vh-4rem)]">
          <div className="sticky top-20 flex flex-col gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {formatCurrency(course.price)}
                </CardTitle>
                <CardDescription>
                  {isFree ? "Free Course" : "One-time payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap justify-between gap-2">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ClockIcon className="size-4 shrink-0 text-amber-500" />
                    {formatCourseLength(72512)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookIcon className="size-4 shrink-0 text-purple-500" />
                    {course.chapters.length} chapters
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UsersIcon className="size-4 shrink-0 text-blue-500" />
                    50 enrolled
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  {isEnrolled
                    ? "Continue Learning"
                    : isFree
                      ? "Enroll for Free"
                      : "Buy Course"}
                </Button>
              </CardFooter>
            </Card>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full">
                    <Avatar className="size-full [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-out [&>*]:group-hover:scale-[1.15]">
                      <AvatarImage src={course.instructor.image ?? undefined} />
                      <AvatarFallback className="bg-neutral-500 text-neutral-50">
                        <UserRoundIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Course Instructor
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
