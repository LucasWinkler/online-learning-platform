import type { Metadata } from "next/types";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { currentUser } from "~/lib/auth";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { TwoFactorAuthenticationForm } from "./_components/2fa-form";
import { ChangePasswordForm } from "./_components/change-password-card";

export const metadata: Metadata = {
  title: "Security",
};

const SecuritySettingsPage = async () => {
  const user = await currentUser();

  return (
    <SettingsWrapper title="Security">
      <ChangePasswordForm user={user} />
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription className="text-sm">
            Use your email to verify your account during sign-in.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-end">
          <TwoFactorAuthenticationForm user={user} />
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default SecuritySettingsPage;
