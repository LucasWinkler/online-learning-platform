"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthWrapper } from "~/components/auth/auth-wrapper";
import { FloatingLabelInput } from "~/components/floating-label-input";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { ResetSchema } from "~/schemas/auth";
import { resetPassword } from "~/server/actions/reset-password";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const resetForm = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      await resetPassword(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthWrapper
      title="Forgot your password?"
      description="Hang tight, we'll send you a reset link."
      altActionLinkText="Back to login"
      altActionHref="/auth/login"
    >
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Email"
                    disabled={isPending}
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
              "Send email"
            )}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};
