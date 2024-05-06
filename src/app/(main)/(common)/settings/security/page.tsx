import type { Metadata } from "next/types";

import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { TwoFactorAuthenticationForm } from "./_components/2fa-form";
import { ChangePasswordForm } from "./_components/change-password-card";

export const metadata: Metadata = {
  title: "Security",
};

const SecuritySettingsPage = () => {
  return (
    <SettingsWrapper title="Security">
      <ChangePasswordForm />
      <Card className="border-0 bg-gray-50">
        <CardHeader className="block">
          <CardTitle>Two-factor authentication (2FA)</CardTitle>
          <div className="float-right">
            <TwoFactorAuthenticationForm />
          </div>
          <p className="my-3 text-sm">
            Use your email to verify your account during sign-in.
          </p>
        </CardHeader>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
          2FA is optional but highly recommended.
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default SecuritySettingsPage;
