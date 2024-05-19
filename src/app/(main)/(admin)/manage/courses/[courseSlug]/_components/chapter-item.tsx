"use client";

import type { Chapter, Lesson } from "@prisma/client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon, SquarePenIcon } from "lucide-react";

import { Link } from "~/components/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ChapterItemProps = {
  chapter: Chapter & {
    lessons: Lesson[];
  };
  courseSlug: string;
  isPending: boolean;
  isSelected?: boolean;
};

export const ChapterItem = ({
  chapter,
  courseSlug,
  isPending,
  isSelected,
}: ChapterItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isPublished = !!chapter.publishedAt;

  return (
    <li
      className={cn(
        "flex w-full items-center gap-4 rounded-lg bg-background shadow transition-all duration-150 ease-out",
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
          "shrink-0 border-r border-border p-4",
          isDragging || isSelected ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <span className="sr-only">Reorder Chapter: {chapter.title}</span>
        <GripIcon className="size-4" />
      </div>
      <div className="text-sm">
        <span className="font-medium">Chapter {chapter.order + 1}:</span>{" "}
        <span>{chapter.title}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant={isPublished ? "default" : "outline"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
        <Button variant="ghost" size="icon" className="ml-auto mr-1.5" asChild>
          <Link href={`/manage/courses/${courseSlug}/chapter/${chapter.id}`}>
            <span className="sr-only">Edit Chapter: {chapter.title}</span>
            <SquarePenIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </li>
  );
};
