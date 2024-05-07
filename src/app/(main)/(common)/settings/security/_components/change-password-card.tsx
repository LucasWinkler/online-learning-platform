import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ChangePasswordForm } from "./change-password-form";

export const ChangePasswordCard = () => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription className="text-sm">
          Your password must be at least 8 characters long.
        </CardDescription>
      </CardHeader>
      <ChangePasswordForm />
    </Card>
  );
};
