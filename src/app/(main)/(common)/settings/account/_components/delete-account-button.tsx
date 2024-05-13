"use client";

import type { z } from "zod";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";

import { FloatingLabelInput } from "~/components/floating-label-input";
import { FormError } from "~/components/form-error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { buttonVariants } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { DELETE_ACCOUNT_PHRASE } from "~/constants";
import { DeleteAccountSchema } from "~/schemas/auth";
import { deleteAccount } from "~/server/actions/delete-account";

export const DeleteAccountDialogWithTrigger = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const deleteAccountForm = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      confirmationPhrase: "",
    },
  });

  const { watch } = deleteAccountForm;
  const confirmationPhrase = watch("confirmationPhrase");
  const isPhraseCorrect =
    confirmationPhrase.toLowerCase() === DELETE_ACCOUNT_PHRASE.toLowerCase();

  const handleSubmit = async (values: z.infer<typeof DeleteAccountSchema>) => {
    setError(undefined);

    startTransition(async () => {
      await deleteAccount(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            handleDialogClose();

            void signOut({
              redirect: true,
              callbackUrl: "/auth/account-deleted",
            });
          }
        })
        .catch(() => {
          setError("Unable to delete account");
        });
    });
  };

  const handleDeleteButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive", size: "sm" })}
        onClick={handleDeleteButtonClick}
      >
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col flex-wrap">
            <span className="font-bold">This action is irreversible.</span>
            <span>
              Please enter the phrase{" "}
              <span className="inline font-mono text-destructive">
                delete account
              </span>{" "}
              to confirm.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...deleteAccountForm}>
          <form
            className="space-y-4"
            onSubmit={deleteAccountForm.handleSubmit(handleSubmit)}
          >
            <FormField
              control={deleteAccountForm.control}
              name="confirmationPhrase"
              render={({ field }) => (
                <FormItem className="relative">
                  <FloatingLabelInput
                    label="Phrase"
                    disabled={isPending}
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDialogClose}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={isPending || !isPhraseCorrect}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isPending && (
                  <Loader2Icon className="mr-1 size-4 animate-spin" />
                )}
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
