"use client";

import { useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ForgotPasswordButton } from "../../_components/forgot-password-button";

export const ChangePasswordForm = () => {
  const { data: session, update } = useSession();
  const user = session?.user;

  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription className="text-sm">
          Your password must be at least 8 characters long.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Label>Current password</Label>
          <div className="relative">
            <Input
              disabled
              className="bg-background"
              type="password"
              placeholder="********"
            />
          </div>
          <Label>New password</Label>
          <div className="relative">
            <Input
              disabled
              className="bg-background"
              type="password"
              placeholder="********"
            />
          </div>
          <Label>Confirm new password</Label>
          <div className="relative">
            <Input
              disabled
              className="bg-background"
              type="password"
              placeholder="********"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-4 border-t px-6 py-3 text-sm font-light text-gray-600 sm:flex-row sm:justify-between">
        <ForgotPasswordButton
          redirectTo={`/auth/forgot-password?email=${user?.email}`}
        >
          Forgot password?
        </ForgotPasswordButton>
        <Button disabled size="sm">
          Update password
        </Button>
      </CardFooter>
    </Card>
  );
};
