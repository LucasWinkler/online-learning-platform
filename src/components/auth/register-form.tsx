"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
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
import { RegisterSchema } from "~/schemas/auth";
import { register } from "~/server/actions/register";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      await register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <AuthCard
      title="Create account"
      description="Enter your details to start learning today!"
      altActionText="Have an account?"
      altActionLinkText="Login"
      altActionHref="/auth/login"
      showSocialList
      socialListPosition="top"
      socialListLayoutType="icon-name-only"
    >
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel htmlFor="name" className="text-base xs:text-sm">
                    Full name
                  </FormLabel>
                  <Input
                    id="name"
                    className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                    disabled={isPending}
                    placeholder="John Doe"
                    {...field}
                  />
                  <FormMessage className="mt-1 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel htmlFor="email" className="text-base xs:text-sm">
                    Email
                  </FormLabel>
                  <Input
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
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel
                    htmlFor="password"
                    className="text-base xs:text-sm"
                  >
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
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
            <FormField
              control={registerForm.control}
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
                      id="confirmPassword"
                      className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
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
              <>
                <span className="sr-only">Registering...</span>
                <Loader2Icon className="size-6 animate-spin xs:size-5" />
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
