"use client";

import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { CommandIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useCurrentUser } from "~/hooks/use-current-user";
import { cn } from "~/lib/utils";

type CommandSearchListGroup = {
  heading: string;
  role?: Role;
  items: { label: string; path: string }[];
};

export const commandSearchList: CommandSearchListGroup[] = [
  {
    heading: "Student Dashboard",
    items: [
      { label: "Overview", path: "/" },
      { label: "All Courses", path: "/courses" },
      { label: "My Courses", path: "/my-courses" },
    ],
  },
  {
    heading: "Instructor Dashboard",
    role: Role.ADMIN,
    items: [
      { label: "Overview", path: "/manage/" },
      { label: "Students", path: "/manage/students" },
      { label: "Courses", path: "/manage/courses" },
      { label: "Add Course", path: "/manage/courses" },
    ],
  },
  {
    heading: "Settings",
    items: [
      { label: "Profile", path: "/settings/profile" },
      { label: "Account", path: "/settings/account" },
      { label: "Security", path: "/settings/security" },
    ],
  },
];

type CommandMenuProps = {
  className?: string;
};

export const CommandMenu = ({ className }: CommandMenuProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        className={cn(
          "group flex w-full justify-between rounded-md bg-background",
          className,
        )}
        aria-label="Open search menu"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-1">
          <SearchIcon className="size-4" />
          Search...
        </span>
        <span className="flex gap-1 rounded-sm bg-secondary p-1">
          <CommandIcon className="size-4" />K
        </span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found...</CommandEmpty>
          {commandSearchList.map(
            (group) =>
              (!group.role || group.role === user?.role) && (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={item.label}
                      onSelect={() => router.push(item.path)}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ),
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
