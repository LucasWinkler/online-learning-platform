import type { CourseLesson } from "./types";

import { VideoIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

type LessonAccordionItemProps = {
  lesson: CourseLesson;
};

export const LessonAccordionItem = ({ lesson }: LessonAccordionItemProps) => (
  <Accordion
    type="single"
    collapsible
    className="w-full overflow-hidden rounded-md border bg-muted/30 transition-colors hover:bg-muted/50"
  >
    <AccordionItem value={lesson.id} className="border-none">
      <AccordionTrigger className="flex gap-2 px-4 py-2 hover:no-underline">
        <div className="flex flex-1 items-center gap-2">
          <VideoIcon className="size-4 shrink-0 text-slate-500" />
          <span className="text-sm">{lesson.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-t bg-background/50 px-4 pb-3 pt-2">
        <p className="text-sm text-muted-foreground">
          {lesson.description ?? "No description available."}
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
