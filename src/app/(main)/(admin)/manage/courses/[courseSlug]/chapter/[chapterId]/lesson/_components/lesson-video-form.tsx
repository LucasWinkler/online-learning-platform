"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UploadDropzone } from "~/lib/uploadthing";

type LessonVideoFormProps = {
  id: string;
  courseId: string;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const LessonVideoForm = ({
  id,
  courseId,
  onCancel,
  onPendingStateChange,
}: LessonVideoFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onPendingStateChange(isPending);
  }, [isPending, onPendingStateChange]);

  return (
    <UploadDropzone
      className="cursor-pointer bg-background transition-colors duration-200 ease-out hover:bg-gray-100"
      endpoint="lessonVideo"
      onClientUploadComplete={() => {
        router.refresh();
        onCancel();
        toast.success("Lesson Video Changed.", {
          description: "Your lesson video has been successfully changed.",
        });
      }}
      onUploadError={(error) => {
        console.error("Video Upload Error", error);

        toast.error("Lesson Video Change Failed.", {
          description:
            "An unknown error occurred while changing your lesson video.",
        });
        setIsPending(false);
      }}
      onUploadBegin={() => {
        setIsPending(true);
      }}
      input={{ courseId, lessonId: id }}
    />
  );
};
