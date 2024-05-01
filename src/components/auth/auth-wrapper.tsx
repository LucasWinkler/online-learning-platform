"use client";

import type { SocialListLayoutType, SocialListPosition } from "~/types/auth";

import { AltActionLink } from "~/components/auth/alt-action-link";
import { AuthHeader } from "~/components/auth/auth-header";
import { SocialList } from "~/components/auth/social-list";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

type AuthWrapperProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  altActionHref?: string;
  altActionText?: string;
  altActionLinkText?: string;
  altActionOnClick?: () => void;
  showSocialList?: boolean;
  socialListPosition?: SocialListPosition;
  socialListLayoutType?: SocialListLayoutType;
} & React.ComponentProps<typeof Card>;

export const AuthWrapper = ({
  children,
  title,
  description,
  altActionHref,
  altActionText,
  altActionLinkText,
  altActionOnClick,
  showSocialList,
  socialListPosition = "bottom",
  socialListLayoutType = "icon-full-text",
  ...props
}: AuthWrapperProps) => {
  return (
    <Card
      className="mx-auto h-full w-full rounded-none border-0 shadow-none xxs:h-auto xxs:max-w-[400px] xxs:rounded-lg xxs:border xxs:shadow-md"
      {...props}
    >
      <CardHeader className="text-center">
        <AuthHeader title={title} description={description} />
      </CardHeader>
      <CardContent>
        {showSocialList && socialListPosition === "top" && (
          <SocialList
            layoutType={socialListLayoutType}
            separatorPosition={socialListPosition}
          />
        )}
        {children}
        {showSocialList && socialListPosition === "bottom" && (
          <SocialList
            layoutType={socialListLayoutType}
            separatorPosition={socialListPosition}
          />
        )}
      </CardContent>
      <CardFooter>
        <AltActionLink
          href={altActionHref}
          text={altActionText}
          linkText={altActionLinkText}
          onClick={altActionOnClick}
        />
      </CardFooter>
    </Card>
  );
};
