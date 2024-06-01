"use client";

import type { MuxData } from "@prisma/client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import {
  Loader2Icon,
  SquarePenIcon,
  SquarePlusIcon,
  VideoIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { IncompleteFieldIndicator } from "../../../../_components/incomplete-field-indicator";
import { LessonVideoForm } from "./lesson-video-form";

type LessonVideoCardProps = {
  id: string;
  video?: string | null;
  muxData?: MuxData | null;
  courseId: string;
  completed: boolean;
};

export const LessonVideoCard = ({
  id,
  courseId,
  video,
  muxData,
  completed,
}: LessonVideoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        <CardTitle>Lesson Video</CardTitle>
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
            {video && muxData ? (
              <>
                <span className="sr-only">Edit Video</span>
                <SquarePenIcon className="size-4" />
              </>
            ) : (
              <>
                <span className="sr-only">Add Video</span>
                <SquarePlusIcon className="size-4" />
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="relative">
        {isEditing ? (
          <LessonVideoForm
            id={id}
            courseId={courseId}
            onCancel={handleCancel}
            onPendingStateChange={setIsPending}
          />
        ) : (
          <div className="h-auto w-full overflow-hidden rounded-md">
            {video && muxData ? (
              <div className="relative flex aspect-video h-full w-full items-center justify-center rounded-md bg-gray-200">
                {isLoading ? (
                  <>
                    <Loader2Icon className="absolute size-8 animate-spin text-primary" />
                  </>
                ) : null}
                <MuxPlayer
                  className="aspect-video"
                  playbackId={muxData.playbackId ?? ""}
                  onLoadedData={() => {
                    setIsLoading(false);
                  }}
                />
              </div>
            ) : (
              <div className="flex aspect-video h-full w-full items-center justify-center rounded-md bg-gray-200">
                <VideoIcon className="text-gray-500" size={48} />
                <span className="sr-only">No video has been set</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2 border-t px-6 py-3 text-sm font-light text-gray-600 md:flex-row md:justify-between">
        The video should be 16:9 (e.g. 1920x1080) and must not be larger than
        32MB.
      </CardFooter>
    </Card>
  );
};
