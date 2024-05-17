import type { Chapter } from "@prisma/client";

import { SquarePlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type CourseChaptersCardProps = {
  chapters: Chapter[];
};

export const CourseChaptersCard = ({ chapters }: CourseChaptersCardProps) => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Course Chapters</CardTitle>
        <Button variant="outline" size="icon">
          <span className="sr-only">Add Chapter</span>
          <SquarePlusIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {chapters.length === 0 ? (
          <p className="text-sm text-gray-600">No chapters</p>
        ) : (
          chapters.map((chapter) => (
            <p key={chapter.id} className="text-sm text-gray-600">
              {chapter.title}
            </p>
          ))
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
        You can drag and drop chapters to reorder them.
      </CardFooter>
    </Card>
  );
};
