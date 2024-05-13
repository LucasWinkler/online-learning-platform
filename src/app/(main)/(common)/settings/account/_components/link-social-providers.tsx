"use client";

import { SocialButton } from "~/components/auth/social-button";
import { socialListProviders } from "~/lib/links";

type LinkSocialProvidersProps = {
  disabled?: boolean;
};

export const LinkSocialProviders = ({
  disabled = false,
}: LinkSocialProvidersProps) => {
  return (
    <>
      {socialListProviders.map((social) => (
        <SocialButton
          disabled={disabled}
          key={social.provider}
          layoutType="icon-name-only"
          social={social}
        />
      ))}
    </>
  );
};
