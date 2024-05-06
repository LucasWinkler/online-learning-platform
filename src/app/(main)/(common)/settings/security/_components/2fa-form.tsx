"use client";

import type { z } from "zod";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  FormMessage,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { ToggleTwoFactorAuthenticationSchema } from "~/schemas/auth";
import { toggleTwoFactorAuthentication } from "~/server/actions/toggle-2fa";

export const TwoFactorAuthenticationForm = () => {
  const { data: session, update } = useSession();
  const initialIsTwoFactorEnabled = !!session?.user?.isTwoFactorEnabled;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleTwoFactorAuthenticationForm = useForm<
    z.infer<typeof ToggleTwoFactorAuthenticationSchema>
  >({
    resolver: zodResolver(ToggleTwoFactorAuthenticationSchema),
    defaultValues: {
      isTwoFactorEnabled: initialIsTwoFactorEnabled,
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof ToggleTwoFactorAuthenticationSchema>,
  ) => {
    console.log("values", values);

    startTransition(async () => {
      await toggleTwoFactorAuthentication(values)
        .then(async (data) => {
          console.log("data:", data);

          if (data.error) {
            toggleTwoFactorAuthenticationForm.resetField("isTwoFactorEnabled");
            toast.error(data.error);
          }

          if (data.success) {
            await update({
              user: { isTwoFactorEnabled: values.isTwoFactorEnabled },
            });
            toast.success(data.success);
          }
        })
        .catch(() => {
          toggleTwoFactorAuthenticationForm.resetField("isTwoFactorEnabled");
          toast.error(
            `Unable to ${initialIsTwoFactorEnabled ? "disable" : "enable"} 2FA`,
          );
        })
        .finally(() => {
          setIsDialogOpen(false);
        });
    });
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <Switch
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
            className={initialIsTwoFactorEnabled ? "text-destructive" : ""}
          >
            Are you sure you want to{" "}
            {initialIsTwoFactorEnabled ? "disable" : "enable"} 2FA?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span>
              {initialIsTwoFactorEnabled
                ? "Disabling 2FA is not recommended. It will make your account more vulnerable."
                : "Enabling 2FA is highly recommended. It requires an authentication code when you sign in with a valid email and password."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => {
              setIsDialogOpen(false);
              toggleTwoFactorAuthenticationForm.resetField(
                "isTwoFactorEnabled",
              );
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Form {...toggleTwoFactorAuthenticationForm}>
            <form
              onSubmit={toggleTwoFactorAuthenticationForm.handleSubmit(
                handleSubmit,
              )}
            >
              <FormField
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
                    <FormMessage className="mt-1" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant={initialIsTwoFactorEnabled ? "destructive" : "default"}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                ) : (
                  `${initialIsTwoFactorEnabled ? "Disable" : "Enable"} 2FA`
                )}
              </Button>
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
