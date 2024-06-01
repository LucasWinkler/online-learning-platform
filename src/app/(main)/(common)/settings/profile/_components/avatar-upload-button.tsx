"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { ImageUpIcon, Loader2Icon, UserRoundIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUploadThing } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { updateUserProfileImage } from "~/server/actions/update-user-profile-image";

type AvatarUploadButtonProps = {
  className?: string;
};

export const AvatarUploadButton = ({ className }: AvatarUploadButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const image = session?.user?.image;

  const { startUpload, permittedFileInfo } = useUploadThing("profilePicture", {
    onClientUploadComplete: ([uploadedFile]) => {
      if (!uploadedFile?.url) {
        toast.error("Profile Picture Change Failed.", {
          description:
            "An unknown error occurred while changing your profile picture.",
        });
        return;
      }

      updateUserProfileImage(uploadedFile.url)
        .then(() => {
          void update({ user: { image: uploadedFile.url } });
          toast.success("Profile Picture Changed.", {
            description: "Your profile picture has been successfully changed.",
          });
          router.refresh();
        })
        .catch(() => {
          toast.error("Profile Picture Change Failed.", {
            description:
              "An unknown error occurred while changing your profile picture.",
          });
        })
        .finally(() => {
          setIsPending(false);
        });
    },
    onUploadError: () => {
      toast.error("Profile Picture Change Failed.", {
        description:
          "An unknown error occurred while changing your profile picture.",
      });
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
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] size-6 -translate-x-1/2 -translate-y-1/2 select-none">
          <span className="sr-only">Uploading...</span>
          <Loader2Icon className="animate-spin text-gray-100" />
        </div>
      ) : (
        <>
          <span className="sr-only">
            Click or drag an image to upload a profile picture
          </span>
          <ImageUpIcon className="pointer-events-none absolute left-1/2 top-1/2 z-[2] size-6 -translate-x-1/2 -translate-y-1/2 select-none text-gray-100 opacity-100 transition-all duration-300 ease-out group-hover:text-gray-50" />
        </>
      )}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] m-3.5 select-none rounded-full bg-black/35 opacity-75 backdrop-blur-sm transition-opacity duration-300 ease-out group-hover:opacity-90",
          isPending && "opacity-90",
        )}
      />
      <Avatar className="pointer-events-none size-[4.5rem] select-none">
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback>
          <UserRoundIcon className="size-8" />
        </AvatarFallback>
      </Avatar>
      <input {...getInputProps()} autoComplete="off" onChange={onSelectFile} />
    </div>
  );
};
