"use client";

import { AltActionLink } from "~/components/auth/alt-action-link";
import SocialList from "~/components/auth/social-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type AuthWrapper = {
  children: React.ReactNode;
  title: string;
  description: string;
  altActionHref: string;
  altActionText: string;
  showSocialList?: boolean;
  socialListPosition?: "top" | "bottom";
};

export const AuthWrapper = ({
  children,
  title,
  description,
  altActionHref,
  altActionText,
  showSocialList,
  socialListPosition = "bottom",
}: AuthWrapper) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl xs:text-2xl">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSocialList && socialListPosition === "top" && (
          <SocialList socialListPosition={socialListPosition} />
        )}
        {children}
        {showSocialList && socialListPosition === "bottom" && (
          <SocialList socialListPosition={socialListPosition} />
        )}
      </CardContent>
      <CardFooter>
        <AltActionLink href={altActionHref} text={altActionText} />
      </CardFooter>
    </Card>
  );
};
