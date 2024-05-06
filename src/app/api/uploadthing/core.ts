import type { FileRouter } from "uploadthing/next";

import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { currentUser } from "~/lib/auth";
import { updateUserProfile } from "~/server/use-cases/user";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({
    image: { maxFileSize: "2MB" },
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrl = file.url;

      try {
        await updateUserProfile(metadata.userId, { image: imageUrl });
      } catch (error) {
        console.error(error);
        throw new UploadThingError("Error updating user avatar");
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
