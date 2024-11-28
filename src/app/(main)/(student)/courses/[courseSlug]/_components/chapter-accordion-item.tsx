import type { CourseChapter } from "./types";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";

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

  return (
    <AccordionItem
      value={chapter.id}
      className="rounded-lg border bg-card px-6 shadow-sm [&:has([data-state=open])]:shadow-md"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col items-start gap-1 py-2">
          <div className="flex items-center gap-2">
            {chapter.title}
            <Badge variant="secondary" className="ml-2">
              {publishedLessons.length}{" "}
              {publishedLessons.length === 1 ? "lesson" : "lessons"}
            </Badge>
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
