"use client";

import { useRef, useState } from "react";
import { Loader2Icon, SquarePenIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ChapterTitleForm } from "./chapter-title-form";

type ChapterTitleCardProps = {
  courseId: string;
  id: string;
  title: string;
};

export const ChapterTitleCard = ({
  courseId,
  id,
  title,
}: ChapterTitleCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<{ submitForm: () => void }>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Chapter Title</CardTitle>
        {isEditing ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        ) : (
          <Button onClick={handleEdit} variant="outline" size="icon">
            <span className="sr-only">Edit Title</span>
            <SquarePenIcon className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <ChapterTitleForm
            ref={formRef}
            courseId={courseId}
            id={id}
            title={title}
            onCancel={handleCancel}
            onPendingStateChange={setIsPending}
          />
        ) : (
          <p className="text-sm text-gray-600">{title}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col flex-wrap items-center justify-center gap-2 border-t px-6 py-3 text-sm font-light text-gray-600 md:flex-row md:justify-between">
        The maximum length of your title is 60 characters.
        {isEditing && (
          <Button
            onClick={handleFormSubmit}
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending && (
              <>
                <span className="sr-only">Saving...</span>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              </>
            )}
            Save
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
