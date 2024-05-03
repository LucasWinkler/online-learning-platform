/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const unprotectedRoutes = [
  "/",
  "/courses",
  "/auth/email-verification",
  "/auth/account-deleted",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to DEFAULT_LOGIN_REDIRECT
 */
export const authenticationRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/account-deleted",
];

/**
 * The prefix for all API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const authApiRoutePrefix = "/api/auth";
