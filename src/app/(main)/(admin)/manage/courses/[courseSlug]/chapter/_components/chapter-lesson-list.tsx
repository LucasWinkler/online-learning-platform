"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Lesson } from "@prisma/client";

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
import { updateLessonOrder } from "~/server/actions/lesson";

import { ChapterLessonItem } from "./chapter-lesson-item";

type ChapterLessonListProps = {
  courseId: string;
  courseSlug: string;
  chapterId: string;
  initialLessons: Lesson[];
};

export const ChapterLessonList = ({
  courseId,
  courseSlug,
  chapterId,
  initialLessons,
}: ChapterLessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>(
    undefined,
  );
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLessons(initialLessons);
  }, [initialLessons]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setSelectedLesson(lessons.find((lesson) => lesson.id === active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const selectedLesson = lessons.find(
        (chapter) => chapter.id === active.id,
      );
      const overLesson = lessons.find((chapter) => chapter.id === over.id);

      if (!selectedLesson || !overLesson) {
        return;
      }

      const currentIndex = lessons.findIndex(
        (lesson) => lesson.id === active.id,
      );
      const newIndex = lessons.findIndex((lesson) => lesson.id === over.id);

      const movedLessons = arrayMove(lessons, currentIndex, newIndex);

      // The full lesson object used to display the chapters in the UI
      const newLessons = movedLessons.map((lesson, index) => ({
        ...lesson,
        order: index,
      }));

      // The lesson object with just the id and new order used to update the order in the database
      const lessonOrderUpdates = movedLessons.map((lesson, index) => ({
        id: lesson.id,
        order: index,
      }));

      setLessons(newLessons);
      setIsPending(true);

      await updateLessonOrder({
        courseId,
        chapterId,
        lessonOrderUpdates,
      })
        .then((data) => {
          if (data.error) {
            setLessons(initialLessons);
            toast.error("Lesson Update Failed", {
              description: data.error,
            });
          }

          if (data.success) {
            toast.success("Lesson Updated Successfully", {
              description: data.success,
            });
          }
        })
        .catch(() => {
          setLessons(initialLessons);
          toast.error("Lesson Update Failed", {
            description: "An error occurred while updating the lessons.",
          });
        })
        .finally(() => {
          setIsPending(false);
          setSelectedLesson(undefined);
        });
    }
  };

  const handleDragCancel = () => {
    setSelectedLesson(undefined);
  };

  return lessons.length > 0 ? (
    <DndContext
      id="lesson-list"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "To pick up a lesson item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.",
        },
        announcements: {
          onDragStart(id) {
            const lesson = lessons.find((lesson) => lesson.id === id.active.id);
            return `Picked up lesson (${lesson?.order}) ${lesson?.title ?? id.active.id}.`;
          },
          onDragOver({ active, over }) {
            const lesson = lessons.find((lesson) => lesson.id === active.id);
            if (over) {
              const overLesson = lessons.find(
                (lesson) => lesson.id === over.id,
              );
              return `Dragging lesson (${lesson?.order}) ${lesson?.title ?? active.id} over lesson (${overLesson?.order}) ${overLesson?.title ?? over.id}.`;
            }
            return `Dragging lesson (${lesson?.order}) ${lesson?.title ?? active.id}.`;
          },
          onDragEnd({ active, over }) {
            const lesson = lessons.find((lesson) => lesson.id === active.id);

            if (over?.id) {
              const overLesson = lessons.find(
                (lesson) => lesson.id === over.id,
              );
              return `Lesson (${lesson?.order}) ${lesson?.title ?? active.id} was dropped over lesson (${overLesson?.order}) ${overLesson?.title ?? over.id}.`;
            }

            return `Lesson (${lesson?.order}) ${lesson?.title ?? active.id} was dropped.`;
          },
          onDragCancel({ active }) {
            const lesson = lessons.find((lesson) => lesson.id === active.id);
            return `Dragging was cancelled. Lesson (${lesson?.order}) ${lesson?.title ?? active.id} was dropped.`;
          },
        },
      }}
    >
      <SortableContext disabled={isPending} items={lessons}>
        {isPending && (
          <div className="absolute left-0 top-0 z-[1] flex h-full w-full items-center justify-center">
            <span className="sr-only">Updating lesson orders...</span>
            <Loader2Icon className="size-6 animate-spin" />
          </div>
        )}
        <ol
          className={cn("flex flex-col gap-2", {
            "opacity-50": isPending,
          })}
        >
          {lessons.map((lesson) => (
            <ChapterLessonItem
              key={lesson.id}
              courseSlug={courseSlug}
              isPending={isPending}
              chapterId={chapterId}
              lesson={lesson}
            />
          ))}
        </ol>
      </SortableContext>
      <DragOverlay adjustScale>
        {selectedLesson && (
          <ChapterLessonItem
            courseSlug={courseSlug}
            isPending={isPending}
            lesson={selectedLesson}
            chapterId={chapterId}
            isSelected
          />
        )}
      </DragOverlay>
    </DndContext>
  ) : (
    <p className="text-sm text-gray-600">No lessons yet</p>
  );
};
