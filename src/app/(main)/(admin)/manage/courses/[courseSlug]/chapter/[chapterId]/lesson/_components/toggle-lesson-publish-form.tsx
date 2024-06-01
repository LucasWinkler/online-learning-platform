"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { ToggleLessonPublishSchema } from "~/schemas/lesson";
import { toggleLessonPublish } from "~/server/actions/lesson";

type ToggleLessonPublishFormProps = {
  lessonId: string;
  publishedAt: Date | null;
  isLessonComplete: boolean;
};

export const ToggleLessonPublishForm = ({
  lessonId,
  isLessonComplete,
  publishedAt,
}: ToggleLessonPublishFormProps) => {
  const [isPublished, setIsPublished] = useState<boolean>(!!publishedAt);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const toggleLessonPublishForm = useForm<
    z.infer<typeof ToggleLessonPublishSchema>
  >({
    resolver: zodResolver(ToggleLessonPublishSchema),
    defaultValues: {
      id: lessonId,
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof ToggleLessonPublishSchema>,
  ) => {
    startTransition(async () => {
      await toggleLessonPublish(values)
        .then(async (data) => {
          if (data.error) {
            toast.error("Lesson Publish Failed", {
              description: data.error,
            });
          }

          if (data.success) {
            toast.success("Lesson Publish Successfully Changed", {
              description: data.success,
            });

            setIsPublished((prev) => !prev);
          }

          setIsDialogOpen(false);
        })
        .catch(() => {
          setIsDialogOpen(false);
          toast.error("Lesson Publish Failed", {
            description:
              "An unknown error occurred while changing your lesson publish status.",
          });
        });
    });
  };

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancelClicked = () => {
    setIsDialogOpen(false);
    toggleLessonPublishForm.reset();
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <Button
        onClick={handleButtonClick}
        variant={isPublished ? "outline" : "default"}
        disabled={!isLessonComplete}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isPublished ? "text-destructive" : ""}>
            <span>
              Are you sure you want to {isPublished ? "unpublish" : "publish"}{" "}
              this lesson?
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span>
              {isPublished
                ? "Unpublishing this lesson will hide it from the public."
                : "Publishing this lesson will make it visible to the public."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...toggleLessonPublishForm}>
          <form
            className="space-y-4"
            onSubmit={toggleLessonPublishForm.handleSubmit(handleSubmit)}
          >
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isPending}
                onClick={handleCancelClicked}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({
                  variant: isPublished ? "destructive" : "default",
                })}
                type="submit"
                disabled={isPending}
              >
                {isPending && (
                  <Loader2Icon className="mr-1 size-4 animate-spin" />
                )}
                {isPublished ? "Unpublish" : "Publish"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
