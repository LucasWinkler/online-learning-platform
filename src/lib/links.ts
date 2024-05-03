import type { SocialListProvidersType } from "~/types/auth";
import type { LucideIcon } from "lucide-react";

import {
  BookMarkedIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { GitHubIcon, GoogleIcon } from "~/components/icons";

export type IconType =
  | ((props: React.ComponentPropsWithoutRef<"svg">) => JSX.Element)
  | LucideIcon;

export type DashboardSidebarLinks = {
  title: string;
  href: string;
  Icon: IconType;
};

export type SettingsLinks = {
  label: string;
  href: string;
  Icon: IconType;
};

export const studentDashboardLinks: DashboardSidebarLinks[] = [
  {
    title: "Overview",
    href: "/",
    Icon: LayoutDashboardIcon,
  },
  {
    title: "All Courses",
    href: "/courses",
    Icon: BookOpenIcon,
  },
  {
    title: "My Courses",
    href: "/my-courses",
    Icon: BookMarkedIcon,
  },
];

export const instructorDashboardLinks: DashboardSidebarLinks[] = [
  {
    title: "Overview",
    href: "/manage",
    Icon: LayoutDashboardIcon,
  },
  {
    title: "Courses",
    href: "/manage/courses",
    Icon: BookOpenIcon,
  },
  {
    title: "Students",
    href: "/manage/students",
    Icon: UsersIcon,
  },
];

export const commonUserMenuLinks: DashboardSidebarLinks[] = [
  {
    title: "Settings",
    href: "/settings",
    Icon: SettingsIcon,
  },
];

export const settingsNavigationLinks: SettingsLinks[] = [
  {
    label: "Profile",
    href: "/settings/profile",
    Icon: UserIcon,
  },
  {
    label: "Account",
    href: "/settings/account",
    Icon: SettingsIcon,
  },
  {
    label: "Security",
    href: "/settings/security",
    Icon: LockKeyholeIcon,
  },
];

export const socialListProviders: SocialListProvidersType[] = [
  {
    provider: "google",
    displayName: "Google",
    Icon: GoogleIcon,
  },
  {
    provider: "github",
    displayName: "GitHub",
    Icon: GitHubIcon,
  },
];
