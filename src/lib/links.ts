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
  {
    title: "User Dashboard",
    href: "/app",
  },
  {
    title: "Admin Dashboard",
    href: "/admin",
  },
];

export const mobileMenuLinks: NavigationLinks[] = [];
