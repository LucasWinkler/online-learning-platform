import type { SocialListLayoutType, SocialListPosition } from "~/types/auth";

import { SocialButton } from "~/components/auth/social-button";
import { Separator } from "~/components/ui/separator";
import { socialListProviders } from "~/lib/links";

type SocialListProps = {
  separatorPosition?: SocialListPosition;
  layoutType?: SocialListLayoutType;
};

const SocialListSeparator = () => (
  <div className="my-4 flex items-center justify-center">
    <Separator className="shrink" />
    <span className="px-4 text-sm uppercase text-muted-foreground">Or</span>
    <Separator className="shrink" />
  </div>
);

export const SocialList = ({
  separatorPosition = "bottom",
  layoutType = "icon-full-text",
}: SocialListProps) => {
  const classNames = {
    "icon-full-text": "w-full space-y-2",
    "icon-name-only": "flex gap-2 flex-wrap xxs:flex-nowrap",
    "icon-only": "flex gap-2",
  };

  return (
    <>
      {separatorPosition === "bottom" && <SocialListSeparator />}
      <div className={classNames[layoutType]}>
        {socialListProviders.map((social) => (
          <SocialButton
            key={social.provider}
            layoutType={layoutType}
            social={social}
          />
        ))}
      </div>
      {separatorPosition === "top" && <SocialListSeparator />}
    </>
  );
};
