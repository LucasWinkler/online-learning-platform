import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { DeleteAccountDialogWithTrigger } from "./delete-account-button";

export const DeleteAccountCard = () => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription className="text-sm">
          Permanently delete your account and all of its content from the
          platform. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-end">
        <DeleteAccountDialogWithTrigger />
      </CardFooter>
    </Card>
  );
};
