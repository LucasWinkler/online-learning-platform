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

type AuthWrapperProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  altActionHref: string;
  altActionText: string;
  showSocialList?: boolean;
  socialListPosition?: "top" | "bottom";
} & React.ComponentProps<typeof Card>;

export const AuthWrapper = ({
  children,
  title,
  description,
  altActionHref,
  altActionText,
  showSocialList,
  socialListPosition = "bottom",
  ...props
}: AuthWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md" {...props}>
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
