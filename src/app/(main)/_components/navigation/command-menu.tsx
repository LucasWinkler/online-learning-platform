"use client";

import type { User } from "next-auth";

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
import {
  instructorCommandMenuGroup,
  settingsCommandMenuGroup,
  studentCommandMenuGroup,
} from "~/lib/links";
import { cn } from "~/lib/utils";

type CommandMenuProps = {
  className?: string;
  user?: User;
};

export const CommandMenu = ({ user, className }: CommandMenuProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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

  const handleItemSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

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
        <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm font-medium text-muted-foreground">
          <CommandIcon aria-hidden="true" className="size-4" />
          <span className="sr-only">Command plus</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found...</CommandEmpty>
          {user?.role === Role.ADMIN && (
            <CommandGroup heading={instructorCommandMenuGroup.title}>
              {instructorCommandMenuGroup.links.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => handleItemSelect(item.href)}
                  key={item.href}
                >
                  <item.icon className="mr-2 size-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading={studentCommandMenuGroup.title}>
            {studentCommandMenuGroup.links.map((item) => (
              <CommandItem
                className="cursor-pointer"
                onSelect={() => handleItemSelect(item.href)}
                key={item.href}
              >
                <item.icon className="mr-2 size-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={settingsCommandMenuGroup.title}>
            {settingsCommandMenuGroup.links.map((item) => (
              <CommandItem
                className="cursor-pointer"
                onSelect={() => handleItemSelect(item.href)}
                key={item.href}
              >
                <item.icon className="mr-2 size-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
