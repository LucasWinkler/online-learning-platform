import type { IconType } from "~/lib/links";

export type SocialListLayoutType =
  | "icon-full-text"
  | "icon-name-only"
  | "icon-only";

export type SocialListPosition = "top" | "bottom";

export type SocialListProvidersType = {
  provider: string;
  title: string;
  icon: IconType;
};
