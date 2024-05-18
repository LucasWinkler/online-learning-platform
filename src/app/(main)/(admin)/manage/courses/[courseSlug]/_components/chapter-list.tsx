"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Chapter, Lesson } from "@prisma/client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { updateChapterOrder } from "~/server/actions/chapter";

import { ChapterItem } from "./chapter-item";

type ChapterListProps = {
  courseId: string;
  chapters: (Chapter & {
    lessons: Lesson[];
  })[];
};

export const ChapterList = ({ courseId, chapters }: ChapterListProps) => {
  const [localChapters, setLocalChapters] = useState<
    (Chapter & {
      lessons: Lesson[];
    })[]
  >(chapters);
  const [isPending, setIsPending] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentIndex = localChapters.findIndex(
        (chapter) => chapter.id === active.id,
      );
      const newIndex = localChapters.findIndex(
        (chapter) => chapter.id === over.id,
      );
      const newChapters = arrayMove(localChapters, currentIndex, newIndex).map(
        (chapter, index) => ({
          ...chapter,
          order: index,
        }),
      );

      setLocalChapters(newChapters);
      setIsPending(true);

      await updateChapterOrder(courseId, newChapters)
        .then((res) => {
          if (res.error) {
            setLocalChapters(chapters);
            toast.error("Chapter Update Failed", {
              description: res.error,
            });
          }

          if (res.success) {
            toast.success("Chapter Updated Successfully", {
              description: res.success,
            });
          }
        })
        .catch(() => {
          setLocalChapters(chapters);
          toast.error("Chapter Update Failed", {
            description: "An error occurred while updating the chapters.",
          });
        })
        .finally(() => {
          setIsPending(false);
        });
    }
  };

  return localChapters.length > 0 ? (
    <DndContext id="chapter-list" sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext disabled={isPending} items={localChapters}>
        <ol
          className={cn("flex flex-col gap-2", {
            "opacity-50": isPending,
          })}
        >
          {localChapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              isPending={isPending}
              chapter={chapter}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  ) : (
    <p className="text-sm text-gray-600">No chapters yet</p>
  );
};
