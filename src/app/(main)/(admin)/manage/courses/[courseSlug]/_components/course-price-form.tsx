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
import { ChangeCoursePriceSchema } from "~/schemas/course";
import { changeCoursePrice } from "~/server/actions/course";

type CoursePriceFormProps = {
  id: string;
  price: number;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const CoursePriceForm = forwardRef(
  (
    { id, price, onCancel, onPendingStateChange }: CoursePriceFormProps,
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      onPendingStateChange(isPending);
    }, [isPending, onPendingStateChange]);

    const changeCoursePriceForm = useForm<
      z.infer<typeof ChangeCoursePriceSchema>
    >({
      resolver: zodResolver(ChangeCoursePriceSchema),
      defaultValues: {
        id: id,
        price: price ?? 0,
      },
    });

    const onSubmit = (values: z.infer<typeof ChangeCoursePriceSchema>) => {
      startTransition(async () => {
        await changeCoursePrice(values)
          .then(async (data) => {
            if (data?.error) {
              toast.error("Price Change Failed", {
                description: data.error,
              });
            }

            if (data?.success) {
              onCancel();
              toast.success("Price Changed", {
                description: data.success,
              });
            }
          })
          .catch(() => {
            toast.error("Price Change Failed", {
              description:
                "An unknown error occurred while changing your price.",
            });
          });
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => changeCoursePriceForm.handleSubmit(onSubmit)(),
    }));

    return (
      <Form {...changeCoursePriceForm}>
        <form onSubmit={changeCoursePriceForm.handleSubmit(onSubmit)}>
          <FormField
            control={changeCoursePriceForm.control}
            name="price"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1">
                <span className="pointer-events-none absolute left-2 top-0 h-10 select-none border-r border-border py-2 pr-1 text-gray-600 xxs:text-base xs:h-9 xs:text-sm">
                  $
                </span>
                <FormControl>
                  <Input
                    className="h-10 bg-background py-2 pl-7 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Enter your course price"
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

CoursePriceForm.displayName = "CoursePriceForm";
