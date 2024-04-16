/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import withPlaiceholder from "@plaiceholder/next";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.gravatar.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "fakeimg.pl",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.imgur.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
    typedRoutes: true,
  },
};

export default withPlaiceholder(config);
