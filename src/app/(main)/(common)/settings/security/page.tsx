import type { Metadata } from "next/types";

import { Link } from "~/components/link";
import { Button, buttonVariants } from "~/components/ui/button";
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
import { currentUser } from "~/lib/auth";
import { cn } from "~/lib/utils";

import { SettingsWrapper } from "../_components/settings-wrapper";

export const metadata: Metadata = {
  title: "Security",
};

const SecuritySettingsPage = async () => {
  const user = await currentUser();
  const is2FAEnabled = false;

  return (
    <SettingsWrapper title="Security">
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
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
        <CardFooter className="flex flex-col items-start justify-start gap-4 border-t px-6 py-4 xs:flex-row xs:items-center xs:justify-between">
          <Button disabled>Update password</Button>
          <Link
            className={cn(
              buttonVariants({ variant: "link", size: "none" }),
              "text-foreground",
            )}
            href={`/auth/forgot-password?email=${user?.email}`}
          >
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Use your email to verify your account during sign-in.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t px-6 py-4">
          {/* TODO: Open modal asking for a code to enable/disable */}
          <Button disabled variant={is2FAEnabled ? "destructive" : "default"}>
            {is2FAEnabled ? "Disable" : "Enable"} 2FA
          </Button>
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default SecuritySettingsPage;