import type { Metadata } from "next/types";

import { UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { currentUser } from "~/lib/auth";

import { SettingsWrapper } from "../_components/settings-wrapper";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = async () => {
  const user = await currentUser();

  return (
    <SettingsWrapper title="Profile">
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-center gap-4">
            <Avatar className="mr-2 size-[4.5rem]">
              <AvatarImage src={user.image} />
              <AvatarFallback>
                <UserRoundIcon className="size-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-4">
              <Button disabled>Upload</Button>
              <Button disabled variant="outline">
                Remove
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="border-0 bg-gray-50">
        <CardHeader>
          <CardTitle>Full name</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              disabled
              className="bg-background"
              defaultValue={user.name}
              placeholder="Your full name"
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Save</Button>
        </CardFooter>
      </Card>
    </SettingsWrapper>
  );
};

export default ProfileSettingsPage;
