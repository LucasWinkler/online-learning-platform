"use client";

import type { z } from "zod";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useTransition,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangeChapterTitleSchema } from "~/schemas/chapter";
import { changeChapterTitle } from "~/server/actions/chapter";

type ChapterTitleFormProps = {
  courseId: string;
  id: string;
  title: string;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const ChapterTitleForm = forwardRef(
  (
    {
      courseId,
      id,
      title,
      onCancel,
      onPendingStateChange,
    }: ChapterTitleFormProps,
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      onPendingStateChange(isPending);
    }, [isPending, onPendingStateChange]);

    const changeChapterTitleForm = useForm<
      z.infer<typeof ChangeChapterTitleSchema>
    >({
      resolver: zodResolver(ChangeChapterTitleSchema),
      defaultValues: {
        courseId: courseId,
        id: id,
        title: title,
      },
    });

    const onSubmit = (values: z.infer<typeof ChangeChapterTitleSchema>) => {
      startTransition(async () => {
        await changeChapterTitle(values)
          .then(async (data) => {
            if (data?.error) {
              toast.error("Title Change Failed", {
                description: data.error,
              });
            }

            if (data?.success) {
              onCancel();
              toast.success("Title Changed", {
                description: data.success,
              });
            }
          })
          .catch(() => {
            toast.error("Title Change Failed", {
              description:
                "An unknown error occurred while changing your title.",
            });
          });
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => changeChapterTitleForm.handleSubmit(onSubmit)(),
    }));

    return (
      <Form {...changeChapterTitleForm}>
        <form onSubmit={changeChapterTitleForm.handleSubmit(onSubmit)}>
          <FormField
            control={changeChapterTitleForm.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    type="text"
                    placeholder="Enter your chapter title"
                    autoComplete="off"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-sm" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  },
);

ChapterTitleForm.displayName = "ChapterTitleForm";
