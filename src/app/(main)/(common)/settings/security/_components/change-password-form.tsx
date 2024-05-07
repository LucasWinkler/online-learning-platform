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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangePasswordSchema } from "~/schemas/auth";
import { changePassword } from "~/server/actions/change-password";

import { ForgotPasswordButton } from "../../_components/forgot-password-button";

export const ChangePasswordForm = () => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const user = session?.user;
  const isDisabled = !!user?.isOAuth || isPending;

  const changePasswordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startTransition(async () => {
      await changePassword(values)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }

          if (data?.success) {
            changePasswordForm.reset();
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error("An error occurred while changing the password.");
        });
    });
  };

  return (
    <Form {...changePasswordForm}>
      <form onSubmit={changePasswordForm.handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <FormField
            control={changePasswordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="currentPassword"
                  className="text-base xs:text-sm"
                >
                  Current Password
                </FormLabel>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    disabled={isDisabled}
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </div>
                <FormMessage className="mt-1 text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={changePasswordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="newPassword"
                  className="text-base xs:text-sm"
                >
                  New Password
                </FormLabel>
                <div className="relative">
                  <Input
                    id="newPassword"
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    disabled={isDisabled}
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </div>
                <FormMessage className="mt-1 text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={changePasswordForm.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="confirmNewPassword"
                  className="text-base xs:text-sm"
                >
                  Confirm New Password
                </FormLabel>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    disabled={isDisabled}
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </div>
                <FormMessage className="mt-1 text-sm" />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-4 border-t px-6 py-3 text-sm font-light text-gray-600 sm:flex-row sm:justify-between">
          {!!user?.isOAuth ? (
            <p>
              Your account can only manage passwords through your third-party
              account provider.
            </p>
          ) : (
            <>
              <ForgotPasswordButton
                disabled={isDisabled}
                redirectTo={`/auth/forgot-password?email=${user?.email}`}
              >
                Forgot password?
              </ForgotPasswordButton>
              <Button type="submit" disabled={isDisabled} size="sm">
                {isPending ? (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                ) : (
                  "Update password"
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Form>
  );
};
