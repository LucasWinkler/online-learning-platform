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
import { FormWarning } from "~/components/form-warning";
import { Link } from "~/components/link";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { LoginSchema } from "~/schemas/auth";
import { login } from "~/server/actions/login";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [warning, setWarning] = useState<string | undefined>();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Please sign in using your original login method to continue."
      : "";

  const altActionHref = (): string => {
    if (callbackUrl) {
      return showTwoFactor
        ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : `/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }

    return showTwoFactor ? "/auth/login" : "/auth/register";
  };

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const emailValue = loginForm.getValues().email;
  const forgotPasswordHref = emailValue
    ? `/auth/forgot-password?email=${emailValue}`
    : "/auth/forgot-password";

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    setWarning(undefined);

    if (showTwoFactor && values.code?.length === 0) {
      setError("No 2FA code provided.");
      return;
    }

    startTransition(async () => {
      await login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            if (!data.twoFactor) {
              loginForm.reset();
            }

            setSuccess(data.success);
          }

          if (data?.warning) {
            setWarning(data.warning);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError("An error occurred while logging in.");
        });
    });
  };

  const onAltActionClick = () => {
    setShowTwoFactor(false);
    setWarning(undefined);
    setError(undefined);
    setSuccess(undefined);
    loginForm.resetField("code");
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Enter your details to start learning today!"
      altActionText={showTwoFactor ? undefined : "New here?"}
      altActionLinkText={showTwoFactor ? "Back to login" : "Sign up"}
      altActionHref={altActionHref()}
      altActionOnClick={showTwoFactor ? () => onAltActionClick() : undefined}
      showSocialList
      socialListPosition="top"
      socialListLayoutType="icon-name-only"
    >
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={loginForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-base xs:text-sm">
                      Two Factor Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="123456"
                        autoComplete="one-time-code"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-sm" />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base xs:text-sm">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                          type="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-base xs:text-sm">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            className="h-10 bg-background py-1 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                            type="password"
                            placeholder="********"
                            autoComplete="current-password"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="mt-1 text-sm" />
                      <Link
                        href={forgotPasswordHref}
                        className={cn(
                          buttonVariants({ variant: "link", size: "sm" }),
                          "mt-2 h-auto self-start px-0 xxs:text-base xs:text-sm",
                        )}
                      >
                        Forgot password?
                      </Link>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error ?? urlError} />
          <FormSuccess message={success} />
          <FormWarning message={warning} />
          <Button
            disabled={isPending}
            type="submit"
            className="h-10 w-full py-3 text-base xs:h-9 xs:px-4 xs:py-2 xs:text-sm"
          >
            {isPending && <Loader2Icon className="mr-1 size-4 animate-spin" />}
            {showTwoFactor ? "Continue" : "Sign In"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
