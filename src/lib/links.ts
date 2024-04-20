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
    title: "FAQ",
    href: "/faq",
  },
];

export const mobileMenuLinks: NavigationLinks[] = [];
