import type { User } from "next-auth";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type EmailCardProps = {
  user?: User;
};

export const EmailCard = ({ user }: EmailCardProps) => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader>
        <CardTitle>Email</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border bg-background px-2 py-2 text-sm font-light text-gray-400">
          {user?.email ?? "N/A"}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
        You are not able to change your email.
      </CardFooter>
    </Card>
  );
};
