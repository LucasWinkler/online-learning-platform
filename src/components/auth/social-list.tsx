"use client";

import { GitHubIcon, GoogleIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

type SocialListProps = {
  socialListPosition?: "top" | "bottom";
};

export const SocialList = ({
  socialListPosition = "bottom",
}: SocialListProps) => {
  const renderSeparator = () => (
    <div className="my-4 flex items-center justify-center">
      <Separator className="shrink" />
      <span className="px-4 text-sm uppercase text-muted-foreground">Or</span>
      <Separator className="shrink" />
    </div>
  );

  return (
    <>
      {socialListPosition === "bottom" && renderSeparator()}
      <div className="w-full space-y-2">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            console.log("Google");
          }}
        >
          <GoogleIcon className="h-5 w-5" />
          <span className="xxs:inline ml-2 hidden">Continue with Google</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            console.log("GitHub");
          }}
        >
          <GitHubIcon className="h-5 w-5" />
          <span className="xxs:inline ml-2 hidden">Continue with GitHub</span>
        </Button>
      </div>
      {socialListPosition === "top" && renderSeparator()}
    </>
  );
};

export default SocialList;
