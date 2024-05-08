/**
 * The default redirect path after logging in for students
 */
export const DEFAULT_REDIRECT = "/";

/**
 * The prefix for all instructor routes
 * Routes that start with this prefix are only accessible to instructors
 * This route is also the default redirect path after logging in for instructors
 */
export const INSTRUCTOR_ROUTE_PREFIX = "/manage";

/**
 * The prefix for all API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const AUTH_API_ROUTE_PREFIX = "/api/auth";

/**
 * The prefix for all uploadthing routes
 * Routes that start with this prefix are used for uploadthing purposes
 */
export const UT_API_ROUTE_PREFIX = "/api/uploadthing";

/**
 * The route for the unauthorized page
 * This route is used when the user is not authorized to access a page
 */
export const UNAUTHORIZED_ROUTE = "/auth/unauthorized";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const PUBLIC_ROUTES = [
  "/",
  "/courses",
  "/auth/email-verification",
  "/auth/account-deleted",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to the default login redirect
 */
export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/account-deleted",
];
