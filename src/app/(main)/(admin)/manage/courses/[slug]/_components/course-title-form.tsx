"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useTransition,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangeCourseTitleSchema } from "~/schemas/course";
import { changeCourseTitle } from "~/server/actions/course";

type CourseTitleFormProps = {
  id: string;
  title: string;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const CourseTitleForm = forwardRef(
  (
    { id, title, onCancel, onPendingStateChange }: CourseTitleFormProps,
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      onPendingStateChange(isPending);
    }, [isPending, onPendingStateChange]);

    const changeCourseTitleForm = useForm<
      z.infer<typeof ChangeCourseTitleSchema>
    >({
      resolver: zodResolver(ChangeCourseTitleSchema),
      defaultValues: {
        id: id,
        title: title,
      },
    });

    const onSubmit = (values: z.infer<typeof ChangeCourseTitleSchema>) => {
      startTransition(async () => {
        await changeCourseTitle(values)
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
      submitForm: () => changeCourseTitleForm.handleSubmit(onSubmit)(),
    }));

    return (
      <Form {...changeCourseTitleForm}>
        <form onSubmit={changeCourseTitleForm.handleSubmit(onSubmit)}>
          <FormField
            control={changeCourseTitleForm.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    type="text"
                    placeholder="Enter your course title"
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

CourseTitleForm.displayName = "CourseTitleForm";
