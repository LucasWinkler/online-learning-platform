import { GitHubIcon, GoogleIcon } from "~/components/icons";

export type NavigationLinks = {
  title: string;
  href: string;
  target?: string;
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

export type SocialListProvidersType = {
  provider: "google" | "github";
  displayName: "Google" | "GitHub";
  Icon: (props: React.ComponentPropsWithoutRef<"svg">) => JSX.Element;
};

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
