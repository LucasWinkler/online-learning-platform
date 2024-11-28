import type { CourseChapter } from "./types";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { formatCourseLength } from "~/lib/utils";

import { LessonAccordionItem } from "./lesson-accordion-item";

type ChapterAccordionItemProps = {
  chapter: CourseChapter;
};

export const ChapterAccordionItem = ({
  chapter,
}: ChapterAccordionItemProps) => {
  const publishedLessons = chapter.lessons.filter(
    (lesson) => lesson.publishedAt,
  );

  const totalLessonDuration = publishedLessons.reduce(
    (acc: number, lesson) => acc + (lesson.length ?? 0),
    0,
  );

  return (
    <AccordionItem
      value={chapter.id}
      className="rounded-lg border bg-card px-6 shadow-sm [&:has([data-state=open])]:shadow-md"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex w-full flex-col items-start gap-1 py-2">
          <div className="flex w-full items-center gap-2">
            {chapter.title}
            <div className="ml-auto mr-2 flex items-center gap-2">
              <Badge variant="default" className="opacity-85">
                {publishedLessons.length}{" "}
                {publishedLessons.length === 1 ? "lesson" : "lessons"}
              </Badge>
              <Badge variant="default" className="opacity-85">
                {formatCourseLength(totalLessonDuration)}
              </Badge>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-2 pb-2">
          {publishedLessons.map((lesson) => (
            <LessonAccordionItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
