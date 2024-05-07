"use client";

import type { z } from "zod";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangeNameSchema } from "~/schemas/auth";
import { changeName } from "~/server/actions/change-name";

export const ChangeNameForm = () => {
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();

  const user = session?.user;

  const changeNameForm = useForm<z.infer<typeof ChangeNameSchema>>({
    resolver: zodResolver(ChangeNameSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof ChangeNameSchema>) => {
    startTransition(async () => {
      await changeName(values)
        .then(async (data) => {
          if (data?.error) {
            toast.error(data.error);
          }

          if (data?.success) {
            await update({
              user: {
                ...user,
                name: values.name,
              },
            });
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error("An error occurred while updating your name.");
        });
    });
  };

  return (
    <Form {...changeNameForm}>
      <form onSubmit={changeNameForm.handleSubmit(onSubmit)}>
        <CardContent>
          <FormField
            control={changeNameForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <Input
                  className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                  type="text"
                  placeholder="John Doe"
                  {...field}
                />
                <FormMessage className="mt-1 text-sm" />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-end">
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? (
              <Loader2Icon className="h-5 w-5 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
