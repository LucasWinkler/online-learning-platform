import {
  authApiRoutePrefix,
  authenticationRoutes,
  DEFAULT_LOGIN_REDIRECT,
  unprotectedRoutes,
} from "~/routes";
import { auth } from "~/server/auth";

/**
 * This middleware is used to allow access to specific routes and redirect depending
 * on the user's authentication status. By default the matcher config will protect all
 * routes except for static assets and api routes.
 *
 * If the route is a /api/auth route, the middleware will not redirect the user.
 *
 * If the route is an authentication page route and the user is authenticated, the
 * middleware will redirect the user to the default login redirect ("/").
 *
 * If the route is an authentication page route and the user is not authenticated,
 * the middleware will not redirect the user.
 *
 * If the route is not protected and the user is not authenticated, the middleware
 * will redirect the user to the login page.
 */
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

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
