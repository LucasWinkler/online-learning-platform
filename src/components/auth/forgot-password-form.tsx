"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ForgotPasswordSchema } from "~/schemas/auth";
import { forgotPassword } from "~/server/actions/forgot-password";

export const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const forgotPasswordForm = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: email ?? "",
    },
  });

  const handleAltActionOnClick = () => {
    router.back();
  };

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      await forgotPassword(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthCard
      title="Forgot your password?"
      description="Hang tight, we'll send you a reset link."
      altActionLinkText="Go back"
      altActionOnClick={handleAltActionOnClick}
    >
      <Form {...forgotPasswordForm}>
        <form
          onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel htmlFor="email" className="text-base xs:text-sm">
                    Email
                  </FormLabel>
                  <Input
                    autoComplete="email"
                    id="email"
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    disabled={isPending}
                    placeholder="name@example.com"
                    {...field}
                  />
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
              "Send email"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
