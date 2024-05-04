"use client";

import type { User } from "next-auth";

import { useRef } from "react";
import { ImageUpIcon, UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";

type AvatarButtonProps = {
  user?: User;
};

export const AvatarButton = ({ user }: AvatarButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = user?.image;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={handleAvatarClick}
        className="group relative overflow-hidden"
      >
        <ImageUpIcon className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 text-gray-100 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
        <div className="absolute inset-0 z-[1] rounded-full bg-black/35 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
        <Avatar className="size-[4.5rem]">
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback>
            <UserRoundIcon className="size-8" />
          </AvatarFallback>
        </Avatar>
      </button>
      <Input
        ref={fileInputRef}
        className="sr-only h-0 w-0 p-0"
        aria-label="Upload profile picture"
        type="file"
        accept="image/png,image/jpeg"
      />
    </>
  );
};
