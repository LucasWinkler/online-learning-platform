import { Role } from "@prisma/client";

import {
  AUTH_API_ROUTE_PREFIX,
  AUTH_ROUTES,
  DEFAULT_REDIRECT,
  INSTRUCTOR_ROUTE_PREFIX,
  PUBLIC_ROUTES,
  UNAUTHORIZED_ROUTE,
  UT_API_ROUTE_PREFIX,
} from "~/routes";
import { auth } from "~/server/auth";

// Runs middleware on all routes except for static assets
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};

export default auth(async (req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isAuthApiRoute = nextUrl.pathname.startsWith(AUTH_API_ROUTE_PREFIX);
  const isUTApiRoute = nextUrl.pathname.startsWith(UT_API_ROUTE_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isInstructorRoute = nextUrl.pathname.startsWith(
    INSTRUCTOR_ROUTE_PREFIX,
  );

  const userRole = req.auth?.user.role;
  const loginRedirectUrl =
    userRole === Role.ADMIN ? INSTRUCTOR_ROUTE_PREFIX : DEFAULT_REDIRECT;

  // Ensure anyone can access certain api routes
  if (isAuthApiRoute || isUTApiRoute) {
    return;
  }

  // Redirect if user is authenticated and trying to access an authentication page
  if (isAuthRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL(loginRedirectUrl, nextUrl));
    }

    return;
  }

  // Redirect to login if user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  // Redirect to unauthorized if user is not an instructor and trying to access an instructor route
  if (isInstructorRoute) {
    if (userRole !== Role.ADMIN) {
      return Response.redirect(new URL(UNAUTHORIZED_ROUTE, nextUrl));
    }

    return;
  }

  // Map /settings to /settings/profile
  if (nextUrl.pathname === "/settings") {
    return Response.redirect(new URL("/settings/profile", nextUrl));
  }

  return;
});
