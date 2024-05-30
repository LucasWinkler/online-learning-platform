import type { Metadata } from "next";

import { findLessonById, findLessonIds } from "~/server/data-access/lesson";

export const dynamic = "force-dynamic";

export const generateStaticParams = async () => {
  const ids = await findLessonIds();

  return ids.map((lesson) => ({
    lessonId: lesson.id,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: LessonSetupParams;
}): Promise<Metadata> => {
  const lesson = await fetchLesson(params.lessonId);

  return {
    title: lesson?.title ?? "Lesson not found",
  };
};

const fetchLesson = async (id: string) => {
  return await findLessonById(id);
};

type LessonSetupParams = { lessonId: string };

type LessonSetupProps = {
  params: LessonSetupParams;
};

const LessonSetup = ({ params }: LessonSetupProps) => {
  return (
    <div>
      <p>Lesson ID: {params.lessonId}</p>
      <h1>Lesson Setup</h1>
    </div>
  );
};

export default LessonSetup;
