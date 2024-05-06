import type { Metadata } from "next/types";

import { AvatarUploadButton } from "~/components/avatar-upload-button";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { FullNameForm } from "./_components/full-name-form";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = () => {
  return (
    <SettingsWrapper title="Profile">
      <Card className="relative border-0 bg-gray-50">
        <CardHeader className="block">
          <AvatarUploadButton className="float-right flex" />
          <CardTitle className="">Profile picture</CardTitle>
          <p className="my-3 text-sm">
            This is your profile picture.
            <br />
            Click on the picture or drag an image to upload a new one
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
          <FullNameForm />
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
