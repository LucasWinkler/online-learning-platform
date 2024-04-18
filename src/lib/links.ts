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
    title: "Course",
    href: "/course",
  },
  {
    title: "Google",
    href: "https://www.google.com/",
    target: "_blank",
  },
];

export const mobileMenuLinks: NavigationLinks[] = [];
