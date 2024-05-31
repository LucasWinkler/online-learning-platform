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
import { Textarea } from "~/components/ui/textarea";
import { ChangeLessonDescriptionSchema } from "~/schemas/lesson";
import { changeLessonDescription } from "~/server/actions/lesson";

type LessonDescriptionFormProps = {
  id: string;
  description: string | null;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const LessonDescriptionForm = forwardRef(
  (
    {
      id,
      description,
      onCancel,
      onPendingStateChange,
    }: LessonDescriptionFormProps,
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      onPendingStateChange(isPending);
    }, [isPending, onPendingStateChange]);

    const changeLessonDescriptionForm = useForm<
      z.infer<typeof ChangeLessonDescriptionSchema>
    >({
      resolver: zodResolver(ChangeLessonDescriptionSchema),
      defaultValues: {
        id: id,
        description: description ?? "",
      },
    });

    const onSubmit = (
      values: z.infer<typeof ChangeLessonDescriptionSchema>,
    ) => {
      startTransition(async () => {
        await changeLessonDescription(values)
          .then(async (data) => {
            if (data?.error) {
              toast.error("Description Change Failed", {
                description: data.error,
              });
            }

            if (data?.success) {
              onCancel();
              toast.success("Description Changed", {
                description: data.success,
              });
            }
          })
          .catch(() => {
            toast.error("Description Change Failed", {
              description:
                "An unknown error occurred while changing your description.",
            });
          });
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => changeLessonDescriptionForm.handleSubmit(onSubmit)(),
    }));

    return (
      <Form {...changeLessonDescriptionForm}>
        <form onSubmit={changeLessonDescriptionForm.handleSubmit(onSubmit)}>
          <FormField
            control={changeLessonDescriptionForm.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormControl>
                  <Textarea
                    className="bg-background py-2 xxs:text-base xs:py-1 xs:text-sm"
                    placeholder="Describe your lesson"
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

LessonDescriptionForm.displayName = "LessonDescriptionForm";
