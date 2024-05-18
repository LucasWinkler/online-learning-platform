"use client";

import { forwardRef, useEffect, useState } from "react";
import { toast } from "sonner";

import { UploadDropzone } from "~/lib/uploadthing";

type CourseThumbnailFormProps = {
  id: string;
  image: string | null;
  onCancel: () => void;
  onPendingStateChange: (isPending: boolean) => void;
};

export const CourseThumbnailForm = forwardRef(
  (
    { id, image, onCancel, onPendingStateChange }: CourseThumbnailFormProps,
    ref,
  ) => {
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
      onPendingStateChange(isPending);
    }, [isPending, onPendingStateChange]);

    return (
      <UploadDropzone
        className="cursor-pointer bg-background transition-colors duration-200 ease-out hover:bg-gray-100"
        endpoint="courseThumbnail"
        onClientUploadComplete={(res) => {
          const image = res[0]?.url;
          console.log(image);

          onCancel();
          toast.success("Course Thumbnail Changed.", {
            description: "Your course thumbnail has been successfully changed.",
          });
        }}
        onUploadError={(error) => {
          console.error("Thumbnail Upload Error", error);

          toast.error("Course Thumbnail Change Failed.", {
            description:
              "An unknown error occurred while changing your course thumbnail.",
          });
          setIsPending(false);
        }}
        onUploadBegin={() => {
          setIsPending(true);
        }}
      />
    );
  },
);

CourseThumbnailForm.displayName = "CourseThumbnailForm";
