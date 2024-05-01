import type { IconType } from "~/lib/links";

export type SocialListLayoutType =
  | "icon-full-text"
  | "icon-name-only"
  | "icon-only";

export type SocialListPosition = "top" | "bottom";

export type SocialListProvidersType = {
  provider: "google" | "github";
  displayName: "Google" | "GitHub";
  Icon: IconType;
};
