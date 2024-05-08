
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { LinkSocialProviders } from "./link-social-providers";

export const LinkedAccountsCard = () => {
  return (
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
  );
};
