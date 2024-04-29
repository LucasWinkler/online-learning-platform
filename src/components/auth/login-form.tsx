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
import { Link } from "~/components/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { cn } from "~/lib/utils";
import { LoginSchema } from "~/schemas/auth";
import { login } from "~/server/actions/login";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Please sign in using your original login method to continue."
      : "";

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      await login(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthWrapper
      title="Welcome back"
      description="Enter your details to start learning today!"
      altActionText="New here?"
      altActionLinkText="Create account"
      altActionHref="/auth/register"
      showSocialList
      socialListPosition="top"
      socialListLayoutType="icon-name-only"
    >
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={loginForm.control}
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
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Password"
                    disabled={isPending}
                    type="password"
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                  <Link
                    href="/auth/reset"
                    className={cn(
                      buttonVariants({ variant: "link", size: "sm" }),
                      "mt-2 h-auto px-0 ",
                    )}
                  >
                    Forgot password?
                  </Link>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error ?? urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2Icon className="h-5 w-5 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};
