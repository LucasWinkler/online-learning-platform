import { db } from "~/server/db";

export const createMuxData = async ({
  assetId,
  lessonId,
  playbackId,
}: {
  assetId: string;
  lessonId: string;
  playbackId?: string;
}) => {
  return await db.muxData.create({
    data: { assetId, lessonId, playbackId },
  });
};

export const findMuxDataByLessonId = async (lessonId: string) => {
  return await db.muxData.findFirst({
    where: {
      lessonId,
    },
  });
};

export const deleteMuxDataById = async (id: string) => {
  return await db.muxData.delete({
    where: {
      id,
    },
  });
};
