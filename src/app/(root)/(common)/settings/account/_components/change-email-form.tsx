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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangeEmailSchema } from "~/schemas/auth";
import { changeEmail } from "~/server/actions/change-email";

export const ChangeEmailForm = () => {
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();

  const user = session?.user;
  const isDisabled = !!user?.isOAuth || isPending;

  const changeNameForm = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      email: user?.email ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof ChangeEmailSchema>) => {
    startTransition(async () => {
      await changeEmail(values)
        .then(async (data) => {
          if (data?.error) {
            toast.error("Email Change Failed", {
              description: data.error,
            });
          }

          if (data?.success) {
            await update({
              user: {
                ...user,
                email: values.email,
              },
            });

            toast.success("Email Successfully Changed", {
              description: data.success,
            });
          }
        })
        .catch(() => {
          toast.error("Email Change Failed", {
            description: "An unknown error occurred while changing your email.",
          });
        });
    });
  };

  return (
    <Form {...changeNameForm}>
      <form onSubmit={changeNameForm.handleSubmit(onSubmit)}>
        <CardContent>
          <FormField
            control={changeNameForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="off"
                    disabled={isDisabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-sm" />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-end">
          {!!user?.isOAuth ? (
            <p>
              You can not change your email because you signed up through a
              third-party social account.
            </p>
          ) : (
            <Button type="submit" disabled={isDisabled} size="sm">
              {isPending && (
                <Loader2Icon className="mr-1 size-4 animate-spin" />
              )}
              Update Email
            </Button>
          )}
        </CardFooter>
      </form>
    </Form>
  );
};
