"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { ToggleTwoFactorAuthenticationSchema } from "~/schemas/auth";
import { toggleTwoFactorAuthentication } from "~/server/actions/toggle-2fa";

export const Toggle2FAForm = () => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const isTwoFactorEnabled = user?.isTwoFactorEnabled ?? false;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const isDisabled = session?.user?.isOAuth ?? isPending;

  const toggleTwoFactorAuthenticationForm = useForm<
    z.infer<typeof ToggleTwoFactorAuthenticationSchema>
  >({
    resolver: zodResolver(ToggleTwoFactorAuthenticationSchema),
    defaultValues: {
      isTwoFactorEnabled: isTwoFactorEnabled,
      code: "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof ToggleTwoFactorAuthenticationSchema>,
  ) => {
    setError(undefined);
    setMessage(undefined);

    if (showCodeInput && values.code?.length === 0) {
      setError("No 2FA code provided.");
      return;
    }

    startTransition(async () => {
      await toggleTwoFactorAuthentication(values)
        .then(async (data) => {
          setShowCodeInput(data.showCodeInput);

          if (data.showCodeInput) {
            if (data.error) {
              setError(data.error);
            }

            if (data.message) {
              setMessage(data.message);
            }

            return;
          }

          if (data.error) {
            toast.error("2FA Verification Failed", {
              description: data.error,
            });
            toggleTwoFactorAuthenticationForm.resetField("isTwoFactorEnabled");
            setIsDialogOpen(false);
          }

          if (data.success) {
            await update({
              user: { isTwoFactorEnabled: data.isTwoFactorEnabled },
            });
            toggleTwoFactorAuthenticationForm.resetField("code");
            toast.success("2FA Settings Successfully Changed", {
              description: data.success,
            });
            setIsDialogOpen(false);
            setShowCodeInput(false);
          }
        })
        .catch(() => {
          toggleTwoFactorAuthenticationForm.resetField("isTwoFactorEnabled");
          toast.error("2FA Verification Failed", {
            description:
              "An unknown error occurred while changing your 2FA settings.",
          });
          setShowCodeInput(false);
          setIsDialogOpen(false);
        });
    });
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <Switch
        disabled={isDisabled}
        checked={
          toggleTwoFactorAuthenticationForm.getValues().isTwoFactorEnabled
        }
        onCheckedChange={(checked) => {
          toggleTwoFactorAuthenticationForm.setValue(
            "isTwoFactorEnabled",
            checked,
          );
          setIsDialogOpen(true);
        }}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={isTwoFactorEnabled ? "text-destructive" : ""}
          >
            {showCodeInput ? (
              <span>
                One last step to {isTwoFactorEnabled ? "disable" : "enable"}{" "}
                2FA.
              </span>
            ) : (
              <span>
                Are you sure you want to{" "}
                {isTwoFactorEnabled ? "disable" : "enable"} 2FA?
              </span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            {showCodeInput ? (
              <span>
                A verification code has been sent to your email. To{" "}
                {isTwoFactorEnabled ? "disable" : "enable"} 2FA you must enter
                the code.
              </span>
            ) : (
              <span>
                {isTwoFactorEnabled
                  ? "Disabling 2FA is not recommended. It will make your account more vulnerable."
                  : "Enabling 2FA is highly recommended. It requires an authentication code when you sign in with a valid email and password."}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...toggleTwoFactorAuthenticationForm}>
          <form
            className="space-y-4"
            onSubmit={toggleTwoFactorAuthenticationForm.handleSubmit(
              handleSubmit,
            )}
          >
            {showCodeInput && (
              <FormField
                disabled={isDisabled}
                control={toggleTwoFactorAuthenticationForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="code" className="text-base xs:text-sm">
                      Two Factor Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        id="code"
                        className="h-10 bg-background py-2 xxs:text-base xs:h-9 xs:py-1 xs:text-sm"
                        disabled={isPending}
                        placeholder="123456"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-sm" />
                  </FormItem>
                )}
              />
            )}
            <FormError message={error} />
            <FormSuccess message={message} />
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDisabled}
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowCodeInput(false);
                  setMessage(undefined);
                  setError(undefined);
                  toggleTwoFactorAuthenticationForm.reset();
                }}
              >
                Cancel
              </AlertDialogCancel>
              {!showCodeInput && (
                <FormField
                  disabled={isDisabled}
                  control={toggleTwoFactorAuthenticationForm.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="hidden"
                          value={field.value.toString()}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-sm" />
                    </FormItem>
                  )}
                />
              )}
              <Button
                type="submit"
                variant={isTwoFactorEnabled ? "destructive" : "default"}
                disabled={isDisabled}
              >
                {isPending && (
                  <Loader2Icon className="mr-1 size-4 animate-spin" />
                )}
                {isTwoFactorEnabled ? "Disable" : "Enable"} 2FA
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
