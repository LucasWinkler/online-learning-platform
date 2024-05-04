/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

/**
 * The prefix for all instructor routes
 * Routes that start with this prefix are only accessible to instructors
 */
export const instructorRoutePrefix = "/manage";

/**
 * The prefix for all API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const authApiRoutePrefix = "/api/auth";

/**
 * The route for the unauthorized page
 * This route is used when the user is not authorized to access a page
 */
export const unauthorizedRoute = "/auth/unauthorized";

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
