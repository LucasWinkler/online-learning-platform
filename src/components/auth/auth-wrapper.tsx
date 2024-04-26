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
  altActionHref: string;
  altActionText: string;
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
  showSocialList,
  socialListPosition = "bottom",
  socialListLayoutType = "icon-full-text",
  ...props
}: AuthWrapperProps) => {
  return (
    <Card
      className="mx-auto h-full w-full max-w-[400px] rounded-none border-0 shadow-none xs:mt-10 xs:h-auto xs:rounded-lg xs:border xs:shadow-md"
      {...props}
    >
      <CardHeader>
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
        <AltActionLink href={altActionHref} text={altActionText} />
      </CardFooter>
    </Card>
  );
};
