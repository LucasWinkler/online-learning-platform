"use client";

import type { Lesson } from "@prisma/client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon, SquarePenIcon } from "lucide-react";

import { Link } from "~/components/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type ChapterLessonItemProps = {
  lesson: Lesson;
  chapterId: string;
  courseSlug: string;
  isPending: boolean;
  isSelected?: boolean;
};

export const ChapterLessonItem = ({
  lesson,
  chapterId,
  courseSlug,
  isPending,
  isSelected,
}: ChapterLessonItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isPublished = !!lesson.publishedAt;

  return (
    <li
      className={cn(
        "flex items-center rounded-lg bg-background shadow transition-all duration-150 ease-out",
        {
          "opacity-50": isDragging || isPending,
          "opacity-100": !isDragging,
          "shadow-md": isSelected,
        },
      )}
      style={style}
      ref={setNodeRef}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "shrink-0 p-4",
          isDragging || isSelected ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <span className="sr-only">Reorder Lesson: {lesson.title}</span>
        <GripIcon className="size-4" />
      </div>
      <div className="flex w-full items-center justify-between border-l border-border">
        <div className="p-4 pr-0">
          <p className="line-clamp-2 break-words text-sm">{lesson.title}</p>
        </div>
        <div className="flex items-center gap-1 pr-4">
          <Tooltip>
            <TooltipTrigger>
              <Badge
                className="hidden cursor-default xs:flex"
                variant={isPublished ? "default" : "outline"}
              >
                {isPublished ? "P" : "D"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                !isPublished && "border bg-gray-50 text-foreground",
              )}
            >
              {isPublished ? "Published" : "Draft"}
            </TooltipContent>
          </Tooltip>
          <Button
            className="hover:text-neutral-600"
            variant="ghost"
            size="icon"
            asChild
          >
            <Link
              href={`/manage/courses/${courseSlug}/chapter/${chapterId}/lesson/${lesson.id}`}
            >
              <span className="sr-only">Edit Lesson: {lesson.title}</span>
              <SquarePenIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
};
