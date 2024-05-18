"use client";

import type { Chapter, Lesson } from "@prisma/client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon } from "lucide-react";

import { cn } from "~/lib/utils";

type ChapterItemProps = {
  chapter: Chapter & {
    lessons: Lesson[];
  };
  isPending: boolean;
};

export const ChapterItem = ({ chapter, isPending }: ChapterItemProps) => {
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
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={cn("flex items-center gap-4 rounded-lg bg-background p-4", {
        "shadow-md": isDragging,
        "opacity-50": isPending,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GripIcon className="size-4 shrink-0" />
      <div className="text-sm">
        <span className="font-medium">Chapter {chapter.order + 1}:</span>{" "}
        <span>{chapter.title}</span>
      </div>
      <span className="ml-auto">{chapter.lessons.length} lessons</span>
    </li>
  );
};
