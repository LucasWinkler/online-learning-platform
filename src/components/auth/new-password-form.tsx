"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthWrapper } from "~/components/auth/auth-wrapper";
import { FloatingLabelInput } from "~/components/floating-label-input";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { NewPasswordSchema } from "~/schemas/auth";
import { newPassword } from "~/server/actions/new-password";

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetForm = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      await newPassword(values, token).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthWrapper
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
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="New password"
                    disabled={isPending}
                    type="password"
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Confirm password"
                    disabled={isPending}
                    type="password"
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2Icon className="h-5 w-5 animate-spin" />
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};
