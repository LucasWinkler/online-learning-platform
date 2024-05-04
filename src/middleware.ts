import { Role } from "@prisma/client";

import {
  authApiRoutePrefix,
  authenticationRoutes,
  DEFAULT_LOGIN_REDIRECT,
  instructorRoutePrefix,
  unauthorizedRoute,
  unprotectedRoutes,
} from "~/routes";
import { auth } from "~/server/auth";

// Runs middleware on all routes except for static assets
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user.role;

  const isPublicRoute = unprotectedRoutes.includes(nextUrl.pathname);
  const isAuthApiRoute = nextUrl.pathname.startsWith(authApiRoutePrefix);
  const isAuthPageRoute = authenticationRoutes.includes(nextUrl.pathname);
  const isInstructorRoute = nextUrl.pathname.startsWith(instructorRoutePrefix);

  // Ensure anyone can access /api/auth/[...nextauth]
  if (isAuthApiRoute) {
    return;
  }

  // Redirect to home if user is authenticated and trying to access an authentication page
  if (isAuthPageRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return;
  }

  // Redirect to login if user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // Redirect to unauthorized if user is not an instructor and trying to access an instructor route
  if (isInstructorRoute) {
    if (userRole !== Role.ADMIN) {
      return Response.redirect(new URL(unauthorizedRoute, nextUrl));
    }

    return;
  }

  // Map /settings to /settings/profile
  if (nextUrl.pathname === "/settings") {
    return Response.redirect(new URL("/settings/profile", nextUrl));
  }

  return;
});
