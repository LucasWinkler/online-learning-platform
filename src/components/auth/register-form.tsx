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
import { RegisterSchema } from "~/schemas/auth";
import { register } from "~/server/actions/register";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
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
    <AuthWrapper
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
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Full name"
                    disabled={isPending}
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
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
              control={registerForm.control}
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
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
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
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};
