"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import slug from "slug";
import { toast } from "sonner";
import { type z } from "zod";

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
import { cn } from "~/lib/utils";
import { CreateCourseSchema } from "~/schemas/course";
import { createCourse } from "~/server/actions/course";

export const CreateCourseDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const createCourseForm = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  const { watch } = createCourseForm;
  const title = watch("title");
  const generatedSlug = slug(title);

  const onSubmit = (values: z.infer<typeof CreateCourseSchema>) => {
    setError(undefined);

    startTransition(async () => {
      await createCourse(values)
        .then(async (data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setIsDialogOpen(false);
            createCourseForm.reset();
            toast.success("Course Successfully Created", {
              description: data.success,
            });
            router.push(`/manage/courses/${data.slug}`);
          }
        })
        .catch(() => {
          setError("An unknown error occurred while creating your course.");
        });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Course</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new course.
          </DialogDescription>
        </DialogHeader>
        <Form {...createCourseForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createCourseForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={createCourseForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                      type="text"
                      placeholder="My Course"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                  <p
                    className={cn(
                      "invisible text-sm text-muted-foreground",
                      generatedSlug && "visible",
                    )}
                  >
                    URL: /{generatedSlug}
                  </p>
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
                Create Course
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
