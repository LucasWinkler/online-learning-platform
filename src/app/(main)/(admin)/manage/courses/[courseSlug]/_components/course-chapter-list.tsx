"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Chapter, Lesson } from "@prisma/client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
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
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { updateChapterOrder } from "~/server/actions/chapter";

import { CourseChapterItem } from "./course-chapter-item";

type CourseChapterListProps = {
  courseId: string;
  courseSlug: string;
  initialChapters: (Chapter & {
    lessons: Lesson[];
  })[];
};

export const CourseChapterList = ({
  courseId,
  courseSlug,
  initialChapters,
}: CourseChapterListProps) => {
  const [chapters, setChapters] = useState<
    (Chapter & {
      lessons: Lesson[];
    })[]
  >(initialChapters);
  const [selectedChapter, setSelectedChapter] = useState<
    | (Chapter & {
        lessons: Lesson[];
      })
    | undefined
  >(undefined);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setSelectedChapter(chapters.find((chapter) => chapter.id === active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const selectedChapter = chapters.find(
        (chapter) => chapter.id === active.id,
      );
      const overChapter = chapters.find((chapter) => chapter.id === over.id);

      if (!selectedChapter || !overChapter) {
        return;
      }

      const currentIndex = chapters.findIndex(
        (chapter) => chapter.id === active.id,
      );
      const newIndex = chapters.findIndex((chapter) => chapter.id === over.id);

      const movedChapters = arrayMove(chapters, currentIndex, newIndex);

      // The full chapter object used to display the chapters in the UI
      const newChapters = movedChapters.map((chapter, index) => ({
        ...chapter,
        order: index,
      }));

      // The chapter object with just the id and new order used to update the order in the database
      const chapterOrderUpdates = movedChapters.map((chapter, index) => ({
        id: chapter.id,
        order: index,
      }));

      setChapters(newChapters);
      setIsPending(true);

      await updateChapterOrder({
        courseId,
        chapterOrderUpdates,
      })
        .then((data) => {
          if (data.error) {
            setChapters(initialChapters);
            toast.error("Chapter Update Failed", {
              description: data.error,
            });
          }

          if (data.success) {
            toast.success("Chapter Updated Successfully", {
              description: data.success,
            });
          }
        })
        .catch(() => {
          setChapters(initialChapters);
          toast.error("Chapter Update Failed", {
            description: "An error occurred while updating the chapters.",
          });
        })
        .finally(() => {
          setIsPending(false);
          setSelectedChapter(undefined);
        });
    }
  };

  const handleDragCancel = () => {
    setSelectedChapter(undefined);
  };

  return chapters.length > 0 ? (
    <DndContext
      id="chapter-list"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "To pick up a chapter item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.",
        },
        announcements: {
          onDragStart(id) {
            const chapter = chapters.find(
              (chapter) => chapter.id === id.active.id,
            );
            return `Picked up chapter (${chapter?.order}) ${chapter?.title ?? id.active.id}.`;
          },
          onDragOver({ active, over }) {
            const chapter = chapters.find(
              (chapter) => chapter.id === active.id,
            );
            if (over) {
              const overChapter = chapters.find(
                (chapter) => chapter.id === over.id,
              );
              return `Dragging chapter (${chapter?.order}) ${chapter?.title ?? active.id} over chapter (${overChapter?.order}) ${overChapter?.title ?? over.id}.`;
            }
            return `Dragging chapter (${chapter?.order}) ${chapter?.title ?? active.id}.`;
          },
          onDragEnd({ active, over }) {
            const chapter = chapters.find(
              (chapter) => chapter.id === active.id,
            );

            if (over?.id) {
              const overChapter = chapters.find(
                (chapter) => chapter.id === over.id,
              );
              return `Chapter (${chapter?.order}) ${chapter?.title ?? active.id} was dropped over chapter (${overChapter?.order}) ${overChapter?.title ?? over.id}.`;
            }

            return `Chapter (${chapter?.order}) ${chapter?.title ?? active.id} was dropped.`;
          },
          onDragCancel({ active }) {
            const chapter = chapters.find(
              (chapter) => chapter.id === active.id,
            );
            return `Dragging was cancelled. Chapter (${chapter?.order}) ${chapter?.title ?? active.id} was dropped.`;
          },
        },
      }}
    >
      <SortableContext disabled={isPending} items={chapters}>
        {isPending && (
          <div className="absolute left-0 top-0 z-[1] flex h-full w-full items-center justify-center">
            <span className="sr-only">Updating chapter orders...</span>
            <Loader2Icon className="size-6 animate-spin" />
          </div>
        )}
        <ol
          className={cn("flex flex-col gap-2", {
            "opacity-50": isPending,
          })}
        >
          {chapters.map((chapter) => (
            <CourseChapterItem
              key={chapter.id}
              courseSlug={courseSlug}
              isPending={isPending}
              chapter={chapter}
            />
          ))}
        </ol>
      </SortableContext>
      <DragOverlay adjustScale>
        {selectedChapter && (
          <CourseChapterItem
            courseSlug={courseSlug}
            isPending={isPending}
            chapter={selectedChapter}
            isSelected
          />
        )}
      </DragOverlay>
    </DndContext>
  ) : (
    <p className="text-sm text-gray-600">No chapters yet</p>
  );
};
