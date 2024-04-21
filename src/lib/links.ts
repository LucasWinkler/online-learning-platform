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
  {
    title: "Login",
    href: "/api/auth/login",
  },
  {
    title: "Sign Up",
    href: "/api/auth/signup",
  },
  {
    title: "Logout",
    href: "/api/auth/logout",
  },
];

export const mobileMenuLinks: NavigationLinks[] = [];
