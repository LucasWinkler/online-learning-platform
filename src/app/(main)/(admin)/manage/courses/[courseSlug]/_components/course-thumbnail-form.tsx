"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UploadDropzone } from "~/lib/uploadthing";

type CourseThumbnailFormProps = {
  id: string;
  slug: string;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const CourseThumbnailForm = ({
  id,
  slug,
  onCancel,
  onPendingStateChange,
}: CourseThumbnailFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onPendingStateChange(isPending);
  }, [isPending, onPendingStateChange]);

  return (
    <UploadDropzone
      className="cursor-pointer bg-background transition-colors duration-200 ease-out hover:bg-gray-100"
      endpoint="courseThumbnail"
      onClientUploadComplete={() => {
        router.refresh();
        onCancel();
        toast.success("Course Thumbnail Changed.", {
          description: "Your course thumbnail has been successfully changed.",
        });
      }}
      onUploadError={() => {
        toast.error("Course Thumbnail Change Failed.", {
          description:
            "An unknown error occurred while changing your course thumbnail.",
        });
        setIsPending(false);
      }}
      onUploadBegin={() => {
        setIsPending(true);
      }}
      input={{ courseId: id, courseSlug: slug }}
    />
  );
};
