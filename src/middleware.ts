import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired({
  returnTo(req) {
    return `${req.nextUrl.basePath}${req.nextUrl.pathname}`;
  },
});

export const config = {
  matcher: [
    "/course/:courseSlug/:chapterSlug/:lessonSlug*",
    "/dashboard/:path*",
  ],
};