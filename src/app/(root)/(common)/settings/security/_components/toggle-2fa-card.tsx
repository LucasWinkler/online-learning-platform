import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { currentUser } from "~/lib/auth";

import { Toggle2FAForm } from "./toggle-2fa-form";

const Toggle2FACard = async () => {
  const user = await currentUser();
  const isOAuth = !!user?.isOAuth;

  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader className="block">
        <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
        <div className="float-right ml-4">
          <Toggle2FAForm />
        </div>
        <CardDescription className="my-3">
          Use your email to verify your account during sign-in.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
        {isOAuth
          ? "Your account can only manage 2FA through your third-party account provider."
          : "2FA is optional but highly recommended."}
      </CardFooter>
    </Card>
  );
};

export default Toggle2FACard;
