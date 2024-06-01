"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "~/components/form-error";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { CreateChapterSchema } from "~/schemas/chapter";
import { createChapter } from "~/server/actions/chapter";

type CreateChapterDialogProps = {
  trigger?: React.ReactNode;
  courseId: string;
};

export const CreateChapterDialog = ({
  trigger,
  courseId,
}: CreateChapterDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const createChapterForm = useForm<z.infer<typeof CreateChapterSchema>>({
    resolver: zodResolver(CreateChapterSchema),
    defaultValues: {
      courseId: courseId,
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateChapterSchema>) => {
    setError(undefined);

    startTransition(async () => {
      await createChapter(values)
        .then(async (data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setIsDialogOpen(false);
            createChapterForm.reset();
            toast.success("Chapter Successfully Created", {
              description: data.success,
            });
          }
        })
        .catch(() => {
          setError("An unknown error occurred while creating your chapter.");
        });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="default" size="sm">
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Chapter</DialogTitle>
          <DialogDescription>
            A chapter is a collection of lessons that are grouped together to
            form a complete course.
          </DialogDescription>
        </DialogHeader>
        <Form {...createChapterForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createChapterForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={createChapterForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Chapter Title</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                      type="text"
                      placeholder="My Chapter"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Chapter
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
