import type { FileRouter } from "uploadthing/next";

import Mux from "@mux/mux-node";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

import { env } from "~/env";
import getBase64 from "~/lib/plaiceholder";
import { auth } from "~/server/auth";
import { findCourseById, updateCourse } from "~/server/data-access/course";
import {
  findLessonByIdWithCourseAndChaptersAndMuxData,
  updateLesson,
} from "~/server/data-access/lesson";
import {
  createMuxData,
  deleteMuxDataById,
  findMuxDataByLessonId,
} from "~/server/data-access/mux-data";
import { isAuthorizedForCourseManagement } from "~/server/use-cases/authorization";
import { updateUserProfile } from "~/server/use-cases/user";

const utapi = new UTApi();

const f = createUploadthing();

const mux = new Mux({
  tokenId: env.MUX_TOKEN_ID,
  tokenSecret: env.MUX_TOKEN_SECRET,
});

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
  lessonVideo: f({
    video: { maxFileSize: "32MB", minFileCount: 1, maxFileCount: 1 },
  })
    .input(
      z.object({
        courseId: z.string(),
        lessonId: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const { lessonId, courseId } = input;

      if (!lessonId || !courseId) {
        throw new UploadThingError("Invalid input");
      }

      const user = (await auth())?.user;

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

      const lesson =
        await findLessonByIdWithCourseAndChaptersAndMuxData(lessonId);
      if (!lesson) {
        throw new UploadThingError("Lesson not found");
      }

      const { course } = lesson;
      const courseSlug = course.slug;
      const chapterId = lesson.chapterId;

      const currentVideoKey = lesson.video?.split("/f/")[1];

      return {
        userId: user.id,
        courseSlug,
        chapterId,
        lessonId,
        currentVideoKey,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const videoUrl = file.url;

      try {
        const existingMuxData = await findMuxDataByLessonId(metadata.lessonId);
        if (existingMuxData) {
          await mux.video.assets.delete(existingMuxData.assetId);
          await deleteMuxDataById(existingMuxData.id);
        }

        const asset = await mux.video.assets.create({
          input: [{ url: videoUrl }],
          playback_policy: ["public"],
          test: false,
        });

        await createMuxData({
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
          lessonId: metadata.lessonId,
        });

        await updateLesson(metadata.lessonId, {
          video: videoUrl,
        });

        if (metadata.currentVideoKey) {
          await utapi.deleteFiles(metadata.currentVideoKey);
        }
      } catch (error) {
        console.error(error);
        throw new UploadThingError("Error updating course thumbnail");
      }

      revalidatePath(
        `/manage/courses/${metadata.courseSlug}/chapter/${metadata.chapterId}/lesson/${metadata.lessonId}`,
      );

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
