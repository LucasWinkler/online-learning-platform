import type { Metadata } from "next/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { currentUser } from "~/lib/auth";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { DeleteAccountButton } from "./_components/delete-account-button";
import { LinkSocialProviders } from "./_components/link-social-providers";

export const metadata: Metadata = {
  title: "Account",
};

const AccountSettingsPage = async () => {
  const user = await currentUser();

  return (
    <SettingsWrapper title="Account">
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border bg-background px-2 py-2 text-sm font-light text-gray-400">
            {user?.email}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
          You are not able to change your email.
        </CardFooter>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Linked accounts</CardTitle>
          <CardDescription className="text-sm">
            Manage your account providers. These accounts are used to login to
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 xs:flex-row lg:gap-4">
          <LinkSocialProviders disabled />
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
          You are currently not able to link your account with another provider.
        </CardFooter>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription className="text-sm">
            Permanently delete your account and all of its content from the
            platform. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-end">
          <DeleteAccountButton size="sm">Delete Account</DeleteAccountButton>
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default AccountSettingsPage;
