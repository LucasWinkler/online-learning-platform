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
import { ToggleCoursePublishSchema } from "~/schemas/course";
import { toggleCoursePublish } from "~/server/actions/course";

type ToggleCoursePublishFormProps = {
  courseId: string;
  publishedAt: Date | null;
  isCourseComplete: boolean;
};

export const ToggleCoursePublishForm = ({
  courseId,
  isCourseComplete,
  publishedAt,
}: ToggleCoursePublishFormProps) => {
  const [isPublished, setIsPublished] = useState<boolean>(!!publishedAt);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const toggleCoursePublishForm = useForm<
    z.infer<typeof ToggleCoursePublishSchema>
  >({
    resolver: zodResolver(ToggleCoursePublishSchema),
    defaultValues: {
      id: courseId,
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof ToggleCoursePublishSchema>,
  ) => {
    startTransition(async () => {
      await toggleCoursePublish(values)
        .then(async (data) => {
          if (data.error) {
            toast.error("Course Publish Failed", {
              description: data.error,
            });
          }

          if (data.success) {
            toast.success("Course Publish Successfully Changed", {
              description: data.success,
            });

            setIsPublished((prev) => !prev);
          }

          setIsDialogOpen(false);
        })
        .catch(() => {
          setIsDialogOpen(false);
          toast.error("Course Publish Failed", {
            description:
              "An unknown error occurred while changing your course publish status.",
          });
        });
    });
  };

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancelClicked = () => {
    setIsDialogOpen(false);
    toggleCoursePublishForm.reset();
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <Button
        onClick={handleButtonClick}
        variant={isPublished ? "outline" : "default"}
        disabled={!isCourseComplete}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isPublished ? "text-destructive" : ""}>
            <span>
              Are you sure you want to {isPublished ? "unpublish" : "publish"}{" "}
              this course?
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span>
              {isPublished
                ? "Unpublishing this course will hide it from the public."
                : "Publishing this course will make it visible to the public."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...toggleCoursePublishForm}>
          <form
            className="space-y-4"
            onSubmit={toggleCoursePublishForm.handleSubmit(handleSubmit)}
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
