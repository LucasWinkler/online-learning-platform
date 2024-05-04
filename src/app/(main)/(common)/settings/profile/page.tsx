import type { Metadata } from "next/types";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { currentUser } from "~/lib/auth";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { AvatarButton } from "./_components/avatar-button";
import { FullNameForm } from "./_components/full-name-form";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = async () => {
  const user = await currentUser();

  return (
    <SettingsWrapper title="Profile">
      <Card className="relative border-0 bg-gray-50">
        <CardHeader className="block">
          <div className="float-right flex">
            <AvatarButton user={user} />
          </div>
          <CardTitle className="">Profile picture</CardTitle>
          <p className="my-3 text-sm">
            This is your profile picture.
            <br />
            Click on the picture to upload a new one.
          </p>
        </CardHeader>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
          A profile picture is optional but recommended.
        </CardFooter>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Full name</CardTitle>
        </CardHeader>
        <CardContent>
          <FullNameForm user={user} />
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-end">
          <Button size="sm" disabled>
            Save
          </Button>
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default ProfileSettingsPage;
