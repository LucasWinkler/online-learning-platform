import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ChangeEmailForm } from "./change-email-form";

export const ChangeEmailCard = () => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          You will be required to verify your email to confirm the change.
        </CardDescription>
      </CardHeader>
      <ChangeEmailForm />
    </Card>
  );
};
