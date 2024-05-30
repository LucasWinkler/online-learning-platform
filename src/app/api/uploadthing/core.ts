import type { FileRouter } from "uploadthing/next";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

import getBase64 from "~/lib/plaiceholder";
import { auth } from "~/server/auth";
import { findCourseById, updateCourse } from "~/server/data-access/course";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";
import { updateUserProfile } from "~/server/use-cases/user";

const utapi = new UTApi();

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({
    image: { maxFileSize: "2MB", minFileCount: 1, maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = (await auth())?.user;

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      const currentImageKey = user.image?.split("/f/")[1];

      return { userId: user.id, currentImageKey };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrl = file.url;

      try {
        await updateUserProfile(metadata.userId, { image: imageUrl });

        if (metadata.currentImageKey) {
          await utapi.deleteFiles(metadata.currentImageKey);
        }
      } catch (error) {
        console.error(error);
        throw new UploadThingError("Error updating user avatar");
      }

      return { uploadedBy: metadata.userId, url: imageUrl };
    }),

  courseThumbnail: f({
    image: { maxFileSize: "2MB", minFileCount: 1, maxFileCount: 1 },
  })
    .input(
      z.object({
        courseId: z.string(),
        courseSlug: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const courseId = input.courseId;

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

      const course = await findCourseById(courseId);
      if (!course) {
        throw new UploadThingError("Course not found");
      }

      const currentImageKey = course.image?.split("/f/")[1];
      const courseSlug = input.courseSlug;

      return {
        userId: user.id,
        courseId,
        courseSlug,
        currentImageKey,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrl = file.url;

      try {
        const blurDataURL = await getBase64(imageUrl);

        await updateCourse(metadata.courseId, {
          image: imageUrl,
          imageBlurData: blurDataURL,
        });

        if (metadata.currentImageKey) {
          await utapi.deleteFiles(metadata.currentImageKey);
        }
      } catch (error) {
        console.error(error);
        throw new UploadThingError("Error updating course thumbnail");
      }

      revalidatePath(`/manage/courses/${metadata.courseSlug}`);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
