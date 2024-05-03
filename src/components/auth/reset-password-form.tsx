"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthCard } from "~/components/auth/auth-card";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ResetPasswordSchema } from "~/schemas/auth";
import { resetPassword } from "~/server/actions/reset-password";

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      await resetPassword(values, token).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthCard
      title="Resetting your password?"
      description="Please enter your new password below."
      altActionLinkText="Back to login"
      altActionHref="/auth/login"
    >
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel
                    htmlFor="password"
                    className="text-base xs:text-sm"
                  >
                    New password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      autoComplete="new-password"
                      id="password"
                      className="h-10 bg-background py-1 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                      {...field}
                    />
                  </div>
                  <FormMessage className="mt-1 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel
                    htmlFor="confirmPassword"
                    className="text-base xs:text-sm"
                  >
                    Confirm password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      autoComplete="new-password"
                      id="confirmPassword"
                      className="h-10 bg-background py-1 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                      disabled={isPending}
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </div>
                  <FormMessage className="mt-1 text-sm" />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="h-10 w-full py-3 text-base xs:h-9 xs:px-4 xs:py-2 xs:text-sm"
          >
            {isPending ? (
              <Loader2Icon className="size-6 animate-spin xs:size-5" />
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
