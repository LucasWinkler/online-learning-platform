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
import { ToggleChapterPublishSchema } from "~/schemas/chapter";
import { toggleChapterPublish } from "~/server/actions/chapter";

type ToggleChapterPublishFormProps = {
  chapterId: string;
  publishedAt: Date | null;
  isChapterComplete: boolean;
};

export const ToggleChapterPublishForm = ({
  chapterId,
  isChapterComplete,
  publishedAt,
}: ToggleChapterPublishFormProps) => {
  const [isPublished, setIsPublished] = useState<boolean>(!!publishedAt);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const toggleChapterPublishForm = useForm<
    z.infer<typeof ToggleChapterPublishSchema>
  >({
    resolver: zodResolver(ToggleChapterPublishSchema),
    defaultValues: {
      id: chapterId,
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof ToggleChapterPublishSchema>,
  ) => {
    startTransition(async () => {
      await toggleChapterPublish(values)
        .then(async (data) => {
          if (data.error) {
            toast.error("Chapter Publish Failed", {
              description: data.error,
            });
          }

          if (data.success) {
            toast.success("Chapter Publish Successfully Changed", {
              description: data.success,
            });

            setIsPublished((prev) => !prev);
          }

          setIsDialogOpen(false);
        })
        .catch(() => {
          setIsDialogOpen(false);
          toast.error("Chapter Publish Failed", {
            description:
              "An unknown error occurred while changing your chapter publish status.",
          });
        });
    });
  };

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancelClicked = () => {
    setIsDialogOpen(false);
    toggleChapterPublishForm.reset();
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <Button
        onClick={handleButtonClick}
        variant={isPublished ? "outline" : "default"}
        disabled={!isChapterComplete}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isPublished ? "text-destructive" : ""}>
            <span>
              Are you sure you want to {isPublished ? "unpublish" : "publish"}{" "}
              this chapter?
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span>
              {isPublished
                ? "Unpublishing this chapter will hide it from the public."
                : "Publishing this chapter will make it visible to the public."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...toggleChapterPublishForm}>
          <form
            className="space-y-4"
            onSubmit={toggleChapterPublishForm.handleSubmit(handleSubmit)}
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
