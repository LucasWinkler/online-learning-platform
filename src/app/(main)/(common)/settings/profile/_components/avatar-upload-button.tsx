"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { ImageUpIcon, Loader2Icon, UserRoundIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUploadThing } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";

type AvatarUploadButtonProps = {
  className?: string;
};

export const AvatarUploadButton = ({ className }: AvatarUploadButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const { data: session, update } = useSession();
  const image = session?.user?.image;

  const { startUpload, permittedFileInfo } = useUploadThing("profilePicture", {
    onClientUploadComplete: (res) => {
      const image = res[0]?.url;

      update({
        user: {
          ...session?.user,
          image: image,
        },
      })
        .then(() => {
          toast.success("Profile picture uploaded successfully!");
        })
        .catch(() => {
          toast.error("Error occurred while uploading profile picture");
        })
        .finally(() => {
          setIsPending(false);
        });
    },
    onUploadError: () => {
      toast.error("Error occurred while uploading profile picture");
      setIsPending(false);
    },
    onUploadBegin: () => {
      setIsPending(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        void startUpload(acceptedFiles);
      }
    },
    [startUpload],
  );

  const onSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }

      void startUpload(Array.from(e.target.files));
    },
    [startUpload],
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple: false,
  });

  return (
    <div
      className={cn(
        "group relative size-[4.5rem] cursor-pointer overflow-hidden rounded-full",
        className,
      )}
      {...getRootProps()}
    >
      {isPending ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 select-none">
          <span className="sr-only">Uploading...</span>
          <Loader2Icon className="animate-spin text-gray-100 opacity-100" />
        </div>
      ) : (
        <>
          <span className="sr-only">
            Click or drag an image to upload profile picture
          </span>
          <ImageUpIcon className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 select-none text-gray-100 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
        </>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] select-none rounded-full bg-black/35 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
          isPending && "opacity-100",
        )}
      />
      <Avatar className="pointer-events-none size-[4.5rem] select-none">
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback>
          <UserRoundIcon className="size-8" />
        </AvatarFallback>
      </Avatar>
      <input {...getInputProps()} onChange={onSelectFile} />
    </div>
  );
};
