"use client";

import { Role } from "@prisma/client";
import {
  ArrowLeftRightIcon,
  ArrowRightLeftIcon,
  ChevronDownIcon,
  PowerIcon,
  UserRoundIcon,
} from "lucide-react";
import { type User } from "next-auth";

import { LogoutButton } from "~/components/auth/logout-button";
import { Link } from "~/components/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useViewPageAs } from "~/hooks/use-view-page-as";
import {
  commonUserMenuLinks,
  instructorDashboardLinks,
  studentDashboardLinks,
} from "~/lib/links";

type UserMenuProps = {
  user: User;
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const viewPageAs = useViewPageAs(user?.role);
  const links =
    viewPageAs === "instructor"
      ? instructorDashboardLinks
      : studentDashboardLinks;

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-1 md:gap-2">
        <Avatar className="size-9 [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-out [&>*]:group-hover:scale-[1.15]">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="bg-neutral-500 text-neutral-50">
            <UserRoundIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col items-start md:flex">
          <span className="max-w-[6.5625rem] truncate text-sm font-medium">
            {user.name}
          </span>
          {user.role === Role.ADMIN ? (
            <>
              {viewPageAs === "instructor" ? (
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
              {user.email}
            </span>
          )}
        </div>
        <span className="hidden self-center justify-self-end rounded-md p-2 transition-all duration-300 group-hover:bg-neutral-100 md:block">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs font-normal text-neutral-500">
            {user.email}
          </span>
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
        {user.role === Role.ADMIN && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  className="flex items-center gap-2"
                  href={viewPageAs === "instructor" ? "/" : "/manage"}
                >
                  {viewPageAs === "instructor" ? (
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
                  {viewPageAs === "instructor" ? (
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
