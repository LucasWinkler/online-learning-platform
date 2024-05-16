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
import { DeleteCourseSchema } from "~/schemas/course";
import { deleteCourse } from "~/server/actions/course";

type DeleteCourseDialogProps = {
  courseId: string;
  courseSlug: string;
  trigger?: React.ReactNode;
};

export const DeleteCourseDialog = ({
  courseId,
  courseSlug,
  trigger,
}: DeleteCourseDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteCourseForm = useForm<z.infer<typeof DeleteCourseSchema>>({
    resolver: zodResolver(DeleteCourseSchema),
    defaultValues: {
      id: courseId,
      slug: "",
    },
  });

  const { watch } = deleteCourseForm;
  const slug = watch("slug");
  const isDeleteConfirmationCorrect =
    slug.toLowerCase() === courseSlug.toLowerCase();

  const handleSubmit = async (values: z.infer<typeof DeleteCourseSchema>) => {
    setError(undefined);

    startTransition(async () => {
      await deleteCourse(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setIsDialogOpen(false);
            toast.success("Course Deleted", {
              description: data.success,
            });
            router.push("/manage/courses");
          }
        })
        .catch(() => {
          setError("An unknown error occurred while deleting the course.");
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
            <span className="sr-only">Delete Course</span>
            <Trash2 className="size-5" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Are you sure you want to delete this course?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span className="font-bold">This action is irreversible.</span>
            <span>
              Please enter the course slug{" "}
              <span className="inline font-mono text-destructive">
                {courseSlug}
              </span>{" "}
              to confirm.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...deleteCourseForm}>
          <form
            className="space-y-4"
            onSubmit={deleteCourseForm.handleSubmit(handleSubmit)}
          >
            <FormField
              control={deleteCourseForm.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Course Slug"
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
                Delete Course
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
