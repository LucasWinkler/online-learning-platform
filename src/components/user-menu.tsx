"use client";

import { Role } from "@prisma/client";
import {
  ArrowLeftRightIcon,
  ArrowRightLeftIcon,
  ChevronDownIcon,
  PowerIcon,
  UserRoundIcon,
} from "lucide-react";

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
import { useIsInstructorPage } from "~/hooks/use-is-instructor-page";
import {
  commonUserMenuLinks,
  instructorDashboardLinks,
  studentDashboardLinks,
} from "~/lib/links";

import { Badge } from "./ui/badge";

type UserMenuProps = {
  fullName: string;
  email: string;
  avatarImage?: string | null;
  role: Role;
};

export const UserMenu = ({
  fullName,
  email,
  role,
  avatarImage,
}: UserMenuProps) => {
  const isInstructorPage = useIsInstructorPage();
  const links = isInstructorPage
    ? instructorDashboardLinks
    : studentDashboardLinks;
  const isInstructor = role === Role.ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-1 md:gap-2">
        <Avatar className="size-9">
          <AvatarImage src={avatarImage ?? undefined} />
          <AvatarFallback className="bg-neutral-500 text-neutral-50">
            <UserRoundIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col items-start md:flex">
          <span className="max-w-[6.5625rem] truncate text-sm font-medium">
            {fullName}
          </span>
          {isInstructor ? (
            <>
              {isInstructorPage ? (
                <span className="rounded bg-primary/10 p-1 text-xs font-medium text-primary/80">
                  Instructor View
                </span>
              ) : (
                <span className="rounded bg-amber-500/10 p-1 text-xs font-medium text-amber-500">
                  Student View
                </span>
              )}
            </>
          ) : (
            <span className="max-w-[6.5625rem] truncate text-xs font-normal text-neutral-500">
              {email}
            </span>
          )}
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
          {links.map((link) => (
            <DropdownMenuItem
              key={link.href}
              className="cursor-pointer"
              asChild
            >
              <Link className="flex items-center gap-2" href={link.href}>
                <link.icon className="size-4" />
                {link.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {isInstructor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  className="flex items-center gap-2"
                  href={isInstructorPage ? "/" : "/manage"}
                >
                  {isInstructorPage ? (
                    <>
                      <ArrowRightLeftIcon className="size-4" />
                      <span>View as</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeftRightIcon className="size-4" />
                      <span>View as</span>
                    </>
                  )}
                  {isInstructorPage ? (
                    <>
                      <Badge variant="student">Student</Badge>
                    </>
                  ) : (
                    <>
                      <Badge variant="default">Instructor</Badge>
                    </>
                  )}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        {commonUserMenuLinks.map((link) => (
          <DropdownMenuGroup className="space-y-1" key={link.href}>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link className="flex items-center gap-2" href={link.href}>
                <link.icon className="size-4" />
                {link.title}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="cursor-pointer" asChild>
            <LogoutButton
              className="flex w-full items-center justify-start gap-2"
              variant="none"
              size="none"
              weight="normal"
            >
              <PowerIcon className="size-4" />
              Sign out
            </LogoutButton>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
