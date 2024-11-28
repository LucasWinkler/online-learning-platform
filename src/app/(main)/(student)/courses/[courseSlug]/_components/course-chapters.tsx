import type { CourseChapter } from "./types";

import { Accordion } from "~/components/ui/accordion";

import { ChapterAccordionItem } from "./chapter-accordion-item";

type CourseChaptersProps = {
  chapters: CourseChapter[];
};

export const CourseChapters = ({ chapters }: CourseChaptersProps) => (
  <div className="mt-8">
    <h2 className="mb-4 text-xl font-semibold">Course Content</h2>
    <Accordion type="single" collapsible className="w-full space-y-2">
      {chapters
        .filter((chapter) => chapter.publishedAt)
        .map((chapter) => (
          <ChapterAccordionItem key={chapter.id} chapter={chapter} />
        ))}
    </Accordion>
  </div>
);
