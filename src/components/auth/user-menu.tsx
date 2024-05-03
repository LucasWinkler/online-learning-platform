"use client";

import { Role } from "@prisma/client";
import { ChevronDownIcon, UserRoundIcon } from "lucide-react";

import { LogoutButton } from "~/components/auth/logout-button";
import { Link } from "~/components/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type UserMenuProps = {
  fullName: string;
  email: string;
  avatarImage?: string;
  role: Role;
};

export const UserMenu = ({
  fullName,
  email,
  role,
  avatarImage,
}: UserMenuProps) => {
  const roleText = role === Role.USER ? "Student" : "Instructor";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-1 md:gap-2">
        <Avatar className="size-8">
          <AvatarImage src={avatarImage} />
          <AvatarFallback className="bg-neutral-500 text-neutral-50">
            <UserRoundIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col items-start md:flex">
          <span className="max-w-[6.5625rem] truncate text-sm font-medium">
            {fullName}
          </span>
          <span className="text-xs font-normal text-neutral-500">
            {roleText}
          </span>
        </div>
        <span className="hidden self-center justify-self-end rounded-md p-2 transition-all duration-300 group-hover:bg-neutral-100 md:block">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">{fullName}</span>
          <span className="text-xs font-normal text-neutral-500">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/courses">Courses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/settings/profile">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <LogoutButton
            className="w-full justify-start"
            variant="none"
            size="none"
            weight="normal"
          >
            Sign out
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
