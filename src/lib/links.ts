import type { SocialListProvidersType } from "~/types/auth";
import type { LucideIcon } from "lucide-react";

import { LockKeyholeIcon, SettingsIcon, UserIcon } from "lucide-react";

import { GitHubIcon, GoogleIcon } from "~/components/icons";

export type IconType =
  | ((props: React.ComponentPropsWithoutRef<"svg">) => JSX.Element)
  | LucideIcon;

export type NavigationLinks = {
  title: string;
  href: string;
  target?: string;
};

export type SettingsNavigationLinks = {
  label: string;
  href: string;
  Icon: IconType;
};

export const mainNavigationLinks: NavigationLinks[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Courses",
    href: "/courses",
  },
];

export const mobileMenuLinks: NavigationLinks[] = [];

export const settingsNavigationLinks: SettingsNavigationLinks[] = [
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
