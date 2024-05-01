import {
  authApiRoutePrefix,
  authenticationRoutes,
  DEFAULT_LOGIN_REDIRECT,
  unprotectedRoutes,
} from "~/routes";
import { auth } from "~/server/auth";

// Protect all routes except for "/", static assets, and api routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isPublicRoute = unprotectedRoutes.includes(nextUrl.pathname);
  const isAuthApiRoute = nextUrl.pathname.startsWith(authApiRoutePrefix);
  const isAuthPageRoute = authenticationRoutes.includes(nextUrl.pathname);

  if (isAuthApiRoute) {
    return;
  }

  if (isAuthPageRoute && isAuthenticated) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isAuthPageRoute) {
    return;
  }

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  if (nextUrl.pathname === "/settings") {
    return Response.redirect(new URL("/settings/profile", nextUrl));
  }

  return;
});
