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
import { DeleteChapterSchema } from "~/schemas/chapter";
import { deleteChapter } from "~/server/actions/chapter";

type DeleteChapterDialogProps = {
  courseSlug: string;
  chapterId: string;
  chapterTitle: string;
  trigger?: React.ReactNode;
};

export const DeleteChapterDialog = ({
  courseSlug,
  chapterId,
  chapterTitle,
  trigger,
}: DeleteChapterDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteChapterForm = useForm<z.infer<typeof DeleteChapterSchema>>({
    resolver: zodResolver(DeleteChapterSchema),
    defaultValues: {
      id: chapterId,
      title: "",
    },
  });

  const { watch } = deleteChapterForm;
  const title = watch("title");
  const isDeleteConfirmationCorrect =
    title.toLowerCase() === chapterTitle.toLowerCase();

  const handleSubmit = async (values: z.infer<typeof DeleteChapterSchema>) => {
    setError(undefined);

    startTransition(async () => {
      await deleteChapter(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setIsDialogOpen(false);
            toast.success("Chapter Deleted", {
              description: data.success,
            });
            router.push(`/manage/courses/${courseSlug}`);
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
            <span className="sr-only">Delete Chapter</span>
            <Trash2 className="size-5" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Are you sure you want to delete this chapter?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span className="font-bold">This action is irreversible.</span>
            <span>
              Please enter the chapter title{" "}
              <span className="inline font-mono text-destructive">
                {chapterTitle}
              </span>{" "}
              to confirm.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...deleteChapterForm}>
          <form
            className="space-y-4"
            onSubmit={deleteChapterForm.handleSubmit(handleSubmit)}
          >
            <FormField
              control={deleteChapterForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Chapter Title"
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
                Delete Chapter
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
