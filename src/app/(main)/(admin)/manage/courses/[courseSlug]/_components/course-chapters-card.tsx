import type { Chapter, Lesson } from "@prisma/client";

import { SquarePlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ChapterList } from "./chapter-list";
import { CreateChapterDialog } from "./create-chapter-dialog";
import { IncompleteFieldIndicator } from "./incomplete-field-indicator";

type CourseChaptersCardProps = {
  courseId: string;
  courseSlug: string;
  chapters: (Chapter & {
    lessons: Lesson[];
  })[];
  completed: boolean;
};

export const CourseChaptersCard = ({
  courseId,
  courseSlug,
  chapters,
  completed,
}: CourseChaptersCardProps) => {
  return (
    <Card className="relative border-0 bg-gray-50">
      <IncompleteFieldIndicator completed={completed} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Course Chapters</CardTitle>
        <CreateChapterDialog
          trigger={
            <Button variant="outline" size="icon">
              <span className="sr-only">Add Chapter</span>
              <SquarePlusIcon className="size-4" />
            </Button>
          }
          courseId={courseId}
        />
      </CardHeader>
      <CardContent className="relative flex flex-col gap-2 text-sm">
        {chapters.length === 0 ? (
          <p className="text-sm text-gray-600">No chapters</p>
        ) : (
          <ChapterList
            courseId={courseId}
            courseSlug={courseSlug}
            initialChapters={chapters}
          />
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
        You can drag and drop chapters to reorder them.
      </CardFooter>
    </Card>
  );
};
