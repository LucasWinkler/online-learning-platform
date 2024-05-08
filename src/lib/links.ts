import type { SocialListProvidersType } from "~/types/auth";
import type { LucideIcon } from "lucide-react";

import {
  BookMarkedIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  LogInIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { GitHubIcon, GoogleIcon } from "~/components/icons";

export type IconType =
  | ((props: React.ComponentPropsWithoutRef<"svg">) => JSX.Element)
  | LucideIcon;

export type DashboardSidebarLinks = {
  title: string;
  href: string;
  icon: IconType;
};

export type SettingsLinks = DashboardSidebarLinks;

export type CommandMenuLinks = DashboardSidebarLinks;

export type CommandMenuGroup = {
  title: string;
  links: CommandMenuLinks[];
};

export const studentDashboardLinks: DashboardSidebarLinks[] = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "All Courses",
    href: "/courses",
    icon: BookOpenIcon,
  },
  {
    title: "My Courses",
    href: "/my-courses",
    icon: BookMarkedIcon,
  },
];

export const instructorDashboardLinks: DashboardSidebarLinks[] = [
  {
    title: "Overview",
    href: "/manage",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Courses",
    href: "/manage/courses",
    icon: BookOpenIcon,
  },
  {
    title: "Students",
    href: "/manage/students",
    icon: UsersIcon,
  },
];

export const commonUserMenuLinks: DashboardSidebarLinks[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export const settingsNavigationLinks: SettingsLinks[] = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: UserIcon,
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: SettingsIcon,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: LockKeyholeIcon,
  },
];

export const publicCommandMenuGroup: CommandMenuGroup = {
  title: "Public Access",
  links: [
    {
      title: "Overview",
      href: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "All Courses",
      href: "/courses",
      icon: BookOpenIcon,
    },
    {
      title: "Sign In",
      href: "/auth/login",
      icon: LogInIcon,
    },
    {
      title: "Sign Up",
      href: "/auth/register",
      icon: UserPlusIcon,
    },
  ],
};

export const studentCommandMenuGroup: CommandMenuGroup = {
  title: "Learning",
  links: [
    {
      title: "All Courses",
      href: "/courses",
      icon: BookOpenIcon,
    },
    {
      title: "My Courses",
      href: "/my-courses",
      icon: BookMarkedIcon,
    },
  ],
};

export const instructorCommandMenuGroup: CommandMenuGroup = {
  title: "Management",
  links: [
    {
      title: "Courses",
      href: "/manage/courses",
      icon: BookOpenIcon,
    },
    {
      title: "Students",
      href: "/manage/students",
      icon: UsersIcon,
    },
  ],
};

export const settingsCommandMenuGroup: CommandMenuGroup = {
  title: "Settings",
  links: [
    {
      title: "Profile",
      href: "/settings/profile",
      icon: UserIcon,
    },
    {
      title: "Account",
      href: "/settings/account",
      icon: SettingsIcon,
    },
    {
      title: "Security",
      href: "/settings/security",
      icon: LockKeyholeIcon,
    },
  ],
};

export const socialListProviders: SocialListProvidersType[] = [
  {
    provider: "google",
    title: "Google",
    icon: GoogleIcon,
  },
  {
    provider: "github",
    title: "GitHub",
    icon: GitHubIcon,
  },
];
