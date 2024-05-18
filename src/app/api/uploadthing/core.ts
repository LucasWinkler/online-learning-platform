import type { FileRouter } from "uploadthing/next";

import { Role } from "@prisma/client";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import getBase64 from "~/lib/plaiceholder";
import { auth } from "~/server/auth";
import { updateCourse } from "~/server/data-access/course";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";
import { updateUserProfile } from "~/server/use-cases/user";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({
    image: { maxFileSize: "2MB", minFileCount: 1, maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      const user = session?.user;

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

  courseThumbnail: f({
    image: { maxFileSize: "2MB", minFileCount: 1, maxFileCount: 1 },
  })
    .middleware(async () => {
      const courseId = undefined;

      if (!courseId) {
        throw new UploadThingError("Course ID is required");
      }

      const session = await auth();
      const user = session?.user;

      if (user?.role !== Role.ADMIN) {
        throw new UploadThingError("Unauthorized");
      }

      const isAuthorized = await isAuthorizedForCourseManagement(
        courseId,
        user.id,
      );
      if (!isAuthorized) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id, courseId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrl = file.url;

      try {
        const blurDataURL = await getBase64(imageUrl);

        await updateCourse(metadata.courseId, {
          image: imageUrl,
          imageBlurData: blurDataURL,
        });
      } catch (error) {
        console.error(error);
        throw new UploadThingError("Error updating course thumbnail");
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
