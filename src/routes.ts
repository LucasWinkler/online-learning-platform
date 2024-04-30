/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const unprotectedRoutes = ["/", "/courses", "/auth/verify-email"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to DEFAULT_LOGIN_REDIRECT
 */
export const authenticationRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for all API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const authApiRoutePrefix = "/auth";
