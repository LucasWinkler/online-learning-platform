import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { AvatarUploadButton } from "./avatar-upload-button";

export const AvatarCard = () => {
  return (
    <Card className="relative border-0 bg-gray-50">
      <CardHeader className="block">
        <div className="flex justify-between gap-4">
          <div className="flex-1 flex-col">
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription className="my-3">
              Click on the picture or drag an image to upload a new one.
              <br />
              The image size must not exceed 2KB.
            </CardDescription>
          </div>
          <AvatarUploadButton className="ml-auto shrink-0 grow-0" />
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 sm:justify-start">
        A profile picture is optional but recommended.
      </CardFooter>
    </Card>
  );
};
