"use client";

import { useState } from "react";
import { CameraIcon, SquarePenIcon, SquarePlusIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { CourseThumbnailForm } from "./course-thumbnail-form";
import { IncompleteFieldIndicator } from "./incomplete-field-indicator";

type CourseThumbnailCardProps = {
  id: string;
  image: string | null;
  blurDataURL: string | null;
  slug: string;
  completed: boolean;
};

export const CourseThumbnailCard = ({
  id,
  image,
  blurDataURL,
  slug,
  completed,
}: CourseThumbnailCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card className="relative border-0 bg-gray-50">
      <IncompleteFieldIndicator completed={completed} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Course Thumbnail</CardTitle>
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
            {image ? (
              <>
                <span className="sr-only">Edit Thumbnail</span>
                <SquarePenIcon className="size-4" />
              </>
            ) : (
              <>
                <span className="sr-only">Add Thumbnail</span>
                <SquarePlusIcon className="size-4" />
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="relative">
        {isEditing ? (
          <CourseThumbnailForm
            id={id}
            slug={slug}
            onCancel={handleCancel}
            onPendingStateChange={setIsPending}
          />
        ) : (
          <div className="h-auto w-full overflow-hidden rounded-md">
            {image ? (
              <Image
                src={
                  image ??
                  `https://fakeimg.pl/1280x720?text=${slug}&font_size=72`
                }
                {...(blurDataURL ? { placeholder: "blur", blurDataURL } : {})}
                alt="Course Thumbnail"
                width={1280}
                height={720}
                className="aspect-video rounded-md object-cover"
              />
            ) : (
              <div className="flex aspect-video h-full w-full items-center justify-center rounded-md bg-gray-200">
                <CameraIcon className="text-gray-500" size={48} />
                <span className="sr-only">No thumbnail has been set</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2 border-t px-6 py-3 text-sm font-light text-gray-600 md:flex-row md:justify-between">
        The thumbnail should be 1280x720 (16:9) pixels and must not be larger
        than 2MB.
      </CardFooter>
    </Card>
  );
};
