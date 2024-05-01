/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next/types";

import { UserRoundIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { auth } from "~/server/auth";

import { SettingsWrapper } from "../_components/settings-wrapper";

// metadata title
export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = session.user;

  return (
    <SettingsWrapper title="Profile">
      <Card>
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex items-center gap-4">
            <Avatar className="mr-2 size-[4.5rem]">
              <AvatarImage src={user.image} />
              <AvatarFallback>
                <UserRoundIcon className="size-8" />
              </AvatarFallback>
            </Avatar>
            <Button disabled>Upload</Button>
            <Button disabled variant="outline">
              Remove
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Full name</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <Input disabled defaultValue={user.name} placeholder="Full name" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              defaultValue={user.email}
              disabled
              type="email"
              placeholder="Email"
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
