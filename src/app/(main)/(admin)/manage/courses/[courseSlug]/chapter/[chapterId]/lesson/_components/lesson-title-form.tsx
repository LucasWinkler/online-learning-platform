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
import { ChangeLessonTitleSchema } from "~/schemas/lesson";
import { changeLessonTitle } from "~/server/actions/lesson";

type LessonTitleFormProps = {
  id: string;
  title: string;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const LessonTitleForm = forwardRef(
  (
    { id, title, onCancel, onPendingStateChange }: LessonTitleFormProps,
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      onPendingStateChange(isPending);
    }, [isPending, onPendingStateChange]);

    const changeLessonTitleForm = useForm<
      z.infer<typeof ChangeLessonTitleSchema>
    >({
      resolver: zodResolver(ChangeLessonTitleSchema),
      defaultValues: {
        id: id,
        title: title,
      },
    });

    const onSubmit = (values: z.infer<typeof ChangeLessonTitleSchema>) => {
      startTransition(async () => {
        await changeLessonTitle(values)
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
      submitForm: () => changeLessonTitleForm.handleSubmit(onSubmit)(),
    }));

    return (
      <Form {...changeLessonTitleForm}>
        <form onSubmit={changeLessonTitleForm.handleSubmit(onSubmit)}>
          <FormField
            control={changeLessonTitleForm.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    type="text"
                    placeholder="Enter your lesson title"
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

LessonTitleForm.displayName = "LessonTitleForm";
