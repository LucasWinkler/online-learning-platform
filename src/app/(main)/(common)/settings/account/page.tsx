import type { Metadata } from "next/types";

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
          <form>
            <Input
              disabled
              defaultValue={user.email}
              className="bg-background"
              placeholder="your.name@example.com"
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Save</Button>
        </CardFooter>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Linked accounts</CardTitle>
          <CardDescription>Manage your linked accounts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 xs:flex-row lg:gap-4">
          <LinkSocialProviders disabled />
        </CardContent>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardFooter className="border-t px-6 py-4">
          <DeleteAccountButton>Delete account</DeleteAccountButton>
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default AccountSettingsPage;
