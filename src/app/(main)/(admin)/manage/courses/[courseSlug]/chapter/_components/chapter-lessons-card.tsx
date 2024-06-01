import type { Lesson } from "@prisma/client";

import { SquarePlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { IncompleteFieldIndicator } from "../../_components/incomplete-field-indicator";
import { ChapterLessonList } from "./chapter-lesson-list";
import { CreateLessonDialog } from "./create-lesson-dialog";

type ChapterLessonsCardProps = {
  courseId: string;
  courseSlug: string;
  lessons: Lesson[];
  chapterId: string;
  completed: boolean;
};

export const ChapterLessonsCard = ({
  courseId,
  courseSlug,
  lessons,
  chapterId,
  completed,
}: ChapterLessonsCardProps) => {
  return (
    <Card className="relative border-0 bg-gray-50">
      <IncompleteFieldIndicator completed={completed} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Chapter Lessons</CardTitle>
        <CreateLessonDialog
          trigger={
            <Button variant="outline" size="icon">
              <span className="sr-only">Add Lesson</span>
              <SquarePlusIcon className="size-4" />
            </Button>
          }
          courseId={courseId}
          chapterId={chapterId}
        />
      </CardHeader>
      <CardContent className="relative text-sm">
        {lessons.length === 0 ? (
          <p className="text-sm text-gray-600">No lessons</p>
        ) : (
          <ChapterLessonList
            courseId={courseId}
            courseSlug={courseSlug}
            chapterId={chapterId}
            initialLessons={lessons}
          />
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
        You can drag and drop lessons to reorder them.
      </CardFooter>
    </Card>
  );
};
