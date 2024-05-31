"use client";

import type { z } from "zod";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FloatingLabelInput } from "~/components/floating-label-input";
import { FormError } from "~/components/form-error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { DeleteLessonSchema } from "~/schemas/lesson";
import { deleteLesson } from "~/server/actions/lesson";

type DeleteLessonDialogProps = {
  courseSlug: string;
  chapterId: string;
  lessonId: string;
  lessonTitle: string;
  trigger?: React.ReactNode;
};

export const DeleteLessonDialog = ({
  courseSlug,
  chapterId,
  lessonId,
  lessonTitle,
  trigger,
}: DeleteLessonDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteLessonForm = useForm<z.infer<typeof DeleteLessonSchema>>({
    resolver: zodResolver(DeleteLessonSchema),
    defaultValues: {
      id: lessonId,
      title: "",
    },
  });

  const { watch } = deleteLessonForm;
  const title = watch("title");
  const isDeleteConfirmationCorrect =
    title.toLowerCase() === lessonTitle.toLowerCase();

  const handleSubmit = async (values: z.infer<typeof DeleteLessonSchema>) => {
    setError(undefined);

    startTransition(async () => {
      await deleteLesson(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setIsDialogOpen(false);
            toast.success("Lesson Deleted", {
              description: data.success,
            });
            router.push(`/manage/courses/${courseSlug}/chapter/${chapterId}`);
          }
        })
        .catch(() => {
          setError("An unknown error occurred while deleting the chapter.");
        });
    });
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        {trigger ? (
          trigger
        ) : (
          <Button variant="destructive-outline" size="icon">
            <span className="sr-only">Delete Lesson</span>
            <Trash2 className="size-5" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Are you sure you want to delete this lesson?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span className="font-bold">This action is irreversible.</span>
            <span>
              Please enter the lesson title{" "}
              <span className="inline font-mono text-destructive">
                {lessonTitle}
              </span>{" "}
              to confirm.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...deleteLessonForm}>
          <form
            className="space-y-4"
            onSubmit={deleteLessonForm.handleSubmit(handleSubmit)}
          >
            <FormField
              control={deleteLessonForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Lesson Title"
                    disabled={isPending}
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={isPending || !isDeleteConfirmationCorrect}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isPending && (
                  <Loader2Icon className="mr-1 size-4 animate-spin" />
                )}
                Delete Lesson
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
