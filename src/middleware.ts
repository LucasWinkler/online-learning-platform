import { Role } from "@prisma/client";

import {
  authApiRoutePrefix,
  authenticationRoutes,
  instructorRoutePrefix,
  unauthorizedRoute,
  unprotectedRoutes,
  uploadThingApiRoutePrefix,
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

  const isAuthApiRoute = nextUrl.pathname.startsWith(authApiRoutePrefix);
  const isUploadThingApiRoute = nextUrl.pathname.startsWith(
    uploadThingApiRoutePrefix,
  );

  const isPublicRoute = unprotectedRoutes.includes(nextUrl.pathname);
  const isAuthPageRoute = authenticationRoutes.includes(nextUrl.pathname);
  const isInstructorRoute = nextUrl.pathname.startsWith(instructorRoutePrefix);

  const loginRedirectUrl = Role.ADMIN
    ? instructorRoutePrefix
    : instructorRoutePrefix;

  // Ensure anyone can access certain api routes
  if (isAuthApiRoute || isUploadThingApiRoute) {
    return;
  }

  // Redirect if user is authenticated and trying to access an authentication page
  if (isAuthPageRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL(loginRedirectUrl, nextUrl));
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
